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

    @Query("SELECT DISTINCT m.chatRoomId FROM Message m WHERE m.sender = :email OR m.receiver = :email")
    List<String> findChatRoomsByUser(@Param("email") String email);
    boolean existsByChatRoomId(String chatRoomId);

}
