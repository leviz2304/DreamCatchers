package com.example.demo.repository.data;

import com.example.demo.entity.data.ListeningSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListeningSectionRepository extends JpaRepository<ListeningSection, Integer> {
    // Additional query methods if needed
    List<ListeningSection> findByTest_Id(int testId);


}
