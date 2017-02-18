const config = require('config');
const mongodb = require('mongodb');
const {Client, Message} = require('kekeke');
const topic = 'crusaders-quest';
const dbcollection = 'messages';

const mongodbServer = new mongodb.Server(config.get('mongodb.host'), config.get('mongodb.port'), {poolSize: 10});
const db = new mongodb.Db('cq', mongodbServer);
const client = new Client(config.get('logger.anonymousId'), config.get('logger.topic'), config.get('logger.nickname'));

db
  .open()
  .then(() => db.authenticate(config.get('mongodb.username'), config.get('mongodb.password')))
  .then(() => db.collection(dbcollection))
  .then(collection => {
    client.on('message', m => {
      collection.insert(m);
      if (m.getPublisher() === Message.publishers.clientTransport) {
        console.log(`${m.getSender().nickName}: ${m.getContent()}`);
      }
    });
    // client.on('send', m => console.log('>', m))
    client.on('connected', () => {
      console.log('Start logging...', topic);
    });
    client.login();
  });

