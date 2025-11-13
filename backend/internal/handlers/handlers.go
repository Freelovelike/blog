package handlers

import (
	"blog-backend/internal/models"
	"database/sql"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

type Handler struct {
	db *sql.DB
}

func New(db *sql.DB) *Handler {
	return &Handler{db: db}
}

// GetPosts 获取文章列表
// @Summary 获取已发布的文章列表
// @Description 获取已发布的文章列表，支持分页
// @Tags 文章
// @Accept json
// @Produce json
// @Param page query int false "页码，默认为1"
// @Success 200 {array} models.Post "文章列表"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /posts [get]
func (h *Handler) GetPosts(c echo.Context) error {
	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page < 1 {
		page = 1
	}
	limit := 10
	offset := (page - 1) * limit

	query := `
		SELECT p.id, p.title, p.content, p.slug, p.status, p.view_count, p.created_at, p.updated_at,
			   u.id as author_id, u.username as author_username, u.email as author_email,
			   c.id as category_id, c.name as category_name, c.description as category_description
		FROM posts p
		JOIN users u ON p.author_id = u.id
		LEFT JOIN categories c ON p.category_id = c.id
		WHERE p.status = 'published'
		ORDER BY p.created_at DESC
		LIMIT $1 OFFSET $2`

	rows, err := h.db.Query(query, limit, offset)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch posts"})
	}
	defer rows.Close()

	posts := make([]models.Post, 0)
	for rows.Next() {
		var post models.Post
		var author models.User
		var category models.Category

		err := rows.Scan(
			&post.ID, &post.Title, &post.Content, &post.Slug, &post.Status, &post.ViewCount, &post.CreatedAt, &post.UpdatedAt,
			&author.ID, &author.Username, &author.Email,
			&category.ID, &category.Name, &category.Description,
		)
		if err != nil {
			continue
		}

		post.Author = author
		post.Category = category
		posts = append(posts, post)
	}

	return c.JSON(http.StatusOK, posts)
}

// GetPost 获取单篇文章
// @Summary 根据slug获取文章详情
// @Description 根据slug获取已发布的文章详情
// @Tags 文章
// @Accept json
// @Produce json
// @Param slug path string true "文章slug"
// @Success 200 {object} models.Post "文章详情"
// @Failure 404 {object} map[string]string "文章未找到"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /posts/{slug} [get]
func (h *Handler) GetPost(c echo.Context) error {
	slug := c.Param("slug")

	query := `
		SELECT p.id, p.title, p.content, p.slug, p.status, p.view_count, p.created_at, p.updated_at,
			   u.id as author_id, u.username as author_username, u.email as author_email,
			   c.id as category_id, c.name as category_name, c.description as category_description
		FROM posts p
		JOIN users u ON p.author_id = u.id
		LEFT JOIN categories c ON p.category_id = c.id
		WHERE p.slug = $1 AND p.status = 'published'`

	var post models.Post
	var author models.User
	var category models.Category

	err := h.db.QueryRow(query, slug).Scan(
		&post.ID, &post.Title, &post.Content, &post.Slug, &post.Status, &post.ViewCount, &post.CreatedAt, &post.UpdatedAt,
		&author.ID, &author.Username, &author.Email,
		&category.ID, &category.Name, &category.Description,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusNotFound, map[string]string{"error": "Post not found"})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch post"})
	}

	post.Author = author
	post.Category = category

	// 获取标签
	tagQuery := `SELECT t.id, t.name FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = $1`
	tagRows, err := h.db.Query(tagQuery, post.ID)
	if err == nil {
		defer tagRows.Close()
		for tagRows.Next() {
			var tag models.Tag
			if err := tagRows.Scan(&tag.ID, &tag.Name); err == nil {
				post.Tags = append(post.Tags, tag)
			}
		}
	}

	// 增加浏览量
	h.db.Exec("UPDATE posts SET view_count = view_count + 1 WHERE id = $1", post.ID)

	return c.JSON(http.StatusOK, post)
}

func (h *Handler) GetCategories(c echo.Context) error {
	rows, err := h.db.Query("SELECT id, name, description, created_at FROM categories ORDER BY name")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch categories"})
	}
	defer rows.Close()

	var categories []models.Category
	for rows.Next() {
		var category models.Category
		if err := rows.Scan(&category.ID, &category.Name, &category.Description, &category.CreatedAt); err == nil {
			categories = append(categories, category)
		}
	}

	return c.JSON(http.StatusOK, categories)
}

func (h *Handler) GetTags(c echo.Context) error {
	rows, err := h.db.Query("SELECT id, name, created_at FROM tags ORDER BY name")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch tags"})
	}
	defer rows.Close()

	var tags []models.Tag
	for rows.Next() {
		var tag models.Tag
		if err := rows.Scan(&tag.ID, &tag.Name, &tag.CreatedAt); err == nil {
			tags = append(tags, tag)
		}
	}

	return c.JSON(http.StatusOK, tags)
}

func (h *Handler) CreateComment(c echo.Context) error {
	var req models.CreateCommentRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	query := `INSERT INTO comments (post_id, author_name, author_email, content) VALUES ($1, $2, $3, $4)`
	_, err := h.db.Exec(query, req.PostID, req.AuthorName, req.AuthorEmail, req.Content)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create comment"})
	}

	return c.JSON(http.StatusCreated, map[string]string{"message": "Comment created successfully"})
}

// Login 用户登录
// @Summary 用户登录
// @Description 用户使用用户名和密码登录
// @Tags 认证
// @Accept json
// @Produce json
// @Param login body models.LoginRequest true "登录信息"
// @Success 200 {object} map[string]interface{} "登录成功"
// @Failure 400 {object} map[string]string "请求错误"
// @Failure 401 {object} map[string]string "认证失败"
// @Router /auth/login [post]
func (h *Handler) Login(c echo.Context) error {
	var req models.LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	var user models.User
	var passwordHash string
	err := h.db.QueryRow("SELECT id, username, email, password_hash FROM users WHERE username = $1", req.Username).
		Scan(&user.ID, &user.Username, &user.Email, &passwordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid credentials"})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Database error"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid credentials"})
	}

	// TODO: 生成JWT token
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Login successful",
		"user":    user,
	})
}

func (h *Handler) Register(c echo.Context) error {
	var req models.RegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	// 检查用户名是否已存在
	var count int
	h.db.QueryRow("SELECT COUNT(*) FROM users WHERE username = $1 OR email = $2", req.Username, req.Email).Scan(&count)
	if count > 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Username or email already exists"})
	}

	// 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to hash password"})
	}

	query := `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, created_at`
	var user models.User
	err = h.db.QueryRow(query, req.Username, req.Email, string(hashedPassword)).
		Scan(&user.ID, &user.CreatedAt)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create user"})
	}

	user.Username = req.Username
	user.Email = req.Email

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "User created successfully",
		"user":    user,
	})
}

// 管理API - 文章管理
func (h *Handler) AdminGetPosts(c echo.Context) error {
	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page < 1 {
		page = 1
	}
	limit := 10
	offset := (page - 1) * limit

	query := `
		SELECT p.id, p.title, p.slug, p.status, p.view_count, p.created_at, p.updated_at,
			   u.id as author_id, u.username as author_username,
			   c.id as category_id, c.name as category_name
		FROM posts p
		JOIN users u ON p.author_id = u.id
		LEFT JOIN categories c ON p.category_id = c.id
		ORDER BY p.created_at DESC
		LIMIT $1 OFFSET $2`

	rows, err := h.db.Query(query, limit, offset)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch posts"})
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var post models.Post
		var author models.User
		var category models.Category

		err := rows.Scan(
			&post.ID, &post.Title, &post.Slug, &post.Status, &post.ViewCount, &post.CreatedAt, &post.UpdatedAt,
			&author.ID, &author.Username,
			&category.ID, &category.Name,
		)
		if err != nil {
			continue
		}

		post.Author = author
		post.Category = category
		posts = append(posts, post)
	}

	return c.JSON(http.StatusOK, posts)
}

func (h *Handler) CreatePost(c echo.Context) error {
	var req models.CreatePostRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	// 生成slug
	slug := generateSlug(req.Title)

	query := `INSERT INTO posts (title, content, slug, author_id, category_id, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`
	var post models.Post
	err := h.db.QueryRow(query, req.Title, req.Content, slug, 1, req.CategoryID, req.Status).
		Scan(&post.ID, &post.CreatedAt)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create post"})
	}

	// 添加标签关联
	if len(req.TagIDs) > 0 {
		for _, tagID := range req.TagIDs {
			h.db.Exec("INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)", post.ID, tagID)
		}
	}

	post.Title = req.Title
	post.Content = req.Content
	post.Slug = slug
	post.Status = req.Status

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "Post created successfully",
		"post":    post,
	})
}

func (h *Handler) AdminGetPost(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid post ID"})
	}

	query := `
		SELECT p.id, p.title, p.content, p.slug, p.status, p.view_count, p.created_at, p.updated_at,
			   u.id as author_id, u.username as author_username, u.email as author_email,
			   c.id as category_id, c.name as category_name, c.description as category_description
		FROM posts p
		JOIN users u ON p.author_id = u.id
		LEFT JOIN categories c ON p.category_id = c.id
		WHERE p.id = $1`

	var post models.Post
	var author models.User
	var category models.Category

	err = h.db.QueryRow(query, id).Scan(
		&post.ID, &post.Title, &post.Content, &post.Slug, &post.Status, &post.ViewCount, &post.CreatedAt, &post.UpdatedAt,
		&author.ID, &author.Username, &author.Email,
		&category.ID, &category.Name, &category.Description,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusNotFound, map[string]string{"error": "Post not found"})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch post"})
	}

	post.Author = author
	post.Category = category

	// 获取标签
	tagQuery := `SELECT t.id, t.name FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = $1`
	tagRows, err := h.db.Query(tagQuery, post.ID)
	if err == nil {
		defer tagRows.Close()
		for tagRows.Next() {
			var tag models.Tag
			if err := tagRows.Scan(&tag.ID, &tag.Name); err == nil {
				post.Tags = append(post.Tags, tag)
			}
		}
	}

	return c.JSON(http.StatusOK, post)
}

func (h *Handler) UpdatePost(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid post ID"})
	}

	var req models.UpdatePostRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	query := `UPDATE posts SET title = $1, content = $2, category_id = $3, status = $4, updated_at = $5 WHERE id = $6`
	_, err = h.db.Exec(query, req.Title, req.Content, req.CategoryID, req.Status, time.Now(), id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update post"})
	}

	// 更新标签关联
	if req.TagIDs != nil {
		h.db.Exec("DELETE FROM post_tags WHERE post_id = $1", id)
		for _, tagID := range req.TagIDs {
			h.db.Exec("INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)", id, tagID)
		}
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Post updated successfully"})
}

func (h *Handler) DeletePost(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid post ID"})
	}

	_, err = h.db.Exec("DELETE FROM posts WHERE id = $1", id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete post"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Post deleted successfully"})
}

// 辅助函数
func generateSlug(title string) string {
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	slug = strings.ReplaceAll(slug, ".", "")
	slug = strings.ReplaceAll(slug, ",", "")
	slug = strings.ReplaceAll(slug, "!", "")
	slug = strings.ReplaceAll(slug, "?", "")
	slug = strings.ReplaceAll(slug, "'", "")
	slug = strings.ReplaceAll(slug, "\"", "")
	return slug
}