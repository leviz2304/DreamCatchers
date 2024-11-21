package com.example.demo.service;

import com.example.demo.entity.data.Message;
import com.example.demo.entity.user.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public Message sendMessage(Integer senderId, Integer receiverId, String content) {
        // Validate content
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be null or empty");
        }

        // Fetch sender and receiver
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found with ID: " + senderId));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found with ID: " + receiverId));

        // Create and save the message
        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();

        return messageRepository.save(message);
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
