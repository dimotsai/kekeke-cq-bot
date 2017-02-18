const {AllHtmlEntities} = require('html-entities');
const config = require('config');
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const _ = require('lodash');
const escapeStringRegexp = require('escape-string-regexp');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const entities = new AllHtmlEntities();
const ImageUrl = require('./utils/ImageUrl');

const mongodbServer = new mongodb.Server(
  config.get('mongodb.host'),
  config.get('mongodb.port'),
  {poolSize: 10}
);
const db = new mongodb.Db(config.get('mongodb.dbname'), mongodbServer);
const app = express();

db
  .open()
  .then(() => db.authenticate(config.get('mongodb.username'), config.get('mongodb.password')))
  .then(() => {
    app.set('port', config.get('api.port'));
    app.set('hostname', config.get('api.hostname'));
    app.use(cors());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    // app.use(express.static(path.join(__dirname, 'public')));

    app.get('/api/messages', (req, res) => {
      const criteria = {
        'payload.senderNickName': {
          $ne: 'SYSTEM'
        },
        type: 'MESSAGE'
      };
      const pipeline = [{$match: criteria}];
      if (req.query.nickname) {
        criteria['payload.senderNickName'].$regex = escapeStringRegexp(req.query.nickname);
      }
      if (req.query.before) {
        if (criteria['payload.date'] === undefined) {
          criteria['payload.date'] = {};
        }
        criteria['payload.date'].$lte = req.query.before;
      }
      if (req.query.after) {
        if (criteria['payload.date'] === undefined) {
          criteria['payload.date'] = {};
        }
        criteria['payload.date'].$gte = req.query.after;
      }
      if (req.query.publicId) {
        criteria['payload.senderPublicId'] = req.query.publicId;
      }
      if (req.query.order) {
        switch (req.query.order) {
          case 'desc':
            pipeline.push({$sort: {_id: -1}});
            break;
          case 'asc':
            pipeline.push({$sort: {_id: 1}});
            break;
          default:
        }
      }
      if (req.query.offset) {
        pipeline.push({$skip: parseInt(req.query.offset, 10)});
      }
      if (req.query.limit && req.query.limit <= 30) {
        pipeline.push({$limit: parseInt(req.query.limit, 10)});
      } else {
        pipeline.push({$limit: 10});
      }
      const collection = db.collection('messages');

      Promise.resolve()
        .then(() => Promise.all([
          collection.aggregate(pipeline).toArray(),
          collection.find(criteria).count()
        ]))
        .then(([items, count]) => {
          res.send({items, count});
        })
        .catch(e => {
          console.error(e);
          res.sendStatus(400);
        });
    });

    app.get('/api/images', (req, res) => {
      const criteria = {
        $and: [{
          'payload.content': {$regex: /^(?!delete)/i}
        }, {
          'payload.content': {$regex: ImageUrl.getRegex()}
        }]
      };
      const pipeline = [{$match: criteria}];

      if (req.query.timestamp) {
        criteria['payload.date'] = {
          $lte: req.query.timestamp
        };
      }

      // order: desc
      pipeline.push({$sort: {_id: -1}});

      if (req.query.offset) {
        pipeline.push({$skip: parseInt(req.query.offset, 10)});
      }
      if (req.query.limit && req.query.limit <= 30) {
        pipeline.push({$limit: parseInt(req.query.limit, 10)});
      } else {
        pipeline.push({$limit: 10});
      }

      const collection = db.collection('messages');

      Promise.all([
        collection.aggregate(pipeline).toArray(),
        collection.find(criteria).count()
      ])
      .then(([items_, count]) => {
        const items = items_.reduce((arr, it) => {
          const text = it.payload.content;
          const urls = ImageUrl.parse(text);
          const extra = [];

          // for multiple pics in one message
          for (const url of urls) {
            extra.push({
              senderPublicId: it.payload.senderPublicId,
              senderNickName: it.payload.senderNickName,
              url: entities.decode(url),
              text: it.payload.content,
              date: it.payload.date
            });
          }
          return arr.concat(extra);
        }, []);
        res.send({items, count});
      })
      .catch(e => {
        console.error(e);
        res.sendStatus(400);
      });
    });

    app.get('/api/users', (req, res) => {
      const collection = db.collection('messages');
      const criteria = {
        'payload.senderPublicId': {
          $ne: 'SYSTEM_PUBLIC_ID'
        },
        type: 'MESSAGE',
        'payload.date': {}
      };

      switch (req.query.period) {
        case 'month':
          criteria['payload.date'].$gte = (Date.now() - (30 * 86400 * 1000)).toString();
          break;
        case 'week':
          criteria['payload.date'].$gte = (Date.now() - (7 * 86400 * 1000)).toString();
          break;
        case 'day':
        default:
          criteria['payload.date'].$gte = (Date.now() - (86400 * 1000)).toString();
      }

      collection.aggregate([
        {
          $match: criteria
        },
        {
          $group: {
            _id: '$payload.senderPublicId',
            count: {$sum: 1},
            nickname: {$last: '$payload.senderNickName'}
          }
        },
        {
          $sort: {count: -1}
        }
      ]).toArray().then(users => {
        res.send({items: users});
      }).catch(e => {
        console.error(e);
        res.sendStatus(400);
      });
    });

    app.get('/api/users/:publicId', (req, res) => {
      const collection = db.collection('messages');
      const criteria = {
        'payload.senderPublicId': {
          $eq: req.params.publicId
        },
        type: 'MESSAGE'
      };

      collection.aggregate([
        {
          $match: criteria
        },
        {
          $group: {
            _id: '$payload.senderPublicId',
            count: {$sum: 1},
            nickname: {$last: '$payload.senderNickName'}
          }
        }
      ]).toArray().then(users => {
        if (users.length > 0) {
          res.send({item: users.shift()});
        } else {
          res.sendStatus(404);
        }
      }).catch(e => {
        console.error(e);
        res.sendStatus(400);
      });
    });

    app.listen(app.get('port'), app.get('hostname'), () => {
      console.log('Server listening on ' + app.get('hostname') + ':' + app.get('port'));
    });
  });
