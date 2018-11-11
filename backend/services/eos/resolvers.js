const settings = require('../../env.json');
const eosjs = require('eosjs');
const fetch = require('node-fetch'); // node only; not needed in browsers
const {
    TextDecoder,
    TextEncoder
} = require('text-encoding'); // node, IE11 and IE Edge Browsers

const PROP_CONTRACT = settings.CONTRACT_NAME

const signatures = [
    settings.PROPS_PRIVATE_KEY,
    settings.TOKEN_PROPS_PRIVATE_KEY,
    settings.TOKEN_PROPS_AUTO_PAY_KEY
]

const signatureProvider = new eosjs.JsSignatureProvider(signatures);

const rpc = new eosjs.JsonRpc(settings.EOS_NETWORK_URI, {
    fetch
});

const eos = new eosjs.Api({
    chainId: settings.EOS_CHAIN_ID,
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