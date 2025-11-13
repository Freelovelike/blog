#!/usr/bin/env node

/**
 * 博客系统停止脚本
 * 跨平台解决方案，支持 Windows、macOS、Linux
 */

const { exec } = require('child_process');
const os = require('os');

// 颜色输出
const colors = {
  green: text => `\x1b[32m${text}\x1b[0m`,
  red: text => `\x1b[31m${text}\x1b[0m`,
  yellow: text => `\x1b[33m${text}\x1b[0m`,
  blue: text => `\x1b[34m${text}\x1b[0m`
};

function log(message, color = 'green') {
  console.log(colors[color](message));
}

// 执行命令
function executeCommand(command) {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
}

// 停止进程
async function stopProcess(name, command) {
  log(`停止 ${name}...`, 'yellow');
  const result = await executeCommand(command);
  
  if (result.error) {
    log(`  ${name} 未运行或已停止`, 'gray');
  } else {
    log(`  ${name} 已停止`, 'green');
  }
}

// 主函数
async function main() {
  try {
    log('==============================', 'red');
    log('博客系统停止脚本', 'red');
    log('==============================', 'red');
    
    log('停止所有服务...', 'blue');
    
    const platform = os.platform();
    
    if (platform === 'win32') {
      // Windows 系统
      await stopProcess('后端服务', 'taskkill /F /IM blog-backend.exe');
      await stopProcess('bun进程', 'taskkill /F /IM bun.exe');
      await stopProcess('Node.js进程', 'taskkill /F /IM node.exe');
    } else {
      // macOS/Linux 系统
      await stopProcess('后端服务', 'pkill -f blog-backend');
      await stopProcess('bun进程', 'pkill -f bun');
      await stopProcess('Node.js进程', 'pkill -f "node.*dev"');
    }
    
    log('==============================', 'red');
    log('所有服务已停止完成！', 'green');
    log('==============================', 'red');
    
  } catch (error) {
    log(`错误: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 运行主函数
main().catch(error => {
  log(`程序错误: ${error.message}`, 'red');
  process.exit(1);
});