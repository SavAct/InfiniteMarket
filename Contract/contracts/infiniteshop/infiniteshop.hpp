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

namespace savactshop
{
  class [[eosio::contract("infiniteshop")]] infiniteshop : public contract
  {

  public:
  	/**
     * Reference to a transaction on the blockchain composed of the block number and transaction id
    */
    struct Ref{
      uint64_t Block;
      checksum256 TrxId;
    };
    /**
     * Table to store SavWeb files
    */
    TABLE static_index_table {
      uint64_t      key;        // Primary key
      string        fname;      // File name with name extention
      vector<Ref>   refs;       // ref[0] contains referred transaction of the first transaction. If the file is portioned there is a second entry ref[1] with a reference to the last entry  
      string        attri;      // Attributes / optional moreover stuff
      
      auto primary_key() const { return key; }
    };
  	typedef multi_index<"index"_n, static_index_table> index_table;
  
    /** Set pages for the sale
     * @param key   Primary key of the entry. key == 0 for the landing page
     * @param refs  Reference to the landing page file: ref[0] contains referred transaction of the first transaction. If the file is portioned there is a second entry ref[1] with a reference to the last entry
     * @param attri Attributes / optional moreover stuff
     * @param fname File name with name extension
     */
    ACTION setpage(uint64_t key, vector<Ref>& refs, string& attri, string& fname) {
      require_auth(get_self());

      check(refs.size() > 0, "No ref mentioned.");

      // Init the table
      index_table _indexTable(get_self(), get_self().value);

      // Find the entry
      auto itr = _indexTable.find(key);

      if(itr == _indexTable.end()){
        // Add to table
        _indexTable.emplace(get_self(), [&](auto& p) {
          p.key = key;
          p.attri = attri;
          p.fname = fname;
          p.refs = refs;
        });
      } else {
        // Modify table
        _indexTable.modify(itr, eosio::same_payer, [&](auto& p) {
          p.attri = attri;
          p.fname = fname;
          p.refs = refs;
        });
      }
    }

  public:
    struct tokenSymbol
    {
      symbol sym;
      name contr;
      string chain; 
    };

    struct idAndCategory
    {
      uint64_t id;       // Item id
      uint64_t category; // Category index
    };

    struct toRegion
    {
      int t;     // Shipping duration
      int p;     // Shipping price
      string rs; // Shipping regions
    };

    struct piecesPrice
    {
      uint64_t p;   // Price
      uint32_t pcs; // Pieces
    };

  private:
    TABLE itemTable
    {
      uint64_t id;             // Item ID
      name seller;             // Seller account name
      bool available;          // Item is available for sale
      string title;            // Title
      vector<string> imgs;     // URL images
      vector<piecesPrice> pp;  // Price for each pieces bundle
      uint32_t prepT;          // Preparation duration time after payment
      string fromR;            // Shipping from region
      vector<toRegion> shipTo; // Shipping to regions with price and duration
      string excl;             // Excluded regions only needed if i.e. ship to EU but not to Germany
      vector<string> opts;     // Options
      string descr;            // Description
      string note;             // Note from seller to buyer
      uint32_t expired;        // At this date the offer is expired and can be removed

      uint64_t primary_key() const { return id; }
    };
    typedef multi_index<name("item"), itemTable> items_table;

    TABLE userTable
    {
      name user;
      vector<string> contact;
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
    inline void removeItemFromUserTable(const name &user, const uint64_t id, const uint64_t &category);
    inline void removeItemFromUserTable(users_table &users_Table, const users_table::const_iterator &user_itr, const uint64_t id, const uint64_t &category);

  public:
    infiniteshop(name s, name code, datastream<const char *> ds);

    /**
     * @brief Delete a user and all his items
     *
     * @param user User account name
     */
    ACTION deleteuser(const name &user)
    {
      // The user and the contract owner can delete the user entry
      if (!has_auth(get_self()))
      {
        require_auth(user);
      }
      users_table _users(get_self(), get_self().value);
      auto itr = _users.find(user.value);
      check(itr != _users.end(), "User not found");
      if (itr->items.size() > 0)
      {
        for (auto &i : itr->items)
        {
          items_table _items(get_self(), i.category);
          auto item = _items.find(i.id);
          if (item != _items.end())
          {
            _items.erase(item);
          }
        }
      }
      if (!(itr->banned))
      {
        _users.erase(itr);
      }
    }

    /**
     * @brief Ban a user
     *
     * @param user User account name
     * @param ban Ban or unban
     */
    ACTION ban(const name &user, const bool ban)
    {
      require_auth(get_self());
      users_table _users(get_self(), get_self().value);
      auto itr = _users.find(user.value);
      check(itr != _users.end(), "User not found");
      _users.modify(itr, get_self(), [&](auto &s)
                    {
        s.banned = ban;
        s.active = false; });
    }

    /**
     * @brief Add or update properties of a user
     *
     * @param user User account name
     * @param contact Contact addresses like the email or Telegram contact address. Can be empty if already defined
     * @param allowed Allowed token symbols. Can be empty if already defined. Its property chain may also define a token specific user address in the future
     * @param active User is active
     * @param pgp PGP public key. Can be empty if already defined
     * @param note Note of this user. Can be empty if already defined
     */
    ACTION updateuser(const name &user, const vector<string> &contact, const vector<tokenSymbol> &allowed, const bool active, const string &pgp, const string &note)
    {
      require_auth(user);
      users_table _users(get_self(), get_self().value);
      auto itr = _users.find(user.value);
      const bool hasNewTokens = allowed.size() > 0;
      if (itr != _users.end())
      {
        _users.modify(itr, get_self(), [&](auto &s)
                      {
          check(hasNewTokens || s.allowed.size() > 0, "No accepted tokens defined");
          if (hasNewTokens) {
            s.allowed = allowed;
          }
          s.active = active;
          s.lastUpdate = eosio::current_time_point().sec_since_epoch();
          if (pgp.length() > 0) {
            s.pgp = pgp;
          }
          if (note.length() >= 0) {
            s.note = note;
          }
          if (contact.size() > 0) {
            s.contact = contact;
          } });
      }
      else
      {
        check(hasNewTokens, "No accepted tokens defined");
        _users.emplace(get_self(), [&](auto &s)
                       {
          s.user = user;
          s.contact = contact;
          s.allowed = allowed;
          s.active = active;
          s.lastUpdate = eosio::current_time_point().sec_since_epoch();
          s.banned = false;
          s.pgp = pgp;
          s.note = note; });
      }
    }

    ACTION additem(const name &seller, const uint64_t &category, const string &title, const vector<string> &imgs, const vector<piecesPrice> &pp, const uint32_t prepT, const string &fromR, const string &excl, const vector<toRegion> &shipTo, const vector<string> &opts, const string &descr, const string &note, const bool available, const uint32_t expired)
    {
      require_auth(seller);
      checkValidExpirationDate(expired);
      check(title.length() > 3, "Title is too short");
      check(title.length() <= 80, "Title is too long");

      check(pp.size() > 0, "No prices defined");

      // The first entry can only be zero for special settings
      if (pp.size() == 1)
      {
        check(pp[0].p > 0, "Price cannot be zero");
        check(pp[0].pcs > 0, "Pieces cannot be zero");
      }
      else
      {
        uint32_t smallestPcs = pp[0].pcs != 0 ? pp[0].pcs : pp[1].pcs;
        uint32_t highestPcs = (pp.end() - 1)->pcs;
        uint32_t maxPcs = pp[0].pcs == 0 && pp[0].p > 0 ? pp[0].p : UINT32_MAX;

        for (auto p = pp.begin() + 1; p != pp.end(); ++p)
        {
          check(p->p > 0, "Price cannot be zero");
          check(p->pcs > 0, "Pieces cannot be zero");
          check(p->pcs >= smallestPcs || p->pcs <= highestPcs, "Piece options are not in order"); // Check only the min and max values because they are used in the interface
          check(p->pcs <= maxPcs, "Piece number can not exceed the maximum");
        }
            }

      check(shipTo.size() > 0, "No ship to any region");
      for (auto &r : shipTo)
      {
        check(r.rs.length() >= 2, "Invalid ship region");
      }
      if (opts.size() > 0)
      {
        check(opts.size() != 1, "Invalid option number");
        for (auto &opt : opts)
        {
          check(opt.length() > 0 && opt.length() < 128, "Invalid option text length");
        }
      }
      // Check if seller is banned
      users_table _users(get_self(), get_self().value);
      auto seller_itr = _users.find(seller.value);
      check(seller_itr != _users.end(), "Seller not found");
      check(!(seller_itr->banned), "Seller is banned");

      // Add item
      items_table _items(get_self(), category);
      const auto id = _items.available_primary_key();
      _items.emplace(get_self(), [&](auto &i)
                     {
        i.id = id;
        i.seller = seller;
        i.available = available;
        i.title = title;
        i.imgs = imgs;
        i.pp = pp;
        i.prepT = prepT;
        i.fromR = fromR;
        i.shipTo = shipTo;
        i.excl = excl;
        i.opts = opts;
        i.descr = descr;
        i.note = note;
        i.expired = expired; });

      // Update user last update state
      _users.modify(seller_itr, get_self(), [&](auto &s)
                    {
        s.items.push_back({id, category});
        s.lastUpdate = eosio::current_time_point().sec_since_epoch(); });
    }

    /**
     * @brief Remove an item from items table and user table
     *
     * @param id Item ID
     * @param category Category name
     */
    ACTION removeitem(uint64_t id, const uint64_t &category)
    {
      items_table _items(get_self(), category);
      auto item = _items.find(id);
      check(item != _items.end(), "Item not found");
      if (!has_auth(item->seller))
      {
        check(eosio::current_time_point().sec_since_epoch() > item->expired, "Is not expired yet");
      }
      else
      {
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
     * @param category Category index
     */
    ACTION rmexpired(const uint64_t &category)
    {
      items_table _items(get_self(), category);
      auto item = _items.begin();
      while (item != _items.end())
      {
        if (eosio::current_time_point().sec_since_epoch() > item->expired)
        {
          removeItemFromUserTable(item->seller, item->id, category);
          item = _items.erase(item);
        }
        else
        {
          item++;
        }
      }
    }

    /**
     * @brief Update the item availability and expiration date
     *
     * @param id Item ID
     * @param category Category index
     * @param available Item is available for sale
     * @param expired At this date the offer is expired and can be removed by anyone
     */
    ACTION itemstate(uint64_t id, const uint64_t &category, bool available, uint32_t expired)
    {
      checkValidExpirationDate(expired);

      items_table _items(get_self(), category);
      auto item = _items.find(id);
      require_auth(item->seller);
      check(item != _items.end(), "Item not found");
      _items.modify(item, get_self(), [&](auto &i)
                    {
        i.available = available;
        i.expired = expired; });

      // Update user last update state
      users_table _users(get_self(), get_self().value);
      auto seller_itr = _users.find(item->seller.value);
      _users.modify(seller_itr, get_self(), [&](auto &s)
                    { s.lastUpdate = eosio::current_time_point().sec_since_epoch(); });
    }
  };
}
