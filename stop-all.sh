#!/bin/bash

# 博客系统停止脚本
# 适用于 macOS/Linux

echo "=============================="
echo "博客系统停止脚本"
echo "=============================="

echo "[1/4] 停止所有服务..."

# 停止保存的PID进程
if [ -f ".pids" ]; then
    echo "[停止] 停止保存的进程..."
    for pid in $(cat .pids); do
        if kill -0 $pid 2>/dev/null; then
            echo "  停止PID: $pid"
            kill -9 $pid 2>/dev/null
        fi
    done
    rm -f .pids
fi

echo "[2/4] 停止后端服务..."
pkill -f blog-backend 2>/dev/null

echo "[3/4] 停止前端服务..."
pkill -f "bun run dev" 2>/dev/null

echo "[4/4] 停止Node.js进程..."
pkill -f "node.*dev" 2>/dev/null

echo "=============================="
echo "✅ 所有服务已停止完成！"
echo "=============================="