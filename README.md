# 博客系统项目

一个前后端分离的全栈博客系统，包含前台展示、后台管理和后端API服务。

## 🚀 一键启动

使用 PowerShell 脚本快速启动所有服务：

```powershell
# 启动所有服务
.\start-all.ps1

# 停止所有服务  
.\stop-all.ps1
```

脚本功能：
- ✅ 自动检查依赖环境（bun、Go）
- ✅ 清理端口占用
- ✅ 按顺序启动服务（后端→前台→后台）
- ✅ 健康检查验证
- ✅ 统一的服务管理
- ✅ 优雅的服务停止

## 项目架构

### 技术栈
- **前端前台**: Next.js 16 + shadcn/ui + TypeScript
- **前端后台**: Vite + React 19 + shadcn/ui + TypeScript  
- **后端**: Go + Echo框架 + PostgreSQL
- **数据库**: PostgreSQL
- **包管理器**: bun (前端)

### 项目结构
```
blog/
├── frontend-public/     # 前台展示 (Next.js)
├── frontend-admin/    # 后台管理 (Vite React)
├── backend/          # 后端API (Go Echo)
├── docs/             # 项目文档
└── README.md         # 项目说明
```

## 功能模块

### 前台功能
- 博客文章展示
- 文章分类和标签
- 文章搜索
- 评论系统
- 响应式设计

### 后台功能
- 文章管理 (CRUD)
- 分类管理
- 标签管理
- 评论审核
- 系统设置
- 仪表盘

### 后端API
- RESTful API设计
- JWT认证
- 数据库操作
- 文件上传
- 数据验证

## 快速开始

### 环境要求
- Node.js 18+
- Go 1.21+
- PostgreSQL 14+
- bun (前端包管理器)

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd blog
```

2. 安装依赖
```bash
# 前台
cd frontend-client
npm install

# 后台
cd ../frontend-admin  
npm install

# 后端
cd ../backend
go mod download
```

3. 配置环境变量
```bash
# 复制环境变量模板并配置
cp .env.example .env
```

4. 启动服务
```bash
# 启动所有服务
npm run dev:all
```

## 开发文档

- [前端前台开发指南](docs/frontend-client.md)
- [前端后台开发指南](docs/frontend-admin.md)  
- [后端API开发指南](docs/backend.md)
- [数据库设计](docs/database.md)
- [部署指南](docs/deployment.md)

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

MIT License