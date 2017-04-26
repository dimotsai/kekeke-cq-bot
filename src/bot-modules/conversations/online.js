const Promise = require('bluebird');
const _ = require('lodash');
const CacheManager = require('cache-manager');
const GoogleSpreadsheet = require('google-spreadsheet');
const spreadsheetKey = '16ZKDHQJ0_JC1xo2Zxlzg51Epcp5o16lxzDYSUpGhvvM';
const sheetId = 'od6';
const doc = Promise.promisifyAll(new GoogleSpreadsheet(spreadsheetKey));
const escapeStringRegexp = require('escape-string-regexp');
const memoryCache = CacheManager.caching({store: 'memory', ttl: 600});

const getCachedRowsAsync = function (sheetId, options) {
  return memoryCache.wrap(sheetId, () => doc.getRowsAsync(sheetId, options));
};

module.exports = bot => {
  let foundRow;
  bot.listen((content, isResponse) => {
    return getCachedRowsAsync(sheetId, {}).then(rows => {
      return rows.find(row => {
        const isGlobal = row['全域'];
        const isPartialMatch = row['部分匹配'];
        const keyword = escapeStringRegexp(row['關鍵字']);
        const re = new RegExp(isPartialMatch ? `${keyword}` : `^${keyword}$`, 'i');
        if (content.match(re)) {
          foundRow = row;
          if (isResponse && !isGlobal) {
            return true;
          } else if (!isResponse && isGlobal) {
            return true;
          }
        }
        return false;
      });
    }).catch(e => {
      console.error(e.message);
      return false;
    });
  }, res => {
    const replies = _.range(1, 11).map(index => {
      return foundRow[`反應${index}`];
    }).filter(r => r !== '');
    res.reply(_.sample(replies));
  });
};
