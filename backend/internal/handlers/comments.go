package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// 评论管理
func (h *Handler) AdminGetComments(c echo.Context) error {
	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page < 1 {
		page = 1
	}
	limit := 20
	offset := (page - 1) * limit

	query := `
		SELECT c.id, c.post_id, c.author_name, c.author_email, c.content, c.status, c.created_at,
			   p.title as post_title, p.slug as post_slug
		FROM comments c
		JOIN posts p ON c.post_id = p.id
		ORDER BY c.created_at DESC
		LIMIT $1 OFFSET $2`

	rows, err := h.db.Query(query, limit, offset)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch comments"})
	}
	defer rows.Close()

	var comments []map[string]interface{}
	for rows.Next() {
		var commentID, postID int
		var authorName, authorEmail, content, status, postTitle, postSlug string
		var createdAt interface{}

		err := rows.Scan(&commentID, &postID, &authorName, &authorEmail, &content, &status, &createdAt, &postTitle, &postSlug)
		if err != nil {
			continue
		}

		comment := map[string]interface{}{
			"id":           commentID,
			"post_id":      postID,
			"post_title":   postTitle,
			"post_slug":    postSlug,
			"author_name":  authorName,
			"author_email": authorEmail,
			"content":      content,
			"status":       status,
			"created_at":   createdAt,
		}
		comments = append(comments, comment)
	}

	return c.JSON(http.StatusOK, comments)
}

func (h *Handler) UpdateCommentStatus(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid comment ID"})
	}

	type StatusUpdate struct {
		Status string `json:"status" validate:"required,oneof=pending approved rejected"`
	}

	var req StatusUpdate
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	query := `UPDATE comments SET status = $1 WHERE id = $2`
	_, err = h.db.Exec(query, req.Status, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update comment status"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Comment status updated successfully"})
}

func (h *Handler) DeleteComment(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid comment ID"})
	}

	_, err = h.db.Exec("DELETE FROM comments WHERE id = $1", id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete comment"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Comment deleted successfully"})
}