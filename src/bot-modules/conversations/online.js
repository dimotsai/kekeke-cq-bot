const Promise = require('bluebird');
const _ = require('lodash');
const GoogleSpreadsheet = require('google-spreadsheet');
const spreadsheetKey = '16ZKDHQJ0_JC1xo2Zxlzg51Epcp5o16lxzDYSUpGhvvM';
const sheetId = 'od6';
const doc = Promise.promisifyAll(new GoogleSpreadsheet(spreadsheetKey));
const escapeStringRegexp = require('escape-string-regexp');

module.exports = bot => {
  let foundRow;
  bot.listen((content, isResponse) => {
    if (!isResponse) {
      return false;
    }
    return doc.getRowsAsync(sheetId, {}).then(rows => {
      return rows.find(row => {
        const keyword = escapeStringRegexp(row['關鍵字']);
        const re = new RegExp(`^${keyword}$`);
        if (content.match(re)) {
          foundRow = row;
          return true;
        }
        return false;
      });
    });
  }, res => {
    const replies = _.range(1, 6).map(index => {
      return foundRow[`反應${index}`];
    }).filter(r => r !== '');
    res.reply(_.sample(replies));
  });
};
