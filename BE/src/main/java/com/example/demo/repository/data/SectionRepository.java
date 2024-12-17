package com.example.demo.repository.data;

import com.example.demo.entity.data.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<Section, Integer> { // Thay từ Long thành Integer
}