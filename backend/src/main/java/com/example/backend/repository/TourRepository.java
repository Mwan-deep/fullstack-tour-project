package com.example.backend.repository;

import com.example.backend.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    // Để trống. JpaRepository đã cung cấp sẵn save(), findAll(), findById(), deleteById()
}