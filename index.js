require('dotenv').config();
const OAuth = require('oauth');

const oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.CONSUMER_KEY,
  process.env.CONSUMER_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1'
);

oauth.get(
  'https://api.twitter.com/1.1/followers/ids.json',
  process.env.ACCESS_TOKEN,
  process.env.ACCESS_SECRET,
  (error, data) => {
    if (error) console.log(error);
    const { ids } = JSON.parse(data);
    console.log(ids);
  }
);
