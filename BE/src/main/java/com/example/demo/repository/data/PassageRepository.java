package com.example.demo.repository.data;

import com.example.demo.entity.data.Passage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassageRepository extends JpaRepository<Passage, Integer> {
    // Additional query methods if needed
    List<Passage> findByTest_Id(int testId);

}
