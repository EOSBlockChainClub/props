import {
  twit
} from './connectors';
import base64 from 'base-64';
import {
  isNullOrEmpty,
  now
} from '../../../utils';
import Mongo from '../mongo/schema';
import {
  findMongo,
  findOneMongo,
  upsertMongo
} from '../mongo/resolvers';

const propup = require('../eos/resolvers');

export async function searchTwitter(searchString, count = 1) {
  try {
    const response = await twit.get('search/tweets', {
      q: searchString,
      count
    })
    return response.data;
  } catch (error) {
    console.log(`Error searching Twitter `, Error);
  }
}

//Poll twitter transfers every nn seconds
export async function startTwitterPolling(searchString, twitterName, count) {
  //set up a timer to poll 
  const pollInterval = settings.TWITTER_POLL_INTEREVAL_IN_MS;
  const args = {
    searchString,
    twitterName,
    count
  }

  // call processTwitterTransfers(args, context) every nn ms
  setInterval(processTwitterTransfers(args, context), pollInterval);
}

//Twitter
export async function searchTweets(args, context) {
  var {
    searchString,
    twitterName,
    count
  } = args;

  if (twitterName) {
    searchString = trim(`${twitterName} ${searchString}`);
  }

  const tweets = await searchTwitter(searchString, (count || 1));
  return JSON.stringify(tweets); //return a stringified response
}

//Finds all tweets sent to the user as a reply and that include a hashtag having the pattern #send(0-10)
//Converts these tweets into a userAction
//
export async function processTwitterTransfers(args, context) {
  var {
    searchString,
    twitterName,
    count
  } = args;
  if (!count) {
    count = 10
  };
  var savedCount = 0;

  //only get tweets that are replies to the current user
  searchString = (searchString || '') + `filter:replies @${twitterName} `;

  //create a string of "send1 OR Send1 OR send2 OR Send2" up to number 10
  Array.from(Array(11).keys()).map((v, i) => {
    searchString += `props${i} OR Props${i} OR `
  });

  const searchArgs = {
    searchString,
    forCurrentUser: false,
    count
  }
  const tweetStringified = await searchTweets(searchArgs, context)
  var tweets = JSON.parse(tweetStringified);

  console.log('tweets', tweets);

  if (isNullOrEmpty(tweets)) {
    return composeResult(false, 0);
  }
  //parse tweets to extract wanted data
  var tweetActions = tweets.statuses.map(t => {
    //get first hashtag
    console.log(t.entities.hashtags)
    const firstSendHashtag = (t.entities.hashtags || []).filter(h => h.text.toLowerCase().includes('send'));
    const text = firstSendHashtag.length ? firstSendHashtag[0].text : '';
    const amount = text ? text.match(/\d+$/)[0] : '';

    var metadata = {
      originalTweetId: t.id_str,
      responseTweetId: t.in_reply_to_status_id_str,
      twitterNameTo: t.in_reply_to_screen_name,
      twitterNameFrom: t.user.name,
      text: t.text,
      hashtag: text,
      amount: amount,
      profile_image: t.user.profile_image_url_https,
      created_at: t.created_at
    };

    const userId = "123456";
    const fromuserEosAccount = "user1.props";
    const toUserEosAccount = "user2.props";

    var tweetData = {
      _id: base64.encode(tweetData),
      userId: userId,
      action: "send",
      actionDatetime: now(),
      platform: "twitter",
      hashtag: "prop10",
      fromAccount: fromuserEosAccount,
      toAccount: toUserEosAccount,
      amount: amount,
      created_at: t.created_at,
      metadata: metadata
    };

    return tweetData;
  })

  //Save the items as userActions (will ignore duplicates)
  await Promise.all(tweetActions.map(async (t) => {
    await saveTransfer(t, context);
    savedCount += 1;
  }));

  return composeResult(true, savedCount);

}

export async function callSendTransactionOnChain(data) {
  const response = await propup(data.fromAccount, data.toAccount, data.hashtag)
  return response
}

export async function saveTransfer(data, context) {
  //TODO: Save to database
  const response = await upsertMongo(context, Mongo.Transaction, data);
  console.log(data);
  const responseFromChain = await callSendTransactionOnChain(data)
  return 1;
}

export function composeResult(success, modifiedCount, errorCode, id) {
  let result = {
    success,
    modifiedCount
  };
  if (id) {
    result._id = id;
  }
  if (errorCode) {
    result.errorCode = errorCode;
  }
  return result;
}