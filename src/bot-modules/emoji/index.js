const wcwidth = require('wcwidth');

module.exports = bot => {
  const ratio = 3.692;
  bot.respond(/^(燒毀?|110|抓|非洲|花式)\s+(.+)/, res => {
    let emoji = '(l)';

    switch (res.match[1]) {
      case '燒':
      case '燒毀':
        emoji = '(fire)';
        break;
      case '110':
      case '抓':
        emoji = '(cop)';
        break;
      case '非洲':
        emoji = ['(boy)', '(girl)'];
        break;
      case '花式':
        emoji = ['(cop)', '(boy)', '(fire)', '(girl)'];
        break;
      default:
        break;
    }

    const nameLength = wcwidth(res.match[2]);
    const receivers = res.message.getReplyPublicIds().filter(x => x !== bot.getPublicId());
    if (typeof emoji === 'string') {
      emoji = [emoji];
    }
    let top = '';
    let middle = '';
    let bottom = '';
    const length = Math.round(nameLength / ratio);
    for (let i = 0; i < length + 2; ++i) {
      top += emoji[i % emoji.length];
      bottom += emoji[(i + 2) % emoji.length];
    }
    middle = emoji[1 % emoji.length] + res.match[2] + emoji[(length + 2) % emoji.length];
    const msg = `${top}(end)${middle}(end)${bottom}`;
    res.send(msg, receivers);
  });
};
