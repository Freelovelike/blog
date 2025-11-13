.PHONY: swagger test build run clean

# 生成Swagger文档
swagger:
	@echo "Generating Swagger docs..."
	swag init -g main.go

# 运行测试
test:
	@echo "Running tests..."
	go test -v ./tests/...

# 运行测试并生成覆盖率报告
test-coverage:
	@echo "Running tests with coverage..."
	go test -v -coverprofile=coverage.out ./tests/...
	go tool cover -html=coverage.out -o coverage.html

# 构建项目
build:
	@echo "Building project..."
	go build -o blog-backend main.go

# 运行项目
run:
	@echo "Running project..."
	go run main.go

# 清理
clean:
	@echo "Cleaning up..."
	rm -f blog-backend
	rm -f coverage.out coverage.html
	rm -rf docs/

# 安装依赖
deps:
	@echo "Installing dependencies..."
	go mod download
	go install github.com/swaggo/swag/cmd/swag@latest

# 开发模式（带热重载）
dev:
	@echo "Starting development server..."
	air

# 全部流程：安装依赖、生成文档、测试、构建
all: deps swagger test build

# 帮助
help:
	@echo "Available targets:"
	@echo "  swagger      - Generate Swagger documentation"
	@echo "  test         - Run tests"
	@echo "  test-coverage- Run tests with coverage report"
	@echo "  build        - Build the project"
	@echo "  run          - Run the project"
	@echo "  clean        - Clean up build artifacts"
	@echo "  deps         - Install dependencies"
	@echo "  dev          - Start development server with hot reload"
	@echo "  all          - Run complete build pipeline"
	@echo "  help         - Show this help message"