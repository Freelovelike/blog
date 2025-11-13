package api

import (
	"blog-backend/internal/handlers"
	"database/sql"

	"github.com/labstack/echo/v4"
)

func SetupRoutes(e *echo.Echo, db *sql.DB) {
	// 创建处理器
	h := handlers.New(db)

	e.GET("/health", func(c echo.Context) error { return c.String(200, "OK") })

	// API v1路由组
	api := e.Group("/api/v1")

	// 公开路由
	api.GET("/posts", h.GetPosts)
	api.GET("/posts/:slug", h.GetPost)
	api.GET("/categories", h.GetCategories)
	api.GET("/tags", h.GetTags)
	api.POST("/comments", h.CreateComment)

	// 认证路由
	auth := api.Group("/auth")
	auth.POST("/login", h.Login)
	auth.POST("/register", h.Register)

	// 需要认证的管理路由
	admin := api.Group("/admin")
	// TODO: 添加JWT中间件

	// 文章管理
	admin.GET("/posts", h.AdminGetPosts)
	admin.POST("/posts", h.CreatePost)
	admin.GET("/posts/:id", h.AdminGetPost)
	admin.PUT("/posts/:id", h.UpdatePost)
	admin.DELETE("/posts/:id", h.DeletePost)

	// 分类管理
	admin.GET("/categories", h.AdminGetCategories)
	admin.POST("/categories", h.CreateCategory)
	admin.PUT("/categories/:id", h.UpdateCategory)
	admin.DELETE("/categories/:id", h.DeleteCategory)

	// 标签管理
	admin.GET("/tags", h.AdminGetTags)
	admin.POST("/tags", h.CreateTag)
	admin.PUT("/tags/:id", h.UpdateTag)
	admin.DELETE("/tags/:id", h.DeleteTag)

	// 评论管理
	admin.GET("/comments", h.AdminGetComments)
	admin.PUT("/comments/:id/status", h.UpdateCommentStatus)
	admin.DELETE("/comments/:id", h.DeleteComment)
}
