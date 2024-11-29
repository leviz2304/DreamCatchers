package com.example.demo.repository.data;

import com.example.demo.entity.data.WritingTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WritingTaskRepository extends JpaRepository<WritingTask,Integer> {
}
