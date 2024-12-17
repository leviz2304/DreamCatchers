// src/main/java/com/example/demo/repository/ChatMessageRepository.java
package com.example.demo.repository.data;

import com.example.demo.entity.data.ChatMessage;
import com.example.demo.entity.user.User;
import com.example.demo.entity.data.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
    List<ChatMessage> findByCourseAndSenderAndReceiverOrderByTimestampAsc(Course course, User sender, User receiver);
}
