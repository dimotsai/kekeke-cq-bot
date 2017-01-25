// dependencies
const config = require('config');
const _ = require('lodash');

// local dependencies
const {Bot} = require('kekeke');

// settings
const bot = new Bot(config.get('bot.anonymousId'), config.get('bot.topic'), config.get('bot.nickname'));

const modules = [
  require('./bot-modules/wiki'),
  require('./bot-modules/draw'),
  require('./bot-modules/emoji'),
  require('./bot-modules/rank'),
  require('./bot-modules/math'),
  require('./bot-modules/faq'),
  require('./bot-modules/conversations'),
  require('./bot-modules/greetings'),
  require('./bot-modules/miss')
];

modules.map(m => m(bot));

bot.run();