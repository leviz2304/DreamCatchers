package com.example.demo.repository.data;

import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Message;
import com.example.demo.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    // Lấy tất cả tin nhắn giữa user1 và user2 trong 1 khóa học, sắp xếp theo thời gian
    @Query("SELECT m FROM Message m WHERE m.course = :course " +
            "AND ((m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1)) " +
            "ORDER BY m.timestamp ASC")
    List<Message> findConversation(@Param("course") Course course,
                                   @Param("user1") User user1,
                                   @Param("user2") User user2);
}
