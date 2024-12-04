package com.example.demo.repository.data;

import com.example.demo.entity.data.SpeakingTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpeakingTopicRepository extends JpaRepository<SpeakingTopic, Integer> {
    boolean existsByName(String name);
}
