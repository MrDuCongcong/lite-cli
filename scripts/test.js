const spawn = require('cross-spawn');

const path = process.cwd();


console.log("执行start");


test = spawn('npm', ['run', 'test'], { stdio: 'inherit' });