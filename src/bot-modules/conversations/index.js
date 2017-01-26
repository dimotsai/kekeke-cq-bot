module.exports = bot => [
  require('./local'),
  require('./online')
].forEach(m => m(bot));
