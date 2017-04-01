const ImageUrl = require('../utils/ImageUrl');
module.exports = bot => {
  bot.responseMiddleware((context, next) => {
    const match = ImageUrl.parse(context.text);
    if (match) {
      setTimeout(() => context.response.deleteMedia(match.shift()), 60 * 1000);
    }
    next();
  });
};
