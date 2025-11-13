# 博客系统停止脚本
# 用于停止所有正在运行的服务

Write-Host "🛑 博客系统停止脚本" -ForegroundColor Red
Write-Host "================================" -ForegroundColor Red

# 定义端口
$BACKEND_PORT = 8080
$FRONTEND_PUBLIC_PORT = 3000
$FRONTEND_ADMIN_PORT = 3001

# 获取进程ID的函数
function Get-ProcessId {
    param($Port)
    try {
        $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($process) {
            return $process.OwningProcess
        }
    } catch {
        return $null
    }
    return $null
}

# 终止进程的函数
function Stop-ProcessByPort {
    param($Port, $ServiceName)
    $processId = Get-ProcessId -Port $Port
    if ($processId) {
        try {
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "🛑 停止 $ServiceName (PID: $processId, 端口: $Port)..." -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "✅ $ServiceName 已停止" -ForegroundColor Green
            }
        } catch {
            Write-Host "⚠️  无法停止 $ServiceName : $_" -ForegroundColor Yellow
        }
    } else {
        Write-Host "ℹ️  $ServiceName 未运行 (端口: $Port)" -ForegroundColor Gray
    }
}

# 停止各个服务
Write-Host "🔍 检查并停止服务..." -ForegroundColor Blue

Stop-ProcessByPort -Port $BACKEND_PORT -ServiceName "后端服务"
Stop-ProcessByPort -Port $FRONTEND_PUBLIC_PORT -ServiceName "前端前台"
Stop-ProcessByPort -Port $FRONTEND_ADMIN_PORT -ServiceName "前端后台"

# 额外检查可能的进程
Write-Host "🔍 检查其他可能的进程..." -ForegroundColor Blue

# 检查可能的 Node.js 进程 (前端)
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "发现 Node.js 进程，正在检查..." -ForegroundColor Yellow
    foreach ($proc in $nodeProcesses) {
        try {
            $commandLine = (Get-WmiObject -Class Win32_Process -Filter "ProcessId=$($proc.Id)").CommandLine
            if ($commandLine -match "next|vite|dev") {
                Write-Host "🛑 停止前端开发进程 (PID: $($proc.Id))..." -ForegroundColor Yellow
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
            }
        } catch {
            # 忽略错误
        }
    }
}

# 检查可能的 Go 进程 (后端)
$goProcesses = Get-Process -Name "blog-backend" -ErrorAction SilentlyContinue
if ($goProcesses) {
    Write-Host "🛑 停止后端进程..." -ForegroundColor Yellow
    foreach ($proc in $goProcesses) {
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "✅ 所有服务已停止完成！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green