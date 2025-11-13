# 后端API开发指南

## 技术栈
- **语言**: Go 1.21+
- **框架**: Echo v4
- **数据库**: PostgreSQL
- **文档**: Swagger/OpenAPI 3.0
- **测试**: Go标准测试 + sqlmock + testify

## 项目结构
```
backend/
├── main.go                   # 主程序入口
├── go.mod                    # Go模块文件
├── go.sum                    # Go模块校验
├── Makefile                  # 构建脚本
├── internal/                 # 内部包
│   ├── api/                  # API路由定义
│   │   └── routes.go        # 路由配置
│   ├── config/              # 配置管理
│   │   └── config.go        # 配置加载
│   ├── database/            # 数据库连接
│   │   └── database.go      # 数据库初始化
│   ├── handlers/            # 请求处理器
│   │   ├── handlers.go      # 主要处理器
│   │   ├── categories.go    # 分类管理
│   │   └── comments.go      # 评论管理
│   ├── models/              # 数据模型
│   │   └── models.go        # 模型定义
│   └── middleware/          # 中间件
└── tests/                   # 测试文件
    └── handlers_test.go     # 处理器测试
```

## API端点

### 公开API
- `GET /api/v1/posts` - 获取文章列表
- `GET /api/v1/posts/{slug}` - 获取单篇文章
- `GET /api/v1/categories` - 获取分类列表
- `GET /api/v1/tags` - 获取标签列表
- `POST /api/v1/comments` - 创建评论

### 认证API
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/register` - 用户注册

### 管理API (需要认证)
- `GET /api/v1/admin/posts` - 获取所有文章（管理）
- `POST /api/v1/admin/posts` - 创建文章
- `GET /api/v1/admin/posts/{id}` - 获取文章详情（管理）
- `PUT /api/v1/admin/posts/{id}` - 更新文章
- `DELETE /api/v1/admin/posts/{id}` - 删除文章

### 分类管理
- `GET /api/v1/admin/categories` - 获取分类列表
- `POST /api/v1/admin/categories` - 创建分类
- `PUT /api/v1/admin/categories/{id}` - 更新分类
- `DELETE /api/v1/admin/categories/{id}` - 删除分类

### 标签管理
- `GET /api/v1/admin/tags` - 获取标签列表
- `POST /api/v1/admin/tags` - 创建标签
- `PUT /api/v1/admin/tags/{id}` - 更新标签
- `DELETE /api/v1/admin/tags/{id}` - 删除标签

### 评论管理
- `GET /api/v1/admin/comments` - 获取评论列表
- `PUT /api/v1/admin/comments/{id}/status` - 更新评论状态
- `DELETE /api/v1/admin/comments/{id}` - 删除评论

## 数据库设计

### 用户表 (users)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 分类表 (categories)
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 标签表 (tags)
```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 文章表 (posts)
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    author_id INTEGER REFERENCES users(id),
    category_id INTEGER REFERENCES categories(id),
    status VARCHAR(20) DEFAULT 'draft',
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 文章标签关联表 (post_tags)
```sql
CREATE TABLE post_tags (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);
```

### 评论表 (comments)
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 环境配置

### 环境变量
- `PORT` - 服务器端口 (默认: 8080)
- `DATABASE_URL` - PostgreSQL连接字符串
- `JWT_SECRET` - JWT密钥

### 示例环境配置
```bash
PORT=8080
DATABASE_URL=postgres://freelove:hwc20010616@localhost/blog?sslmode=disable
JWT_SECRET=your-secret-key
```

## 开发指南

### 安装依赖
```bash
go mod download
```

### 运行测试
```bash
# 运行所有测试
go test -v ./tests/...

# 运行测试并生成覆盖率报告
go test -v -coverprofile=coverage.out ./tests/...
go tool cover -html=coverage.out -o coverage.html
```

### 生成Swagger文档
```bash
# 安装swag工具
go install github.com/swaggo/swag/cmd/swag@latest

# 生成文档
swag init -g main.go
```

### 构建项目
```bash
go build -o blog-backend main.go
```

### 运行项目
```bash
go run main.go
```

### 使用Makefile
```bash
# 安装依赖
make deps

# 生成Swagger文档
make swagger

# 运行测试
make test

# 构建项目
make build

# 运行项目
make run

# 完整构建流程
make all
```

## 测试策略

### 单元测试
- 使用 `sqlmock` 进行数据库操作的mock测试
- 使用 `testify/assert` 进行断言
- 覆盖所有API端点的基本功能

### 测试文件结构
```
tests/
├── handlers_test.go    # 处理器单元测试
├── models_test.go      # 模型测试
└── integration_test.go # 集成测试
```

### 运行测试示例
```bash
# 运行特定测试
go test -v -run TestGetPosts ./tests/

# 运行所有测试并显示详细输出
go test -v ./tests/...
```

## API文档

启动服务后，可以通过以下地址访问Swagger文档：
```
http://localhost:8080/swagger/index.html
```

## 错误处理

### 统一错误响应格式
```json
{
  "error": "错误描述信息"
}
```

### HTTP状态码
- `200 OK` - 请求成功
- `201 Created` - 资源创建成功
- `400 Bad Request` - 请求参数错误
- `401 Unauthorized` - 未认证
- `403 Forbidden` - 无权限
- `404 Not Found` - 资源未找到
- `500 Internal Server Error` - 服务器内部错误

## 安全考虑

### 密码安全
- 使用 bcrypt 进行密码哈希
- 密码最小长度限制为6位

### 输入验证
- 所有输入都进行验证和清理
- 使用参数化查询防止SQL注入

### JWT认证 (待实现)
- 登录后返回JWT token
- 需要认证的API端点需要携带token

## 性能优化

### 数据库优化
- 为常用查询字段添加索引
- 使用连接池管理数据库连接

### 缓存策略 (待实现)
- 热门文章缓存
- 分类和标签缓存

## 部署指南

### Docker部署 (待实现)
```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o blog-backend main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/blog-backend .
EXPOSE 8080
CMD ["./blog-backend"]
```

### 环境要求
- Go 1.21+
- PostgreSQL 14+
- 至少512MB内存

## 贡献指南

1. 遵循Go代码规范
2. 为新功能编写测试
3. 更新API文档
4. 提交前运行测试套件
5. 遵循Git提交规范