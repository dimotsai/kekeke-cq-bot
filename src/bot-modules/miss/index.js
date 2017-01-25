const _ = require('lodash');

module.exports = bot => {
  bot.respond(/^(.*)$/, res => {
    // const words = res.match[1];
    // const reply = [
      // '你才#keyword，你全家都#keyword！',
      // '我讀書少，你不要騙我',
      // '嚇的我都#keyword了',
      // '我懷疑你是#keyword',
      // '你#keyword系？',
      // '#keyword？是你？',
      // '你什麼時候產生了#keyword的錯覺',
      // '你好糟糕，請暫時不要跟我說話',
      // '這種要求我第一次聽到'
    // ];
    // if (words.length > 0 && words.length <= 5) {
      // res.reply(_.sample(reply).replace(/#keyword/g, words));
    // }
    res.reply('>< 不懂');
  });
};
