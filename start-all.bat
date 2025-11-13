@echo off
REM 博客系统快速启动批处理脚本
REM 用于同时启动前端前台、前端后台和后端服务

echo ================================
echo 博客系统快速启动脚本
echo ================================

REM 设置端口
set BACKEND_PORT=8080
set FRONTEND_PUBLIC_PORT=3000
set FRONTEND_ADMIN_PORT=3001

REM 检查后端可执行文件是否存在
if not exist "backend\blog-backend.exe" (
    echo 错误: 后端可执行文件不存在，请先构建后端项目
    echo 运行: cd backend && go build -o blog-backend main.go
    pause
    exit /b 1
)

REM 检查bun是否安装
where bun >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: bun 未安装，请先安装 bun
    echo 访问: https://bun.sh/
    pause
    exit /b 1
)

echo [1/4] 启动后端服务...
cd backend
start "后端服务" blog-backend.exe
cd ..

REM 等待后端启动
echo 等待后端服务启动...
timeout /t 5 /nobreak > nul

REM 检查后端是否启动成功
echo 检查后端服务状态...
curl -s http://localhost:%BACKEND_PORT%/health >nul 2>nul
if %errorlevel% neq 0 (
    echo 警告: 后端服务可能未完全启动，继续启动其他服务...
)

echo [2/4] 启动前端前台...
cd frontend-public
start "前台服务" bun run dev
cd ..

echo 等待前台服务启动...
timeout /t 3 /nobreak > nul

echo [3/4] 启动前端后台...
cd frontend-admin
start "后台服务" bun run dev
cd ..

echo 等待后台服务启动...
timeout /t 3 /nobreak > nul

echo [4/4] 服务启动完成！
echo ================================
echo 服务状态：
echo   后端服务: http://localhost:%BACKEND_PORT%
echo   前台服务: http://localhost:%FRONTEND_PUBLIC_PORT%
echo   后台服务: http://localhost:%FRONTEND_ADMIN_PORT%
echo   API文档: http://localhost:%BACKEND_PORT%/swagger/index.html
echo ================================
echo 提示：
echo   - 关闭此窗口不会停止服务
echo   - 在任务管理器中结束相关进程
echo   - 使用 stop-all.bat 停止所有服务
echo.
echo 按任意键退出此窗口...
pause > nul