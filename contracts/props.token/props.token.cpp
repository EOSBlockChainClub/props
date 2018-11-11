/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */
/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */

/**
 *  Following contract adheres to eosio.token standards. 
 * It copies all the functionalities of eosio.token. In addition to that, it implements functiosn such as propup and creathash
 */

#include "props.token.hpp"

namespace eosio
{

void token::create(account_name issuer,
                   asset maximum_supply)
{
    require_auth(_self);

    auto sym = maximum_supply.symbol;
    eosio_assert(sym.is_valid(), "invalid symbol name");
    eosio_assert(maximum_supply.is_valid(), "invalid supply");
    eosio_assert(maximum_supply.amount > 0, "max-supply must be positive");

    stats statstable(_self, sym.name());
    auto existing = statstable.find(sym.name());
    eosio_assert(existing == statstable.end(), "token with symbol already exists");

    statstable.emplace(_self, [&](auto &s) {
        s.supply.symbol = maximum_supply.symbol;
        s.max_supply = maximum_supply;
        s.issuer = issuer;
    });
}

void token::issue(account_name to, asset quantity, string memo)
{
    auto sym = quantity.symbol;
    eosio_assert(sym.is_valid(), "invalid symbol name");
    eosio_assert(memo.size() <= 256, "memo has more than 256 bytes");

    auto sym_name = sym.name();
    stats statstable(_self, sym_name);
    auto existing = statstable.find(sym_name);
    eosio_assert(existing != statstable.end(), "token with symbol does not exist, create token before issue");
    const auto &st = *existing;

    require_auth(st.issuer);
    eosio_assert(quantity.is_valid(), "invalid quantity");
    eosio_assert(quantity.amount > 0, "must issue positive quantity");

    eosio_assert(quantity.symbol == st.supply.symbol, "symbol precision mismatch");
    eosio_assert(quantity.amount <= st.max_supply.amount - st.supply.amount, "quantity exceeds available supply");

    statstable.modify(st, 0, [&](auto &s) {
        s.supply += quantity;
    });

    add_balance(st.issuer, quantity, st.issuer);

    if (to != st.issuer)
    {
        SEND_INLINE_ACTION(*this, transfer, {st.issuer, N(active)}, {st.issuer, to, quantity, memo});
    }
}

void token::retire(asset quantity, string memo)
{
    auto sym = quantity.symbol;
    eosio_assert(sym.is_valid(), "invalid symbol name");
    eosio_assert(memo.size() <= 256, "memo has more than 256 bytes");

    auto sym_name = sym.name();
    stats statstable(_self, sym_name);
    auto existing = statstable.find(sym_name);
    eosio_assert(existing != statstable.end(), "token with symbol does not exist");
    const auto &st = *existing;

    require_auth(st.issuer);
    eosio_assert(quantity.is_valid(), "invalid quantity");
    eosio_assert(quantity.amount > 0, "must retire positive quantity");

    eosio_assert(quantity.symbol == st.supply.symbol, "symbol precision mismatch");

    statstable.modify(st, 0, [&](auto &s) {
        s.supply -= quantity;
    });

    sub_balance(st.issuer, quantity);
}

void token::transfer(account_name from,
                     account_name to,
                     asset quantity,
                     string memo)
{
    eosio_assert(from != to, "cannot transfer to self");
    require_auth(from);
    eosio_assert(is_account(to), "to account does not exist");
    auto sym = quantity.symbol.name();
    stats statstable(_self, sym);
    const auto &st = statstable.get(sym);

    require_recipient(from);
    require_recipient(to);

    eosio_assert(quantity.is_valid(), "invalid quantity");
    eosio_assert(quantity.amount > 0, "must transfer positive quantity");
    eosio_assert(quantity.symbol == st.supply.symbol, "symbol precision mismatch");
    eosio_assert(memo.size() <= 256, "memo has more than 256 bytes");

    sub_balance(from, quantity);
    add_balance(to, quantity, from);
}

void token::createhash(account_name from, string hashtag, asset quantity)
{
    require_auth(from);

    hash_table _hashtags(_self, _self);

    auto itr = _hashtags.find(from);

    if (itr == _hashtags.end())
    {
        _hashtags.emplace(_self, [&](auto &a) {
            a.owner = from;
            a.hashtags.push_back({hashtag, quantity});
        });
    }
    else
    {
        _hashtags.modify(itr, from, [&](auto &a) {
            a.owner = from;
            if (in_array(a.hashtags, hashtag))
            {
                auto hashparams = replace_balance(a.hashtags, hashtag, quantity);
                a.hashtags = hashparams;
            }
            else
            {
                a.hashtags.push_back({hashtag, quantity});
            }
        });
    }
}

// sets per transaction limit
void token::settrxlimit(account_name from, asset quantity)
{
    require_auth(from);

    trx_limit _limit(_self, _self);

    auto itr = _limit.find(from);

    if (itr == _limit.end())
    {
        _limit.emplace(_self, [&](auto &a) {
            a.owner = from;
            a.balance = quantity;
        });
    }
    else
    {
        _limit.modify(itr, from, [&](auto &a) {
            a.owner = from;
            a.balance = quantity;
        });
    }
}

// sets daily limit for the transactions
void token::setlimit(account_name from, asset quantity)
{
    require_auth(from);

    daily_limit _limit(_self, _self);

    auto itr = _limit.find(from);

    if (itr == _limit.end())
    {
        _limit.emplace(_self, [&](auto &a) {
            a.owner = from;
            a.daily = quantity;
        });
    }
    else
    {
        _limit.modify(itr, from, [&](auto &a) {
            a.owner = from;
            a.daily = quantity;
        });
    }
}

// log transactions
void token::checklog(account_name from, asset quantity, asset dailyval)
{
    log_table _logs(_self, _self);
    auto log_itr = _logs.find(from);
    if (log_itr == _logs.end())
    {
        _logs.emplace(_self, [&](auto &a) {
            a.from = from;
            a.quantity = quantity;
            a.timestamp = now();
        });
    }
    else
    {
        auto current_time = now();
        auto last_timestamp = log_itr->timestamp;

        // eosio_assert(current_time - last_timestamp < 86400 && dailyval.amount < quantity.amount, "you have already acheived your daily transaction limit.");
        _logs.modify(log_itr, from, [&](auto &a) {
            a.from = from;
            a.quantity += quantity;
            a.timestamp = now();
        });
    }
}

void token::propup(account_name from, account_name to, string hashtag)
{
    require_auth(from);
    asset quantity;
    asset dailyval = asset(10000, symbol_type(S(4, PROP)));
    hash_table _hashtags(_self, _self);
    auto sender_itr = _hashtags.find(from);
    auto reciever_itr = _hashtags.find(to);
    if (in_array(sender_itr->hashtags, hashtag) && in_array(reciever_itr->hashtags, hashtag))
    {
        quantity = find_balance_by_hash(sender_itr->hashtags, hashtag);
    }
    else if (in_array(sender_itr->hashtags, hashtag))
    {
        quantity = find_balance_by_hash(sender_itr->hashtags, hashtag);
    }
    else
    {
        quantity = find_balance_by_hash(reciever_itr->hashtags, hashtag);
    }

    trx_limit _limit(_self, _self);
    auto limit_itr = _limit.find(from);
    if (limit_itr != _limit.end())
    {
        auto limit = limit_itr->balance;
        eosio_assert(limit > quantity, "The amount you are trying to transfer is more than the auto pay limit set by you.");
    };

    daily_limit _dailylimit(_self, _self);
    auto daily_itr = _dailylimit.find(from);

    if (daily_itr != _dailylimit.end())
    {
        dailyval = daily_itr->daily;
    }

    token::checklog(from, quantity, dailyval);

    token::transfer(from, to, quantity, "transfer the hashtag ammount");
} // namespace eosio

// eosio.token standard sub_balance function
void token::sub_balance(account_name owner, asset value)
{
    accounts from_acnts(_self, owner);

    const auto &from = from_acnts.get(value.symbol.name(), "no balance object found");
    eosio_assert(from.balance.amount >= value.amount, "overdrawn balance");

    if (from.balance.amount == value.amount)
    {
        from_acnts.erase(from);
    }
    else
    {
        from_acnts.modify(from, owner, [&](auto &a) {
            a.balance -= value;
        });
    }
}

void token::add_balance(account_name owner, asset value, account_name ram_payer)
{
    accounts to_acnts(_self, owner);
    auto to = to_acnts.find(value.symbol.name());
    if (to == to_acnts.end())
    {
        to_acnts.emplace(ram_payer, [&](auto &a) {
            a.balance = value;
        });
    }
    else
    {
        to_acnts.modify(to, 0, [&](auto &a) {
            a.balance += value;
        });
    }
}

} // namespace eosio

EOSIO_ABI(eosio::token, (create)(issue)(transfer)(createhash)(checklog)(settrxlimit)(setlimit)(propup)(retire))
