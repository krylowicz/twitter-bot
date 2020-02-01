require("dotenv").config();
const http = require('http');
const fs = require("fs");
const OAuth = require("oauth");

const diff = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));

const oauth = new OAuth.OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  process.env.CONSUMER_KEY,
  process.env.CONSUMER_SECRET,
  "1.0A",
  null,
  "HMAC-SHA1"
);

const fetchFollowers = () =>
  oauth.get(
    "https://api.twitter.com/1.1/followers/ids.json",
    process.env.ACCESS_TOKEN,
    process.env.ACCESS_SECRET,
    (error, data) => {
      if (error) console.log(error);
      const { ids: newIDs } = JSON.parse(data);
      const oldIDs = JSON.parse(fs.readFileSync('./followers.json'));
      if (oldIDs) {
        const difference = diff(newIDs, oldIDs);
        for (let id of difference) {
          oauth.post(
            'https://api.twitter.com/1.1/direct_messages/events/new.json',
            process.env.ACCESS_TOKEN,
            process.env.ACCESS_SECRET,
            JSON.stringify({
              "event": {
                "type": "message_create",
                "message_create": {
                  "target": {
                    "recipient_id": id
                  },
                  "message_data": {
                    "text": "Thanks for following @bb_stem and becoming part of the network on Twitter. Our feed brings you all the latest news and updates about BBSTEM. If you wish to receive all the exclusive opportunities, sign up here: bbstem.co.uk"
                  }
                }
              }
            }),
            'application/json'
          );
          console.log(`message sent to ${id}`);
        }
      }
      fs.writeFileSync('./followers.json', JSON.stringify(newIDs));
    }
  );

fetchFollowers();

setInterval(fetchFollowers, 1000 * 60 * 30);

http.createServer((req, res) => res.end()).listen(process.env.PORT || 80 );
