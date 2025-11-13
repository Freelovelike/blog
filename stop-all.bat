@echo off
REM 博客系统停止批处理脚本
REM 用于停止所有正在运行的服务

echo ================================
echo 博客系统停止脚本
echo ================================

echo [1/3] 停止后端服务...
taskkill /F /IM blog-backend.exe >nul 2>nul
if %errorlevel% equ 0 (
    echo 后端服务已停止
) else (
    echo 后端服务未运行
)

echo [2/3] 停止前端服务...
taskkill /F /IM bun.exe >nul 2>nul
if %errorlevel% equ 0 (
    echo bun进程已停止
) else (
    echo bun进程未运行
)

echo [3/3] 停止Node.js进程...
taskkill /F /IM node.exe >nul 2>nul
if %errorlevel% equ 0 (
    echo Node.js进程已停止
) else (
    echo Node.js进程未运行
)

echo ================================
echo 所有服务已停止完成！
echo ================================
pause