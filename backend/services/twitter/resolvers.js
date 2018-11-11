import {twit} from './connectors';

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
  var {searchString, count} = args;
  if(!count) {count = 10};
  var savedCount = 0;

  //only get tweets that are replies to the current user
  searchString = (searchString || '') + `filter:replies @${twitterName} `;

  //create a string of "send1 OR Send1 OR send2 OR Send2" up to number 10
  Array.from(Array(11).keys()).map((v, i) => {searchString += `send${i} OR Send${i} OR `});

  const searchArgs = {searchString, forCurrentUser:false, count}
  const tweetStringified = await searchTweets(searchArgs, context)
  var tweets = JSON.parse(tweetStringified);

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
    return {
      originalTweetId : t.id_str,
      responseTweetId : t.in_reply_to_status_id_str,
      twitterNameTo : t.in_reply_to_screen_name,
      twitterNameFrom : t.user.name,
      text: t.text,
      hashtag : text,
      amount : amount,
      profile_image : t.user.profile_image_url_https,
      created_at : t.created_at
  };})

  //Save the items as userActions (will ignore duplicates)
  tweetActions.map(async (t) => {
    const input = { action: 'transfer_via_tweet', metadata: t, userId }
    var response = await createUserAction({input},context,false,false,true);
    savedCount += response.modifiedCount;
  });

  // console.log(`tweetActions :`,tweetActions);
  return composeResult(true, savedCount);

}
