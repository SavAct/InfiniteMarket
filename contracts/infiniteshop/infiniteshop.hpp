#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>
#include <eosio/transaction.hpp>

using namespace eosio;
using namespace std;

#define TOKEN_CONTRACT_STR "token.savact"
#define TOKEN_CONTRACT name(TOKEN_CONTRACT_STR)
#define TOKEN_SYMBOL symbol("SAVACT", 4)

#define EXPIRATION_DATE_MIN (7 * 24 * 3600)
#define EXPIRATION_DATE_MAX (90 * 24 * 3600)

namespace savactshop {
  class [[eosio::contract("infiniteshop")]] infiniteshop : public contract {

  public:

    struct tokenSymbol {
      symbol sym;
      name contr;
      string chain;
    };

    struct idAndCategory {
      uint64_t id;
      name category;
    };

    struct toRegion {
      int t;     // Shipping duration
      int p;     // Shipping price
      string rs; // Shipping regions
    };

  private:
    TABLE itemTable{
      uint64_t id; // Item ID
      name seller;  // Seller account name
      bool available; // Item is available for sale
      string title; // Title
      vector<string> imgs; // URL images
      uint64_t price; // Price per unit
      uint32_t prepT; // Preparation duration time after payment
      string fromR; // Shipping from region
      vector<toRegion> shipTo; // Shipping to regions with price and duration
      string excl;  // Excluded regions only needed if i.e. ship to EU but not to Germany
      vector<string> options; // Options
      string descr; // Description
      string note;  // Note from seller to buyer
      uint32_t expired; // At this date the offer is expired and can be removed

      uint64_t primary_key() const { return id; }
    };
    typedef multi_index<name("item"), itemTable> items_table;

    TABLE userTable{
      name user;
      vector<tokenSymbol> allowed;
      bool active;
      uint32_t lastUpdate;
      list<idAndCategory> items;
      bool banned;
      string pgp;
      string note;

      uint64_t primary_key() const { return user.value; }
    };
    typedef multi_index<name("user"), userTable> users_table;

    inline void checkValidExpirationDate(uint32_t expired);
    inline void removeItemFromUserTable(const name& user, const uint64_t id, const name& category);
    inline void removeItemFromUserTable(users_table& users_Table, const users_table::const_iterator& user_itr, const uint64_t id, const name& category);

  public:
    infiniteshop(name s, name code, datastream<const char*> ds);

    /**
     * @brief Delete a user and all his items
     *
     * @param user User account name
     */
    ACTION deleteuser(const name& seller) {
      // The seller and the contract owner can delete the seller
      if (!has_auth(get_self())) {
        require_auth(seller);
      }
      users_table _users(get_self(), get_self().value);
      auto itr = _users.find(seller.value);
      check(itr != _users.end(), "Seller not found");
      if (itr->items.size() > 0) {
        for (auto& i : itr->items) {
          items_table _items(get_self(), i.category.value);
          auto item = _items.find(i.id);
          if (item != _items.end()) {
            _items.erase(item);
          }
        }
      }
      if (!(itr->banned)) {
        _users.erase(itr);
      }
    }

    /**
     * @brief Ban a user
     *
     * @param user User account name
     * @param ban Ban or unban
     */
    ACTION ban(const name& seller, const bool ban) {
      require_auth(get_self());
      users_table _users(get_self(), get_self().value);
      auto itr = _users.find(seller.value);
      check(itr != _users.end(), "User not found");
      _users.modify(itr, get_self(), [&](auto& s) {
        s.banned = ban;
        s.active = false;
        });
    }


    /**
     * @brief Add or update properties of a user
     *
     * @param user User account name
     * @param allowed Allowed token symbols. Can be empty if already defined
     * @param active User is active
     * @param pgp PGP public key. Can be empty if already defined
     * @param note Note of this user. Can be empty if already defined
     */
    ACTION updateuser(const name& user, const vector<tokenSymbol>& allowed, const bool active, const string& pgp, const string& note) {
      require_auth(user);
      users_table _users(get_self(), get_self().value);
      auto itr = _users.find(user.value);
      const bool hasNewTokens = allowed.size() > 0;
      if (itr != _users.end()) {
        _users.modify(itr, get_self(), [&](auto& s) {
          check(hasNewTokens || s.allowed.size() > 0, "No accepted tokens defined");
          if (hasNewTokens) {
            s.allowed = allowed;
          }
          s.active = active;
          s.lastUpdate = eosio::current_time_point().sec_since_epoch();
          if (pgp.length() > 0) {
            s.pgp = pgp;
          }
          if (note.length() > 0) {
            s.note = note;
          }
          });
      }
      else {
        check(hasNewTokens, "No accepted tokens defined");
        _users.emplace(get_self(), [&](auto& s) {
          s.user = user;
          s.allowed = allowed;
          s.active = active;
          s.lastUpdate = eosio::current_time_point().sec_since_epoch();
          s.banned = false;
          s.pgp = pgp;
          s.note = note;
          });
      }
    }

    ACTION additem(const name& seller, const name& category, const string& title, const vector<string>& imgs, const uint64_t price, const uint32_t prepT, const string& fromR, const string& excl, const vector<toRegion>& shipTo, const vector<string>& opts, const string& descr, const string& note, const bool available, const uint32_t expired) {
      require_auth(seller);
      checkValidExpirationDate(expired);
      check(title.length() > 3, "Title is too short");
      check(title.length() <= 80, "Title is too long");
      check(price > 0, "Price cannot be zero");

      check(descr.length() > 3, "Description is too short");
      check(shipTo.size() > 0, "No ship to any region");
      for (auto& r : shipTo) {
        check(r.rs.length() >= 2, "Invalid ship region");
      }
      if (opts.size() > 0) {
        check(opts.size() != 1, "Invalid option number");
        for (auto& opt : opts) {
          check(opt.length() > 0 && opt.length() < 128, "Invalid option text length");
        }
      }
      // Check if seller is banned
      users_table _users(get_self(), get_self().value);
      auto seller_itr = _users.find(seller.value);
      check(seller_itr != _users.end(), "Seller not found");
      check(!(seller_itr->banned), "Seller is banned");

      // Add item
      items_table _items(get_self(), category.value);
      const auto id = _items.available_primary_key();
      _items.emplace(get_self(), [&](auto& i) {
        i.id = id;
        i.seller = seller;
        i.available = available;
        i.title = title;
        i.imgs = imgs;
        i.price = price;
        i.prepT = prepT;
        i.fromR = fromR;
        i.shipTo = shipTo;
        i.excl = excl;
        i.options = opts;
        i.descr = descr;
        i.note = note;
        i.expired = expired;
        });

      // Update user last update state
      _users.modify(seller_itr, get_self(), [&](auto& s) {
        s.items.push_back({id, category});
        s.lastUpdate = eosio::current_time_point().sec_since_epoch();
        });
    }

    /**
     * @brief Remove an item from items table and user table
     *
     * @param id Item ID
     * @param category Category name
     */
    ACTION removeitem(uint64_t id, const name& category) {
      items_table _items(get_self(), category.value);
      auto item = _items.find(id);
      check(item != _items.end(), "Item not found");
      if (!has_auth(item->seller)) {
        check(eosio::current_time_point().sec_since_epoch() > item->expired, "Is not expired yet");
      }
      else {
        require_auth(item->seller);
      }

      // Remove item from seller table
      removeItemFromUserTable(item->seller, id, category);

      // Remove item from item table
      _items.erase(item);
    }

    /**
     * @brief Remove all expired entries
     *
     * @param category Category name
     */
    ACTION rmexpired(const name& category) {
      items_table _items(get_self(), category.value);
      auto item = _items.begin();
      while (item != _items.end()) {
        if (eosio::current_time_point().sec_since_epoch() > item->expired) {
          removeItemFromUserTable(item->seller, item->id, category);
          item = _items.erase(item);
        }
        else {
          item++;
        }
      }
    }

    /**
     * @brief Update the item availability and expiration date
     *
     * @param id Item ID
     * @param category Category name
     * @param available Item is available for sale
     * @param expired At this date the offer is expired and can be removed by anyone
     */
    ACTION itemstate(uint64_t id, const name& category, bool available, uint32_t expired) {
      checkValidExpirationDate(expired);

      items_table _items(get_self(), category.value);
      auto item = _items.find(id);
      require_auth(item->seller);
      check(item != _items.end(), "Item not found");
      _items.modify(item, get_self(), [&](auto& i) {
        i.available = available;
        i.expired = expired;
        });

      // Update user last update state
      users_table _users(get_self(), get_self().value);
      auto seller_itr = _users.find(item->seller.value);
      _users.modify(seller_itr, get_self(), [&](auto& s) {
        s.lastUpdate = eosio::current_time_point().sec_since_epoch();
        });
    }

  };
}
