#!/usr/bin/env node

/**
 * 博客系统快速启动脚本
 * 跨平台解决方案，支持 Windows、macOS、Linux
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// 配置
const CONFIG = {
  backend: {
    name: '后端服务',
    port: 8080,
    command: 'go',
    args: ['run', 'main.go'],
    cwd: path.join(__dirname, 'backend'),
    healthCheck: 'http://localhost:8080/health'
  },
  frontendPublic: {
    name: '前台服务', 
    port: 3000,
    command: 'bun',
    args: ['run', 'dev', '--', '--port', '3000'],
    cwd: path.join(__dirname, 'frontend-client')
  },
  frontendAdmin: {
    name: '后台服务',
    port: 3001, 
    command: 'bun',
    args: ['run', 'dev', '--', '--port', '3001'], 
    cwd: path.join(__dirname, 'frontend-admin')
  }
};

// 颜色输出
const colors = {
  green: text => `\x1b[32m${text}\x1b[0m`,
  red: text => `\x1b[31m${text}\x1b[0m`,
  yellow: text => `\x1b[33m${text}\x1b[0m`,
  blue: text => `\x1b[34m${text}\x1b[0m`,
  magenta: text => `\x1b[35m${text}\x1b[0m`,
  cyan: text => `\x1b[36m${text}\x1b[0m`,
  white: text => `\x1b[37m${text}\x1b[0m`,
  gray: text => `\x1b[90m${text}\x1b[0m`
};

// 日志输出
function log(message, color = 'green') {
  console.log(colors[color](message));
}

// 检查命令是否存在
function checkCommand(command) {
  return new Promise((resolve) => {
    exec(command, (error) => {
      resolve(!error);
    });
  });
}

// 检查端口是否被占用
function checkPort(port) {
  return new Promise((resolve) => {
    const server = require('net').createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}

// 健康检查
function healthCheck(url, maxAttempts = 10) {
  return new Promise((resolve) => {
    let attempts = 0;
    
    function check() {
      attempts++;
      const http = require('http');
      
      const req = http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
        req.destroy();
      });
      
      req.on('error', () => {
        if (attempts < maxAttempts) {
          setTimeout(check, 2000);
        } else {
          resolve(false);
        }
        req.destroy();
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        if (attempts < maxAttempts) {
          setTimeout(check, 2000);
        } else {
          resolve(false);
        }
      });
    }
    
    check();
  });
}

// 启动服务
function startService(config) {
  return new Promise((resolve, reject) => {
    log(`[1/3] 启动 ${config.name}...`, 'blue');
    
    // 检查端口
    checkPort(config.port).then(isOccupied => {
      if (isOccupied) {
        log(`警告: 端口 ${config.port} 已被占用`, 'yellow');
      }
      
      // 构建命令
      const command = config.command;
      const args = config.args || [];
      const options = {
        cwd: config.cwd,
        stdio: 'inherit',
        shell: false
      };
      
      log(`执行命令: ${command} ${args.join(' ')}`, 'cyan');
      
      // 启动进程
      const child = spawn(command, args, options);
      
      child.on('error', (error) => {
        log(`启动 ${config.name} 失败: ${error.message}`, 'red');
        reject(error);
      });

      child.on('spawn', () => {
        log(`${config.name} 进程已启动 (PID: ${child.pid})`, 'green');
        resolve(child);
      });

      // 保存进程信息
      if (!global.processes) {
        global.processes = [];
      }
      global.processes.push({ child, config });
    });
  });
}

// 停止所有服务
function stopAllServices() {
  log('\n🛑 正在停止所有服务...', 'yellow');
  
  if (global.processes && global.processes.length > 0) {
    global.processes.forEach(({ child, config }) => {
      try {
        if (child && !child.killed) {
          log(`停止 ${config.name} (PID: ${child.pid})...`, 'yellow');
          
          if (process.platform === 'win32') {
            exec(`taskkill /pid ${child.pid} /T /F`);
          } else {
            child.kill('SIGTERM');
          }
        }
      } catch (error) {
        log(`停止 ${config.name} 失败: ${error.message}`, 'red');
      }
    });
  }
  
  log('✅ 所有服务已停止', 'green');
}

// 主函数
async function main() {
  try {
    log('🚀 博客系统快速启动脚本', 'green');
    log('================================', 'green');
    
    // 检查依赖
    log('📋 检查依赖环境...', 'blue');
    
    const hasBun = await checkCommand('bun --version');
    const hasGo = await checkCommand('go version');
    
    if (!hasBun) {
      log('❌ bun 未安装，请先安装 bun', 'red');
      log('访问: https://bun.sh/', 'cyan');
      process.exit(1);
    }
    
    if (!hasGo) {
      log('❌ Go 未安装，请先安装 Go', 'red');
      log('访问: https://golang.org/', 'cyan');
      process.exit(1);
    }
    
    log('✅ 依赖检查通过', 'green');
    
    
    
    // 启动服务
    log('\n🚀 开始启动服务...', 'green');
    
    // 启动后端
    await startService(CONFIG.backend);
    
    // 等待后端启动
    log('等待后端服务启动...', 'yellow');
    const backendHealthy = await healthCheck(CONFIG.backend.healthCheck);
    
    if (backendHealthy) {
      log('✅ 后端服务启动成功', 'green');
    } else {
      log('⚠️  后端服务可能未完全启动，继续启动其他服务...', 'yellow');
    }
    
    // 启动前台
    await startService(CONFIG.frontendPublic);
    
    // 启动后台
    await startService(CONFIG.frontendAdmin);
    
    // 显示完成信息
    log('\n🎉 所有服务启动完成！', 'green');
    log('================================', 'green');
    log('📊 服务状态：', 'cyan');
    log(`  🖥️  后端服务: http://localhost:${CONFIG.backend.port}`, 'white');
    log(`  📖 前台服务: http://localhost:${CONFIG.frontendPublic.port}`, 'white');
    log(`  ⚙️  后台服务: http://localhost:${CONFIG.frontendAdmin.port}`, 'white');
    log(`  📚 API文档: http://localhost:${CONFIG.backend.port}/swagger/index.html`, 'white');
    log('');
    log('💡 使用说明：', 'yellow');
    log('  • 按 Ctrl+C 停止所有服务', 'gray');
    log('  • 服务将在后台运行', 'gray');
    log('  • 使用 kill 命令或任务管理器停止进程', 'gray');
    log('');
    log('🚀 博客系统已就绪！', 'green');
    
    // 设置退出处理
    process.on('SIGINT', () => {
      log('\n收到停止信号...', 'yellow');
      stopAllServices();
      process.exit(0);
    });
    
    process.on('exit', stopAllServices);
    
  } catch (error) {
    log(`启动失败: ${error.message}`, 'red');
    stopAllServices();
    process.exit(1);
  }
}

// 运行主函数
main().catch(error => {
  log(`程序错误: ${error.message}`, 'red');
  process.exit(1);
});
