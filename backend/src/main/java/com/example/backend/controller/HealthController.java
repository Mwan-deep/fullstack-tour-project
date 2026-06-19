package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    // Annotation @GetMapping báo cho Spring biết hàm này sẽ xử lý request HTTP GET
    @GetMapping("/health")
    public String checkHealth() {
        return "Backend is running successfully!";
    }
}