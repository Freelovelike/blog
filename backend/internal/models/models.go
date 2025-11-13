package models

import (
	"time"
)

type User struct {
	ID           int       `json:"id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Category struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

type Tag struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

type Post struct {
	ID         int       `json:"id"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	Slug       string    `json:"slug"`
	AuthorID   int       `json:"author_id"`
	CategoryID int       `json:"category_id"`
	Status     string    `json:"status"`
	ViewCount  int       `json:"view_count"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	
	// 关联数据
	Author   User     `json:"author,omitempty"`
	Category Category `json:"category,omitempty"`
	Tags     []Tag    `json:"tags,omitempty"`
}

type Comment struct {
	ID         int       `json:"id"`
	PostID     int       `json:"post_id"`
	AuthorName string    `json:"author_name"`
	AuthorEmail string   `json:"author_email"`
	Content    string    `json:"content"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type RegisterRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type CreatePostRequest struct {
	Title      string `json:"title" validate:"required"`
	Content    string `json:"content" validate:"required"`
	CategoryID int    `json:"category_id"`
	TagIDs     []int  `json:"tag_ids"`
	Status     string `json:"status" validate:"oneof=draft published"`
}

type UpdatePostRequest struct {
	Title      string `json:"title"`
	Content    string `json:"content"`
	CategoryID int    `json:"category_id"`
	TagIDs     []int  `json:"tag_ids"`
	Status     string `json:"status" validate:"oneof=draft published"`
}

type CreateCategoryRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
}

type CreateTagRequest struct {
	Name string `json:"name" validate:"required"`
}

type CreateCommentRequest struct {
	PostID      int    `json:"post_id" validate:"required"`
	AuthorName  string `json:"author_name" validate:"required"`
	AuthorEmail string `json:"author_email" validate:"required,email"`
	Content     string `json:"content" validate:"required"`
}