package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users") // Đổi tên bảng thành users vì 'user' thường là từ khóa bị cấm trong SQL
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true) // Username không được trùng nhau
    private String username;

    @Column(nullable = false)
    private String password;

    private String role; // Ví dụ: ROLE_USER, ROLE_ADMIN

    public User() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}