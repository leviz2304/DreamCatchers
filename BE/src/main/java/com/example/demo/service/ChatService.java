package com.example.demo.service;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.data.Message;
import com.example.demo.entity.data.Progress;
import com.example.demo.entity.user.User;
import com.example.demo.entity.data.Course;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.CourseRepository;
import com.example.demo.repository.data.MessageRepository;
import com.example.demo.repository.data.ProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;
    /**
     * Retrieve a list of instructors for courses the user has joined.
     *
     * @param userEmail the email of the user
     * @return a list of distinct instructors
     */
    public List<User> getInstructorsForUserCourses(String userEmail) {
        return courseRepository.findCoursesByStudentEmail(userEmail).stream()
                .map(Course::getInstructor)
                .distinct()
                .toList();
    }

    public List<UserDTO> getInstructorsForUserCourses(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Fetch all progress records for the user
        List<Progress> progresses = progressRepository.findByUser(user);

        // Extract courses from progress records
        List<Course> courses = progresses.stream()
                .map(Progress::getCourse)
                .collect(Collectors.toList());

        // Extract instructors from courses
        List<User> instructors = courses.stream()
                .map(Course::getInstructor)
                .distinct()
                .collect(Collectors.toList());

        // Convert instructors to UserDTO
        List<UserDTO> instructorDTOs = instructors.stream()
                .map(this::getUserDTOFromUser)
                .collect(Collectors.toList());

        return instructorDTOs;
    }
    public UserDTO getUserDTOFromUser(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .avatar(user.getAvatar())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .build();
    }
    public String createOrGetChatRoom(String userEmail, String instructorEmail) {
        // Retrieve User entities based on email
        User sender = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        User receiver = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + instructorEmail));

        // Generate a unique chat room ID
        String chatRoomId = generateChatRoomId(userEmail, instructorEmail);

        // Check if the chat room already exists
        boolean chatExists = messageRepository.existsByChatRoomId(chatRoomId);
        if (!chatExists) {
            // Create an initial message to initialize the chat room
            Message initialMessage = Message.builder()
                    .sender(sender) // Use User entity
                    .receiver(receiver) // Use User entity
                    .content("Chat started.")
                    .timestamp(LocalDateTime.now())
                    .chatRoomId(chatRoomId)
                    .build();
            messageRepository.save(initialMessage);
        }

        return chatRoomId;
    }

    /**
     * Generate a consistent chat room ID based on user and instructor emails.
     *
     * @param userEmail       the email of the user
     * @param instructorEmail the email of the instructor
     * @return a unique chat room ID
     */
    private String generateChatRoomId(String userEmail, String instructorEmail) {
        return userEmail.compareTo(instructorEmail) < 0
                ? userEmail + "_" + instructorEmail
                : instructorEmail + "_" + userEmail;
    }

    /**
     * Initialize a chat room with a placeholder message.
     *
     * @param chatRoomId      the ID of the chat room
     * @param userEmail       the email of the user
     * @param instructorEmail the email of the instructor
     */
    private void initializeChatRoom(String chatRoomId, String userEmail, String instructorEmail) {
        Message initialMessage = Message.builder()
                .sender(userRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail)))
                .receiver(userRepository.findByEmail(instructorEmail)
                        .orElseThrow(() -> new IllegalArgumentException("Instructor not found: " + instructorEmail)))
                .content("Chat started.")
                .timestamp(LocalDateTime.now())
                .chatRoomId(chatRoomId)
                .isRead(false)
                .build();

        messageRepository.save(initialMessage);
    }

    /**
     * Validate the email addresses of the user and instructor.
     *
     * @param userEmail       the email of the user
     * @param instructorEmail the email of the instructor
     */
    private void validateEmails(String userEmail, String instructorEmail) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("User email cannot be null or empty.");
        }
        if (instructorEmail == null || instructorEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Instructor email cannot be null or empty.");
        }
    }
}
