const spawn = require('cross-spawn');
const { execFile, exec } = require('child_process');
const execa = require('execa');

const path = require('path');

pathc = path.resolve(__dirname, '..');

// const pid = spawn('npm', ['run', 'start'], { cwd: pathc });
// const pid = spawn('cd', ['/d', 'E:\\worker\\client\\insight-bi'], { cwd: pathc });
// const pid = execFile('./com');

console.log(execa);

const pid = exec('cd /d E:\\worker\\client\\insight-main & npm run dev');

pid.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

pid.stdout.on('error', (data) => {
    console.log(`stdout: ${data}`);
});

pid.stdout.on('message', (data) => {
    console.log(`stdout: ${data}`);
});

pid.on('exit', (code, signal) => {
    console.log(`sss ${code} ${signal}`);
});

pid.on('close', (code) => {
    console.log(`子进程退出，退出码 ${code}`);
});
