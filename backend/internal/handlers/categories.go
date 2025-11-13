package handlers

import (
	"blog-backend/internal/models"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// 分类管理
func (h *Handler) AdminGetCategories(c echo.Context) error {
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

func (h *Handler) CreateCategory(c echo.Context) error {
	var req models.CreateCategoryRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	query := `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, created_at`
	var category models.Category
	err := h.db.QueryRow(query, req.Name, req.Description).Scan(&category.ID, &category.CreatedAt)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create category"})
	}

	category.Name = req.Name
	category.Description = req.Description

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message":  "Category created successfully",
		"category": category,
	})
}

func (h *Handler) UpdateCategory(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid category ID"})
	}

	var req models.CreateCategoryRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	query := `UPDATE categories SET name = $1, description = $2 WHERE id = $3`
	_, err = h.db.Exec(query, req.Name, req.Description, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update category"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Category updated successfully"})
}

func (h *Handler) DeleteCategory(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid category ID"})
	}

	_, err = h.db.Exec("DELETE FROM categories WHERE id = $1", id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete category"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Category deleted successfully"})
}

// 标签管理
func (h *Handler) AdminGetTags(c echo.Context) error {
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

func (h *Handler) CreateTag(c echo.Context) error {
	var req models.CreateTagRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	query := `INSERT INTO tags (name) VALUES ($1) RETURNING id, created_at`
	var tag models.Tag
	err := h.db.QueryRow(query, req.Name).Scan(&tag.ID, &tag.CreatedAt)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create tag"})
	}

	tag.Name = req.Name

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "Tag created successfully",
		"tag":     tag,
	})
}

func (h *Handler) UpdateTag(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid tag ID"})
	}

	var req models.CreateTagRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	query := `UPDATE tags SET name = $1 WHERE id = $2`
	_, err = h.db.Exec(query, req.Name, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update tag"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Tag updated successfully"})
}

func (h *Handler) DeleteTag(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid tag ID"})
	}

	_, err = h.db.Exec("DELETE FROM tags WHERE id = $1", id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete tag"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Tag deleted successfully"})
}