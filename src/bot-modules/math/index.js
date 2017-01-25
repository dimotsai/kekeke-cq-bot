const math = require('./math');

module.exports = bot => {
  bot.hear(/^=(.+)/i, res => {
    try {
      const equation = res.match[1].replace(/%/g, '(percent)');
      const result = math.eval(equation, {percent: 0.01}).toString();
      if (result.length > 200) {
        res.reply('我已經算出答案了，可是這邊空間不夠寫不下了( ͡° ͜ʖ ͡° )');
      } else {
        res.reply('=' + result, false);
      }
    } catch (e) {
      res.reply('你考倒我了QQ');
    }
  });
};
