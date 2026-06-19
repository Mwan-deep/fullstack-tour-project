package com.example.backend.service;

import com.example.backend.entity.Tour;
import com.example.backend.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourService {

    private final TourRepository tourRepository;

    @Autowired // Spring tự động tiêm (inject) Repository vào Service
    public TourService(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    public Tour createTour(Tour tour) {
        // Thực tế ở đây có thể check logic: Tên tour đã tồn tại chưa? Giá có hợp lệ không?
        return tourRepository.save(tour);
    }
}