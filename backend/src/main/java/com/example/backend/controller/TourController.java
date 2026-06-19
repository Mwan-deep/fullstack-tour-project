package com.example.backend.controller;

import com.example.backend.entity.Tour;
import com.example.backend.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    private final TourService tourService;

    @Autowired
    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    // API lấy danh sách Tour (Method: GET)
    @GetMapping
    public List<Tour> getAllTours() {
        return tourService.getAllTours();
    }

    // API tạo Tour mới (Method: POST)
    @PostMapping
    public Tour createTour(@RequestBody Tour tour) {
        // @RequestBody sẽ tự động chuyển đổi dữ liệu JSON từ Frontend thành Object Tour
        return tourService.createTour(tour);
    }
}