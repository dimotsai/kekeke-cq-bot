// dependencies
const config = require('config');
const _ = require('lodash');

// local dependencies
const {Bot} = require('kekeke');

// settings
const bot = new Bot(config.get('bot.anonymousId'), config.get('bot.topic'), config.get('bot.nickname'));

const middlewares = [
  require('./bot-middleware/auto-delete-image')
];

const modules = [
  require('./bot-modules/wiki'),
  require('./bot-modules/draw'),
  require('./bot-modules/emoji'),
  require('./bot-modules/rank'),
  require('./bot-modules/math'),
  require('./bot-modules/faq'),
  require('./bot-modules/greetings'),
  require('./bot-modules/conversations/online'),
  require('./bot-modules/conversations/local'),
  require('./bot-modules/miss')
];

middlewares.forEach(m => m(bot));
modules.forEach(m => m(bot));

bot.run();
