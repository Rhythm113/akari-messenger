const { MessengerClient } = require('messaging-api-messenger');
const bodyParser = require('body-parser');
var app = require('express')();
var server = require('http').Server(app);

const client = new MessengerClient({
  accessToken: process.env.ACCESS_TOKEN,
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  version: '6.0',
});
/*
var ACCESS_TOKEN = 'EAAK9TW2xFlgBALoZCtL6wj0vROi0m50ZCu3vhHM1889DR8xFzdcZCY4PS1mlHtQlZASYrnegFnqKZC7ZCN9BiHa6RwhhYx3b3DB1FJ2JXEnYKFTSQVj5mHrVG657VDIMstMoiw8weXZAu1cNZAVjeHtHwAHjPEpDOqodYEmaXLveMw5dda9uTvAalpxEX485qcBnw1EEqj61gQZDZD'
var APP_ID = '771090203874904'
var APP_SECRET = '1e0c1fc0fb1165bdfa4369d9f4fdd857'
*/
server.use(bodyParser.json());

server.get('/', (req, res) => {
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.VERIFY_TOKEN
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});



/*

server.post('/', (req, res) => {
  const event = req.body.entry[0].messaging[0];
  const userId = event.sender.id;
  const { text } = event.message;
  client.sendText(userId, text);
  res.sendStatus(200);
});



const client = new MessengerClient({
  accessToken: ACCESS_TOKEN,
  appId: APP_ID,
  appSecret: APP_SECRET,
  version: '6.0',
  skipAppSecretProof: true,
});

*/
