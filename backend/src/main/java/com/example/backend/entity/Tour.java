package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tour")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự động tăng ID
    private Long id;

    @Column(nullable = false) // Không được để trống
    private String name;

    private String destination;

    private Double price;

    private String imageUrl;

    // Constructors
    // Constructors
    public Tour() {
    }

    public Tour(String name, String destination, Double price, String imageUrl) {
        this.name = name;
        this.destination = destination;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters (Bắt buộc phải có để Spring và JPA đọc/ghi dữ liệu)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    // THÊM GETTER/SETTER CHO imageUrl:
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}