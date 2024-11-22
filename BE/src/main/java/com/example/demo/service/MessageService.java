package com.example.demo.service;

import com.example.demo.entity.data.Message;
import com.example.demo.entity.user.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public void sendMessage(Integer senderId, Integer receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        String chatRoomId = generateChatRoomId(senderId, receiverId);

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .chatRoomId(chatRoomId)
                .build();

        messageRepository.save(message);
    }

    private String generateChatRoomId(Integer userId1, Integer userId2) {
        List<Integer> ids = Arrays.asList(userId1, userId2);
        Collections.sort(ids);
        return ids.get(0) + "_" + ids.get(1);
    }
    public List<Message> getMessagesBetweenUsers(Integer senderId, Integer receiverId) {
        // Validate sender and receiver existence
        userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found with ID: " + senderId));
        userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found with ID: " + receiverId));

        // Fetch messages
        return messageRepository.findBySenderAndReceiverOrderByTimestampAsc(
                userRepository.getById(senderId),
                userRepository.getById(receiverId)
        );
    }

    public List<Message> getUnreadMessages(Integer receiverId) {
        // Validate receiver existence
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found with ID: " + receiverId));

        // Fetch unread messages
        return messageRepository.findByReceiverAndIsReadFalseOrderByTimestampAsc(receiver);
    }

    public void markMessagesAsRead(Integer receiverId, Integer senderId) {
        // Validate sender and receiver existence
        userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found with ID: " + senderId));
        userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found with ID: " + receiverId));

        // Update messages to mark as read
        List<Message> messages = messageRepository.findBySenderAndReceiverOrderByTimestampAsc(
                userRepository.getById(senderId),
                userRepository.getById(receiverId)
        );

        messages.forEach(message -> message.setRead(true));
        messageRepository.saveAll(messages); // Batch update for efficiency
    }
}
