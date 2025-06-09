const { spawn } = require('child_process');
const path = require('path');

// 设置正确的工作目录
process.chdir(__dirname);

console.log('Current working directory:', process.cwd());
console.log('App directory exists:', require('fs').existsSync('./app'));

// 启动Next.js开发服务器
const nextDev = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

nextDev.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
});

nextDev.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
});
