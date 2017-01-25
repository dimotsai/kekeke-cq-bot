const weighted = require('weighted');
const uuid = require('uuid');

module.exports = bot => {
  bot.respond(/^(試?人品)/i, res => {
    const images = ['http://i.imgur.com/9h1t4J4.gif', 'http://i.imgur.com/kx2tTuc.gif'];
    const weights = [0.13, 0.87];
    const image = weighted.select(images, weights) + '#' + uuid.v4();
    res.reply(image);
    setTimeout(() => res.deleteMedia(image), 60 * 1000);
  });
};
