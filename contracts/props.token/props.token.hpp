
/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */
#pragma once

#include <eosiolib/asset.hpp>
#include <eosiolib/eosio.hpp>

#include <string>

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

      void createhash(string hashtag, asset quantity);

      void settrxlimit(account_name from, asset quantity);

      void checklog(account_name from, asset quantity, asset dailylimit);

      inline asset get_supply(symbol_name sym) const;

      inline asset get_balance(account_name owner, symbol_name sym) const;

      inline asset allowance_of(account_name from, account_name to);

    private:
      inline void set_allowance(account_name from, account_name to, asset quantity, bool increment = false);

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

      //@abi table allowances i64
      struct allowance
      {
            account_name to;
            asset quantity;

            uint64_t primary_key() const { return to; }

            EOSLIB_SERIALIZE(allowance, (to)(quantity))
      };

      //@abi table hashes i64
      struct hashtag
      {
            uint64_t hashtag_hash;
            asset balance;
            auto primary_key() const { return hashtag_hash; }
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
      void sub_balance_from(account_name sender, account_name owner, asset value);
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

uint64_t hashStr(const string &strkey)
{
      return hash<string>{}(strkey);
}

} // namespace eosio