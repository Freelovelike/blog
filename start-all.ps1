# 博客系统快速启动脚本
# 用于同时启动前端前台、前端后台和后端服务

Write-Host "🚀 博客系统快速启动脚本" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# 检查端口是否被占用
function Test-Port {
    param($Port)
    $result = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $result -ne $null
}

# 获取进程ID
function Get-ProcessId {
    param($Port)
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($process) {
        return $process.OwningProcess
    }
    return $null
}

# 终止进程
function Stop-ProcessByPort {
    param($Port)
    $processId = Get-ProcessId -Port $Port
    if ($processId) {
        Write-Host "🛑 终止端口 $Port 上的进程..." -ForegroundColor Yellow
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}

# 检查依赖
Write-Host "📋 检查依赖环境..." -ForegroundColor Blue

# 检查bun
if (!(Get-Command bun -ErrorAction SilentlyContinue)) {
    Write-Host "❌ bun 未安装，请先安装 bun" -ForegroundColor Red
    exit 1
}

# 检查Go
if (!(Get-Command go -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Go 未安装，请先安装 Go" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 依赖检查通过" -ForegroundColor Green

# 定义端口
$BACKEND_PORT = 8080
$FRONTEND_PUBLIC_PORT = 3000
$FRONTEND_ADMIN_PORT = 3001

# 清理端口
Write-Host "🧹 清理端口..." -ForegroundColor Blue
Stop-ProcessByPort -Port $BACKEND_PORT
Stop-ProcessByPort -Port $FRONTEND_PUBLIC_PORT
Stop-ProcessByPort -Port $FRONTEND_ADMIN_PORT

# 启动后端服务
Write-Host "🔧 启动后端服务..." -ForegroundColor Blue
Set-Location -Path ".\backend"
Start-Process -FilePath ".\blog-backend" -NoNewWindow -PassThru
Set-Location -Path ".."

# 等待后端启动
Write-Host "⏳ 等待后端服务启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# 检查后端是否启动成功
$backendHealth = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$BACKEND_PORT/health" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $backendHealth = $true
            break
        }
    } catch {
        Write-Host "⏳ 等待后端服务响应... ($($i+1)/10)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (!$backendHealth) {
    Write-Host "❌ 后端服务启动失败" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 后端服务启动成功 (端口: $BACKEND_PORT)" -ForegroundColor Green

# 启动前端前台
Write-Host "🌐 启动前端前台..." -ForegroundColor Blue
Set-Location -Path ".\frontend-public"
Start-Process -FilePath "bun" -ArgumentList "run dev" -NoNewWindow -PassThru
Set-Location -Path ".."

# 等待前端前台启动
Start-Sleep -Seconds 3
Write-Host "✅ 前端前台启动成功 (端口: $FRONTEND_PUBLIC_PORT)" -ForegroundColor Green

# 启动前端后台
Write-Host "🎛️ 启动前端后台..." -ForegroundColor Blue
Set-Location -Path ".\frontend-admin"
Start-Process -FilePath "bun" -ArgumentList "run dev" -NoNewWindow -PassThru
Set-Location -Path ".."

# 等待前端后台启动
Start-Sleep -Seconds 3
Write-Host "✅ 前端后台启动成功 (端口: $FRONTEND_ADMIN_PORT)" -ForegroundColor Green

# 显示访问信息
Write-Host ""
Write-Host "🎉 所有服务启动完成！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "📊 服务状态：" -ForegroundColor Cyan
Write-Host "  🖥️  后端服务: http://localhost:$BACKEND_PORT" -ForegroundColor White
Write-Host "  📖 前端前台: http://localhost:$FRONTEND_PUBLIC_PORT" -ForegroundColor White
Write-Host "  ⚙️  前端后台: http://localhost:$FRONTEND_ADMIN_PORT" -ForegroundColor White
Write-Host "  📚 API文档: http://localhost:$BACKEND_PORT/swagger/index.html" -ForegroundColor White
Write-Host ""
Write-Host "💡 使用说明：" -ForegroundColor Yellow
Write-Host "  • 按 Ctrl+C 停止所有服务" -ForegroundColor Gray
Write-Host "  • 关闭此窗口将终止所有服务" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 博客系统已就绪！" -ForegroundColor Green

# 等待用户中断
try {
    Write-Host "🔄 服务运行中... (按 Ctrl+C 停止)" -ForegroundColor Magenta
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch [System.Management.Automation.Host.HostException] {
    Write-Host ""
    Write-Host "🛑 正在停止所有服务..." -ForegroundColor Yellow
    
    # 清理端口
    Stop-ProcessByPort -Port $BACKEND_PORT
    Stop-ProcessByPort -Port $FRONTEND_PUBLIC_PORT
    Stop-ProcessByPort -Port $FRONTEND_ADMIN_PORT
    
    Write-Host "✅ 所有服务已停止" -ForegroundColor Green
}