package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"blog-backend/internal/handlers"
	"blog-backend/internal/models"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetPosts(t *testing.T) {
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
	req := httptest.NewRequest(http.MethodGet, "/api/v1/posts?page=1", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// 设置 mock 期望
	rows := sqlmock.NewRows([]string{"id", "title", "content", "slug", "status", "view_count", "created_at", "updated_at", "author_id", "author_username", "author_email", "category_id", "category_name", "category_description"}).
		AddRow(1, "测试文章", "文章内容", "test-post", "published", 100, "2024-01-01", "2024-01-01", 1, "admin", "admin@example.com", 1, "技术", "技术类文章")

	mock.ExpectQuery("SELECT .+ FROM posts p JOIN users u ON p.author_id = u.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.status = 'published' ORDER BY p.created_at DESC LIMIT .+ OFFSET .+").
		WithArgs(10, 0).
		WillReturnRows(rows)

	// 执行测试
	err = h.GetPosts(c)

	// 检查 mock 期望是否满足
	if mockErr := mock.ExpectationsWereMet(); mockErr != nil {
		t.Logf("Mock expectations not met: %v", mockErr)
	}

	// 验证结果
	if err != nil {
		t.Logf("Handler error: %v", err)
	}
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	// 打印响应内容用于调试
	t.Logf("Response body: %s", rec.Body.String())

	var posts []models.Post
	err = json.Unmarshal(rec.Body.Bytes(), &posts)
	if err != nil {
		t.Logf("JSON unmarshal error: %v", err)
	}
	assert.NoError(t, err)
	assert.Len(t, posts, 1)
	assert.Equal(t, "测试文章", posts[0].Title)
}

func TestGetPost(t *testing.T) {
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
	req := httptest.NewRequest(http.MethodGet, "/api/v1/posts/test-post", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("slug")
	c.SetParamValues("test-post")

	// 设置 mock 期望 - 查询文章
	rows := sqlmock.NewRows([]string{"id", "title", "content", "slug", "status", "view_count", "created_at", "updated_at", "author_id", "author_username", "author_email", "category_id", "category_name", "category_description"}).
		AddRow(1, "测试文章", "文章内容", "test-post", "published", 100, "2024-01-01", "2024-01-01", 1, "admin", "admin@example.com", 1, "技术", "技术类文章")

	mock.ExpectQuery("SELECT p.id, p.title, p.content, p.slug, p.status, p.view_count, p.created_at, p.updated_at, u.id as author_id, u.username as author_username, u.email as author_email, c.id as category_id, c.name as category_name, c.description as category_description FROM posts p JOIN users u ON p.author_id = u.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = .+ AND p.status = 'published'").
		WithArgs("test-post").
		WillReturnRows(rows)

	// 设置 mock 期望 - 查询标签
	tagRows := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "Go").
		AddRow(2, "Web开发")

	mock.ExpectQuery("SELECT t.id, t.name FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?").
		WithArgs(1).
		WillReturnRows(tagRows)

	// 设置 mock 期望 - 更新浏览量
	mock.ExpectExec("UPDATE posts SET view_count = view_count + 1 WHERE id = ?").
		WithArgs(1).
		WillReturnResult(sqlmock.NewResult(0, 1))

	// 执行测试
	err = h.GetPost(c)

	// 验证结果
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var post models.Post
	err = json.Unmarshal(rec.Body.Bytes(), &post)
	assert.NoError(t, err)
	assert.Equal(t, "测试文章", post.Title)
	assert.Equal(t, "test-post", post.Slug)
}

func TestLogin(t *testing.T) {
	// 创建 mock 数据库
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("创建 mock 数据库失败: %v", err)
	}
	defer db.Close()

	// 创建处理器
	h := handlers.New(db)

	// 创建登录请求
	loginReq := models.LoginRequest{
		Username: "admin",
		Password: "password123",
	}

	// 创建 Echo 实例
	e := echo.New()
	reqBody, _ := json.Marshal(loginReq)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewReader(reqBody))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// 设置 mock 期望 - 查询用户
	rows := sqlmock.NewRows([]string{"id", "username", "email", "password_hash"}).
		AddRow(1, "admin", "admin@example.com", "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi")

	mock.ExpectQuery("SELECT id, username, email, password_hash FROM users WHERE username = ?").
		WithArgs("admin").
		WillReturnRows(rows)

	// 执行测试
	err = h.Login(c)

	// 验证结果
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response map[string]interface{}
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response, "token")
}

func TestCreateComment(t *testing.T) {
	// 创建 mock 数据库
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("创建 mock 数据库失败: %v", err)
	}
	defer db.Close()

	// 创建处理器
	h := handlers.New(db)

	// 创建评论请求
	commentReq := models.Comment{
		PostID:     1,
		AuthorName: "张三",
		AuthorEmail: "zhangsan@example.com",
		Content:    "这是一个测试评论",
	}

	// 创建 Echo 实例
	e := echo.New()
	reqBody, _ := json.Marshal(commentReq)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/comments", bytes.NewReader(reqBody))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// 设置 mock 期望
	mock.ExpectExec("INSERT INTO comments \\(post_id, author_name, author_email, content\\) VALUES \\?, \\?, \\?, \\?\\)").
		WithArgs(1, "张三", "zhangsan@example.com", "这是一个测试评论").
		WillReturnResult(sqlmock.NewResult(1, 1))

	// 执行测试
	err = h.CreateComment(c)

	// 验证结果
	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, rec.Code)

	var response map[string]interface{}
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "评论创建成功", response["message"])
}