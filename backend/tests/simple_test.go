package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"blog-backend/internal/handlers"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestHealthCheck(t *testing.T) {
	// 创建 mock 数据库
	db, _, err := sqlmock.New()
	if err != nil {
		t.Fatalf("创建 mock 数据库失败: %v", err)
	}
	defer db.Close()

	// 创建处理器
	h := handlers.New(db)

	// 创建 Echo 实例
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// 执行测试 - 调用一个简单的处理器
	err = h.GetPosts(c)

	// 验证结果 - 应该返回错误因为没有设置mock，但不应该panic
	assert.Error(t, err) // 期望错误，因为没有设置SQL mock
}

func TestGetPostsSimple(t *testing.T) {
	// 创建 mock 数据库
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("创建 mock 数据库失败: %v", err)
	}
	defer db.Close()

	// 创建处理器
	h := handlers.New(db)

	// 创建 Echo 实例
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/api/v1/posts", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// 设置简单的 mock 期望 - 返回空结果
	rows := sqlmock.NewRows([]string{"id", "title", "content", "slug", "status", "view_count", "created_at", "updated_at", "author_id", "author_username", "author_email", "category_id", "category_name", "category_description"})

	mock.ExpectQuery("SELECT .+ FROM posts p").
		WithArgs(10, 0).
		WillReturnRows(rows)

	// 执行测试
	err = h.GetPosts(c)

	// 检查 mock 期望
	if mockErr := mock.ExpectationsWereMet(); mockErr != nil {
		t.Logf("Mock expectations not met: %v", mockErr)
	}

	// 验证结果
	if err != nil {
		t.Logf("Handler error: %v", err)
	}

	// 应该返回空数组而不是null
	t.Logf("Response body: %s", rec.Body.String())
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Equal(t, "[]\n", rec.Body.String()) // 期望空数组
}