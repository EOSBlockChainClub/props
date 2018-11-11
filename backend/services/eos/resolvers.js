const eosjs = require('eosjs');
const fetch = require('node-fetch'); // node only; not needed in browsers
const {
    TextDecoder,
    TextEncoder
} = require('text-encoding'); // node, IE11 and IE Edge Browsers

const PROP_CONTRACT = "token.props"

const defaultPrivateKey = "5JEn8Y2hYREt5V4Q7Po4h3xQ8kWB7ksKvdUS7NJScbXbyNiFruS";
const tokenPropPrivatekey = "5KEArEq9ydqtPXcAMWvzqavkVcHd6KrpLHkyLJuRX8VBHUMu96X" // token.props
const tokenPropAutoPayKey = "5HrsefDd577dRS8y6Pj6QuLvfZgbNsoWhqefmqXo5VdKKWeM8KV"
const signatureProvider = new eosjs.JsSignatureProvider([defaultPrivateKey, tokenPropPrivatekey, tokenPropAutoPayKey]);

const rpc = new eosjs.JsonRpc('http://127.0.0.1:8888', {
    fetch
});

const eos = new eosjs.Api({
    chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
    rpc,
    signatureProvider,
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder()
});

function transact(actions, blocksBehind = 3, expireSeconds = 30) {
    return eos.transact({
        actions
    }, {
        blocksBehind,
        expireSeconds,
    });
}

// cleos get currency balance token.props test1.props PROP
async function getBalance(accountName, tokenSymbol, contractName) {
    const balance = await eos.rpc.get_currency_balance(contractName, accountName, tokenSymbol);
    if (balance && balance[0]) {
        return parseFloat(balance[0].split(tokenSymbol)[0]);
    }
    return parseFloat(0.0000);
}

// cleos push action token.props createhash '["token.props","prop10","20.0000 PROP"]' -p token.props
async function createhash(accountName, hashtag, quantity, permission) {
    return transact([{
        account: PROP_CONTRACT,
        name: 'createhash',
        authorization: [{
            actor: accountName,
            permission,
        }],
        data: {
            from: accountName,
            hashtag,
            quantity
        },
    }]);
}

//  cleos push action token.props propup '["token.props","test2.props","giveme9"]' -p token.props
async function propup(sender, reciever, hashtag, permission = "autopay") {
    return transact([{
        account: PROP_CONTRACT,
        name: 'propup',
        authorization: [{
            actor: sender,
            permission,
        }],
        data: {
            from: sender,
            to: reciever,
            hashtag
        },
    }])
}

// set per transaction limit
async function setTransactionLimit(sender, amount, permission = "active") {
    return transact([{
        account: PROP_CONTRACT,
        name: 'settrxlimit',
        authorization: [{
            actor: sender,
            permission,
        }],
        data: {
            from: sender,
            quantity: amount
        },
    }])
}

// get all the hash tags belonging to an account
async function getHashes(accountName) {
    const parameters = {
        code: 'token.props',
        table: 'hashes',
        json: true,
        scope: "token.props",
        limit: -1,
        key_type: 'i64',
        index_position: 1,
    };
    results = await eos.rpc.get_table_rows(parameters);
    return results.rows[0];
}
createhash("token.props", "giveme10", "10.0000 PROP", "active")
propup("token.props", "test2.props", "giveme10", "autopay")
getHashes("token.props")