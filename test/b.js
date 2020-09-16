const process = require('process');

console.log(process.cwd());

const reg = /^(\d+)(\-|\d)+\d$/;

console.log(reg.test('011-23-31'));
