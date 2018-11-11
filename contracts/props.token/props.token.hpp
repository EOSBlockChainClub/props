
/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */
#pragma once

#include <map>
#include <vector>
#include <algorithm>
#include <string>
#include <eosiolib/asset.hpp>
#include <eosiolib/eosio.hpp>

namespace eosiosystem
{
class system_contract;
}

namespace eosio
{
using namespace std;
using std::string;

class token : public contract
{
    public:
      token(account_name self) : contract(self) {}

      void create(account_name issuer,
                  asset maximum_supply);

      void issue(account_name to, asset quantity, string memo);

      void retire(asset quantity, string memo);

      void transfer(account_name from,
                    account_name to,
                    asset quantity,
                    string memo);

      void setlimit(account_name from, asset quantity);

      void propup(account_name from, account_name to, string hashtag);

      void createhash(account_name from, string hashtag, asset quantity);

      void settrxlimit(account_name from, asset quantity);

      void checklog(account_name from, asset quantity, asset dailylimit);

      inline asset get_supply(symbol_name sym) const;

      inline asset get_balance(account_name owner, symbol_name sym) const;

      struct args
      {
            string name;
            asset value;
      };

    private:
      //@abi table accounts i64
      struct account
      {
            asset balance;

            uint64_t primary_key() const { return balance.symbol.name(); }
      };
      //@abi table stat i64
      struct currencystat
      {
            asset supply;
            asset max_supply;
            account_name issuer;

            uint64_t primary_key() const { return supply.symbol.name(); }
      };

      //@abi table hashes i64
      struct hashtag
      {
            account_name owner;
            vector<token::args> hashtags;
            auto primary_key() const { return owner; }
      };

      //@abi table limits i64
      struct limit
      {
            account_name owner;
            // per transaction limit
            asset balance;
            uint64_t primary_key() const { return owner; }
      };

      //@abi table dailylimits i64
      struct dailylimit
      {
            account_name owner;
            // daily transaction limit
            asset daily;
            uint64_t primary_key() const { return owner; }
      };

      //@abi table logs i64
      struct log
      {
            account_name from;
            asset quantity;
            uint64_t timestamp;
            auto primary_key() const { return from; }
      };

      typedef eosio::multi_index<N(accounts), account> accounts;
      typedef eosio::multi_index<N(stat), currencystat> stats;
      typedef eosio::multi_index<N(logs), log> log_table;
      typedef eosio::multi_index<N(hashes), hashtag> hash_table;
      typedef eosio::multi_index<N(limits), limit> trx_limit;
      typedef eosio::multi_index<N(dailylimits), dailylimit> daily_limit;

      void sub_balance(account_name owner, asset value);
      void add_balance(account_name owner, asset value, account_name ram_payer);

    public:
      struct transfer_args
      {
            account_name from;
            account_name to;
            asset quantity;
            string memo;
      };
}; // namespace eosio

auto replace_balance(vector<token::args> params, string hashtag, asset quantity)
{
      for (int i = 0; i < params.size(); i++)
      {
            if (params[i].name == hashtag)
            {
                  params[i].value = quantity;
            }
      }
      return params;
}

asset token::get_supply(symbol_name sym) const
{
      stats statstable(_self, sym);
      const auto &st = statstable.get(sym);
      return st.supply;
}

asset token::get_balance(account_name owner, symbol_name sym) const
{
      accounts accountstable(_self, owner);
      const auto &ac = accountstable.get(sym);
      return ac.balance;
}

auto find_balance_by_hash(vector<token::args> params, string hashtag)
{
      for (int i = 0; i < params.size(); i++)
      {
            if (params[i].name == hashtag)
            {
                  return params[i].value;
            }
      }
}

//helper function to find if a value exists in an array of type string
bool in_array(vector<token::args> params, string hashtag)
{
      for (int i = 0; i < params.size(); i++)
      {
            if (params[i].name == hashtag)
            {
                  return true;
            }
      }
      return false;
}

uint64_t hashStr(const string &strkey)
{
      return hash<string>{}(strkey);
}

} // namespace eosio