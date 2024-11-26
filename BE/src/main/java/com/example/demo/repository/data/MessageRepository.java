package com.example.demo.repository.data;

import com.example.demo.entity.data.Message;
import com.example.demo.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiverOrderByTimestampAsc(User sender, User receiver);

    List<Message> findByReceiverAndIsReadFalseOrderByTimestampAsc(User receiver);
    List<Message> findByChatRoomId(String chatRoomId);
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId1 AND m.receiver.id = :userId2) OR (m.sender.id = :userId2 AND m.receiver.id = :userId1) ORDER BY m.timestamp ASC")
    List<Message> findMessagesBetweenUsers(@Param("userId1") Integer userId1, @Param("userId2") Integer userId2);
    @Query("SELECT DISTINCT m.chatRoomId FROM Message m WHERE m.sender = :email OR m.receiver = :email")
    List<String> findChatRoomsByUser(@Param("email") String email);
    boolean existsByChatRoomId(String chatRoomId);
    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.receiver.id = :instructorId")
    List<User> findDistinctStudentsByInstructorId(@Param("instructorId") Integer instructorId);
    @Query("SELECT DISTINCT p.user FROM Progress p WHERE p.course.instructor.id = :instructorId")
    List<User> findStudentsByInstructorId(@Param("instructorId") Integer instructorId);

}
