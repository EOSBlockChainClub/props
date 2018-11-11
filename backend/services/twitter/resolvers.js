import {twit} from './connectors';
import base64 from 'base-64';
import {isNullOrEmpty} from '../../../utils';
import {findMongo, findOneMongo, upsertMongo} from '../mongo/resolvers';

export async function searchTwitter(searchString, count = 1) {
    try {
        const response = await twit.get('search/tweets', { q: searchString, count })
        return response.data;
    }
    catch(error) {
      console.log(`Error searching Twitter `, Error);
    }
}

// // TODO: We need to get twitter screen name for searching replies for comment
// // we can get it on login time and save it in user identities data
// export async function getTwitterData(args, context) {
//   var {twitterId} = args;
  
//   try{
//     //get twitter user's id
//     // console.log(twitterName);
//     // const response = await twit.get('search', { q: twitterName });
//     // console.log(response.data);
//     const user_id = twitterId.replace(/\D/g,'');
//     console.log(user_id);
//     response = await twit.get('users/lookup', { user_id});
//     console.log(response);
//     const data = response.data[0];
//     console.log(data);
//     return JSON.stringify(data);
//   }catch (error) {
//     console.log(`Error getting Twitter `, Error);
//   }
// }

//Twitter
export async function searchTweets(args, context) {
  var {searchString, twitterName, count} = args;

  if(twitterName) {
    searchString = trim(`${twitterName} ${searchString}`);
  }

  const tweets = await searchTwitter(searchString,(count || 1));
  return JSON.stringify(tweets);  //return a stringified response
}

//Finds all tweets sent to the user as a reply and that include a hashtag having the pattern #send(0-10)
//Converts these tweets into a userAction
//
export async function processTwitterTransfers(args, context) {
  var {searchString, twitterName, count} = args;
  if(!count) {count = 10};
  var savedCount = 0;

  //only get tweets that are replies to the current user
  searchString = (searchString || '') + `filter:replies @${twitterName} `;

  //create a string of "send1 OR Send1 OR send2 OR Send2" up to number 10
  Array.from(Array(11).keys()).map((v, i) => {searchString += `props${i} OR Props${i} OR `});

  const searchArgs = {searchString, forCurrentUser:false, count}
  const tweetStringified = await searchTweets(searchArgs, context)
  var tweets = JSON.parse(tweetStringified);

  console.log('tweets',tweets);

  if(isNullOrEmpty(tweets)) {
    return composeResult(false,0);
  }
  //parse tweets to extract wanted data
  var tweetActions = tweets.statuses.map(t => {
    //get first hashtag
    console.log(t.entities.hashtags)
    const firstSendHashtag = (t.entities.hashtags || []).filter(h => h.text.toLowerCase().includes('send'));
    const text = firstSendHashtag.length ? firstSendHashtag[0].text : '';
    const amount = text ? text.match(/\d+$/)[0] : '';
    var tweetData =  {
      originalTweetId : t.id_str,
      responseTweetId : t.in_reply_to_status_id_str,
      twitterNameTo : t.in_reply_to_screen_name,
      twitterNameFrom : t.user.name,
      text: t.text,
      hashtag : text,
      amount : amount,
      profile_image : t.user.profile_image_url_https,
      created_at : t.created_at
    };
    // tweetData.hashId = base64.encode(tweetData);  //unique hash based for this transfer
    return tweetData;
  })
 
  //Save the items as userActions (will ignore duplicates)
  await Promise.all(tweetActions.map(async (t) => {
    await saveTransfer(t,context);
    savedCount += 1;
  }));

  return composeResult(true, savedCount);

}

export async function saveTransfer(data, context) {
  //TODO: Save to database
  console.log(data);
  return 1;
}


// // input: {action, metadata, userId}
// //         - userId - should only be set if craeting an action for a user other than the one logged-in
// //         - metadata - (optional) stringified object stored as additional data with the action
// //         - action - string name of action
// // actionOnlyRecordedOnce - will only create one useraction of this type (per user)
// // ignoreDuplicates - if the user, action, and metadata are all the same, action isn't recorded

// export async function createUserAction(args, context, returnUserAction = false, actionOnlyRecordedOnce = false, ignoreDuplicates = false) {
//   try {
//     var {input} = args;
//     input.metadata = (input.metadata || {});
//     // metadata is a serialized string if coming via graphql endpoint
//     if (isAString(input.metadata)) {
//       input.metadata = JSON.parse(input.metadata);
//     }

//     var userId = null;
//     // If user is missing from context (a new user)
//     if(!context.user || !context.user._id) {
//       context.user = {_id: input.userId}; //might be null
//     }
//     //if userId is passed-in, use it - used for 1) adding referral bonus to referring user and 2) adding new user
//     if(input.userId) {
//       userId = input.userId;
//     }
//     else {
//       userId = context.user._id;
//     }
//     input.userId = userId; //save to userAction

//     //if an action of this type already exists for this user - don't create another
//     if(actionOnlyRecordedOnce == true) {
//       const actionExists = await findOneMongo(context, Mongo.UserAction, {userId, action:input.action});
//       if(!isNullOrEmpty(actionExists)) {
//         return composeResult(false, 0);
//       }
//     }

//     input.metadata = JSON.stringify(input.metadata); //stringify for storage in the database as a string
//     //if a duplicate of this action exists (all values including metadata) - don't create another
//     if(ignoreDuplicates == true) {
//       const actionExists = await findOneMongo(context, Mongo.UserAction, {userId, action:input.action, metadata:input.metadata});
//       if(!isNullOrEmpty(actionExists)) {
//         return composeResult(false, 0);
//       }
//     }

//     const response = await upsertMongo(context, Mongo.UserAction, input, returnUserAction);
//     return response;
//   }
//   catch (error) {
//     logAndThrowError(`problem in createUserAction`, error);
//   }
// }


export function composeResult(success, modifiedCount, errorCode, id) {
  let result = {success, modifiedCount};
  if (id) { result._id = id; }
  if (errorCode) { result.errorCode = errorCode; }
  return result;
}
