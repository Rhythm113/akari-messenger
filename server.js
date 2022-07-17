const { MessengerClient } = require('messaging-api-messenger');
var server = require('express')();
const{ JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const cleverbot = require("./module.js");


var db = new JsonDB(new Config("chats", true, false, '/'));

const client = new MessengerClient({
  accessToken: process.env.ACCESS_TOKEN,
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  version: '6.0',
});

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
server.listen(process.env.PORT || 8080);




server.post('/', (req, res) => {
  const event = req.body.entry[0].messaging[0];
  const userId = event.sender.id;
  const text  = event.message.text;
  if(typeof text == 'undefined'){
    client.sendText(userId , "I Won't reply to that")
  }
  try{
    
    var data_rcv = db.getData(`/${userId}/rcv`);
    }catch(err){
      console.log("Errrr")
    }if(typeof data_rcv == 'undefined'){
    db.push(`/${userId}`, {rcv:["null","null"]});
    db.save();
    db.reload();
      console.log('lol f okk')  
  }
  try {
    var data_rcv = db.getData(`/${userId}/rcv`);
    console.log(data_rcv[0])
    if(data_rcv[0] == "null"){
        cleverbot(text).then(re => {
        client.sendText(userId, `${re}`).catch((err) => console.log(err))
        res.sendStatus(200);
        db.push(`/${userId}`, {rcv:[`${text}`,`${re}`]});
        db.reload()
        console.log(re)});
        console.log(text);

    }else{
        console.log(data_rcv);
        cleverbot(text,data_rcv).then(re2 => {
        client.sendText(userId, `${re2}`).catch((err) => console.log(err))
        res.sendStatus(200);
        db.push(`/${userId}`, {rcv:[`${text}`,`${re2}`]});
        db.reload();
    })}
   
} catch(error) {
    console.log(error);
}

});
