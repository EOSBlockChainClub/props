import settings from '../../env.json';

var Twit = require('twit')

const twitConfig = {
    consumer_key:         settings.TWITTER_CONSUMER_KEY,
    consumer_secret:      settings.TWITTER_CONSUMER_SECRET,
    access_token:         settings.TWITTER_ACCESS_TOKEN,
    access_token_secret:  settings.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    // strictSSL:            true,     // optional - requires SSL certificates to be valid.
};

export var twit = new Twit(twitConfig);

export default {};
