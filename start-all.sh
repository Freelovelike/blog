#!/bin/bash

# 博客系统快速启动脚本
# 适用于 macOS/Linux

echo "=============================="
echo "博客系统快速启动脚本"
echo "=============================="

# 设置端口
BACKEND_PORT=8080
FRONTEND_PUBLIC_PORT=3000
FRONTEND_ADMIN_PORT=3001

# 检查依赖
echo "[检查] 检查依赖环境..."

if ! command -v bun &> /dev/null; then
    echo "错误: bun 未安装，请先安装 bun"
    echo "访问: https://bun.sh/"
    exit 1
fi

if ! command -v go &> /dev/null; then
    echo "错误: Go 未安装，请先安装 Go"
    echo "访问: https://golang.org/"
    exit 1
fi

# 检查后端可执行文件
if [ ! -f "backend/blog-backend" ]; then
    echo "错误: 后端可执行文件不存在"
    echo "请先构建后端项目:"
    echo "cd backend && go build -o blog-backend main.go"
    exit 1
fi

echo "[成功] 依赖检查通过"

# 函数：检查端口占用
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "[警告] 端口 $port 已被占用"
        return 0
    else
        return 1
    fi
}

# 函数：停止端口进程
stop_port_process() {
    local port=$1
    local pids=$(lsof -ti :$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "[停止] 终止端口 $port 上的进程..."
        kill -9 $pids 2>/dev/null
        sleep 1
    fi
}

# 清理端口
echo "[清理] 检查端口占用..."
for port in $BACKEND_PORT $FRONTEND_PUBLIC_PORT $FRONTEND_ADMIN_PORT; do
    if check_port $port; then
        stop_port_process $port
    fi
done

# 启动后端服务
echo "[1/4] 启动后端服务..."
cd backend
./blog-backend &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "[等待] 等待后端服务启动..."
sleep 3

# 检查后端是否启动成功
echo "[检查] 检查后端服务状态..."
if curl -s http://localhost:$BACKEND_PORT/health >/dev/null 2>&1; then
    echo "[成功] 后端服务启动成功"
else
    echo "[警告] 后端服务可能未完全启动，继续启动其他服务..."
fi

# 启动前端前台
echo "[2/4] 启动前端前台..."
cd frontend-public
bun run dev &
FRONTEND_PUBLIC_PID=$!
cd ..

echo "[等待] 等待前台服务启动..."
sleep 2

# 启动前端后台
echo "[3/4] 启动前端后台..."
cd frontend-admin
bun run dev &
FRONTEND_ADMIN_PID=$!
cd ..

echo "[等待] 等待后台服务启动..."
sleep 2

echo "[4/4] 服务启动完成！"
echo "=============================="
echo "服务状态："
echo "  后端服务: http://localhost:$BACKEND_PORT"
echo "  前台服务: http://localhost:$FRONTEND_PUBLIC_PORT"
echo "  后台服务: http://localhost:$FRONTEND_ADMIN_PORT"
echo "  API文档: http://localhost:$BACKEND_PORT/swagger/index.html"
echo "=============================="
echo "提示："
echo "  - 按 Ctrl+C 停止所有服务"
echo "  - 使用 stop-all.sh 停止所有服务"
echo "=============================="
echo "🚀 博客系统已就绪！"

# 保存PID到文件
echo $BACKEND_PID > .pids
echo $FRONTEND_PUBLIC_PID >> .pids
echo $FRONTEND_ADMIN_PID >> .pids

# 等待用户中断
trap 'echo "[停止] 正在停止所有服务..."; kill $(cat .pids 2>/dev/null) 2>/dev/null; rm -f .pids; echo "[完成] 所有服务已停止"; exit' INT TERM

# 保持脚本运行
wait