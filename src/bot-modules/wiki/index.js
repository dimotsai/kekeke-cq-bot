const Promise = require('bluebird');
const GoogleSpreadsheet = require('google-spreadsheet');
const spreadsheetKey = '1JuAuVtinvco2bIKCb7dA98Ua0njrlGlEAQgDo1wgIec';
const sheetId = 'od1cr0w';
const doc = Promise.promisifyAll(new GoogleSpreadsheet(spreadsheetKey));
// const OpenCC = require('opencc');
// const opencc = new OpenCC('s2t.json');
const escapeStringRegexp = require('escape-string-regexp');

module.exports = bot => {
  bot.respond(/^(分析|被動|專武|專武被動)\s*(.+)/i, res => {
    doc.getRowsAsync(sheetId, {}).then(rows => {
      // support simplified chinese
      // const keyword = opencc.convertSync(res.match[2]);
      const keyword = res.match[2];
      const pattern = new RegExp(escapeStringRegexp(keyword), 'i');
      const target = rows.find(e => {
        if (e['角色'].match(pattern) || e['別稱'].match(pattern)) {
          return true;
        }
        return false;
      });
      if (target) {
        const map = {
          分析: '額外補充',
          被動: '被動說明',
          專武被動: '裝備專武被動',
          專武: '裝備專武被動'
        };
        const msg = target[map[res.match[1]]].trim();
        if (msg) {
          res.reply(msg);
          return;
        }
      }
      res.reply('抱歉，暫時沒有資料 (xw)');
    });
  });

  bot.respond(/^\/?(圖片)\s*(.+)/, res => {
    doc.getRowsAsync('o1jt62e', {}).then(rows => {
      const pattern = new RegExp(escapeStringRegexp(res.match[2]), 'i');
      const target = rows.find(e => {
        if (e['角色'].match(pattern) || e['別稱'].match(pattern)) {
          return true;
        }
        return false;
      });
      if (target) {
        const map = {
          圖片: 'image'
        };
        const msg = target[map[res.match[1]]].trim();
        if (msg) {
          res.reply(msg);
          return;
        }
      }
      res.reply('目前還沒有真相');
    });
  });
};
