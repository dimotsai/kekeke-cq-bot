const Promise = require('bluebird');
const request = require('request-promise');

const api = 'https://dimotsai.me/cq/api';

module.exports = bot => {
  bot.respond(/^\/?(誰最宅|貢獻度?排行|誰貢獻度?最(多|高))/i, res => {
    const periods = ['day', 'week', 'month'];
    Promise.all(periods.map(p => request({
      uri: api + '/users',
      qs: {period: p},
      json: true
    }))).then(responses => {
      const ranks = responses.map(r => r.items);
      return ranks.map(r => {
        // exclude bot and limit 3
        return r.filter(entry => entry._id !== bot.getPublicId()).slice(0, 3);
      });
    }).then(ranks => {
      const rankStrings = ranks.map(r => {
        return r.map(user => `${user.nickname}(${user.count})`).join(', ');
      });
      const message =
        '(tada)過去一　天:' + rankStrings[0] + '(end)' +
        '(tada)過去一　週:' + rankStrings[1] + '(end)' +
        '(tada)過去一個月:' + rankStrings[2];
      res.send(message);
    });
  });

  bot.respond(/^\/?(?:我的)?(宅力|貢獻度?)/i, res => {
    request({
      uri: api + `/users/${res.message.getSender().publicId}`,
      json: true
    }).then(response => {
      const user = response.item;
      res.reply(`${user.nickname}的${res.match[1]}指數為：${user.count}`, false);
    });
  });
};
