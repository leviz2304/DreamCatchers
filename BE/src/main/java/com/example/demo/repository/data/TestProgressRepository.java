package com.example.demo.repository.data;

import com.example.demo.entity.data.TestProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestProgressRepository  extends JpaRepository<TestProgress, Integer> {
}
