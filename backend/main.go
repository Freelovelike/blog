package main

import (
	"blog-backend/internal/api"
	"blog-backend/internal/config"
	"blog-backend/internal/database"
	"log"

	_ "blog-backend/docs" // Swagger文档

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
)

// @title 博客系统API
// @version 1.0
// @description 前后端分离的博客系统后端API
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api/v1

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func main() {
	// 加载配置
	cfg := config.Load()

	// 初始化数据库
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// 创建Echo实例
	e := echo.New()

	// 中间件
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Swagger文档路由
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	// 设置API路由
	api.SetupRoutes(e, db)

	// 启动服务器
	log.Printf("Server starting on port %s", cfg.Port)
	log.Printf("Swagger文档地址: http://localhost:%s/swagger/index.html", cfg.Port)
	if err := e.Start(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
