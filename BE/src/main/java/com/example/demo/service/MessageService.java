package com.example.demo.service;

import com.example.demo.dto.UserDTO;
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
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

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

    public List<UserDTO> getStudentsForInstructor(Integer instructorId) {
        // Verify that the instructor exists
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        // Fetch students via Progress
        List<User> students = messageRepository.findStudentsByInstructorId(instructorId);

        return students.stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }
    private UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatar(user.getAvatar())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .build();
    }
    private String generateChatRoomId(Integer userId1, Integer userId2) {
        List<Integer> ids = Arrays.asList(userId1, userId2);
        Collections.sort(ids);
        return ids.get(0) + "_" + ids.get(1);
    }
    public List<Message> getMessagesBetweenUsers(Integer userId1, Integer userId2) {
        return messageRepository.findMessagesBetweenUsers(userId1, userId2);
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
