#include "infiniteshop.hpp"

using namespace eosio;
using namespace savactshop;

infiniteshop::infiniteshop(name s, name code, datastream<const char*> ds) : contract(s, code, ds) {
};