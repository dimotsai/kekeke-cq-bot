const Promise = require('bluebird');
const chokidar = require('chokidar');
const _ = require('lodash');
const path = require('path');
const jsonfile = Promise.promisifyAll(require('jsonfile'));

module.exports = bot => {
  const logicFile = path.join(__dirname, './logic.json');
  let rules = [];

  function reloadLogic(filename) {
    console.log('reload', filename);
    return jsonfile
      .readFileAsync(filename)
      .then(rules_ => {
        rules = rules_.map(rule => {
          return {
            regex: new RegExp(rule.regex, 'i'),
            reply: rule.reply
          };
        });
      })
      .catch(e => console.error(e.message));
  }

  reloadLogic(logicFile);
  chokidar.watch(logicFile).on('change', reloadLogic);

  let matchedRule;

  bot.listen((content, isResponse) => {
    if (!isResponse) {
      return false;
    }
    // ignore bot nickname
    for (const r of rules) {
      if (content.match(r.regex)) {
        matchedRule = r;
        return true;
      }
    }
    return false;
  }, res => {
    if (_.isArray(matchedRule.reply)) {
      res.reply(_.sample(matchedRule.reply));
    } else {
      res.reply(matchedRule.reply);
    }
  });
};
