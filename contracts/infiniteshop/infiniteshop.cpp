#include "infiniteshop.hpp"

using namespace eosio;
using namespace savactshop;

infiniteshop::infiniteshop(name s, name code, datastream<const char*> ds) : contract(s, code, ds) {
};

inline void infiniteshop::checkValidExpirationDate(uint32_t expired) {
    check(eosio::current_time_point().sec_since_epoch() + EXPIRATION_DATE_MIN <= expired, "Expiration date is too early");
    check(eosio::current_time_point().sec_since_epoch() + EXPIRATION_DATE_MAX > expired, "Expiration date is too late");
}

inline void infiniteshop::removeItemFromUserTable(const name& user, const uint64_t id, const name& category) {
    users_table _users(get_self(), get_self().value);
    auto user_itr = _users.find(user.value);
    check(user_itr != _users.end(), "User not found");
    removeItemFromUserTable(_users, user_itr, id, category);
}

inline void infiniteshop::removeItemFromUserTable(users_table& users_Table, const users_table::const_iterator& user_itr, const uint64_t id, const name& category) {
    auto item_itr = user_itr->items.begin();
    while (item_itr != user_itr->items.end()) {
        if (item_itr->id == id && item_itr->category == category) {
            users_Table.modify(user_itr, get_self(), [&](auto& s) {
                s.items.erase(item_itr);
                s.lastUpdate = eosio::current_time_point().sec_since_epoch();
                });
            break;
        }
        else {
            item_itr++;
        }
    }
}