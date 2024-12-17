package com.example.demo.repository.data;

import com.example.demo.entity.data.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic, Integer> {}
