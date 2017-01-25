const core = require('mathjs/core');
const math = core.create();

math.import(require('mathjs/lib/function/arithmetic'));
math.import(require('mathjs/lib/expression'));

module.exports = math;
