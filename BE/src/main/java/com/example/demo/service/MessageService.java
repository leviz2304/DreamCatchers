package com.example.demo.service;

import com.example.demo.dto.MessagePayload;
import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Message;
import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.User;
import com.example.demo.repository.data.MessageRepository;
import com.example.demo.repository.data.CourseRepository;
import com.example.demo.repository.data.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public Message saveMessage(MessagePayload payload, Integer senderId) {
        User sender = userService.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userService.findById(payload.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        Course course = courseRepository.findById(payload.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Kiểm tra logic gửi tin:
        // Nếu sender là USER → phải đã enroll vào khóa học
        if (sender.getRole() == Role.USER) {
            boolean enrolled = enrollmentRepository.existsByUserAndCourse(sender, course);
            if (!enrolled) {
                throw new RuntimeException("User is not enrolled in this course");
            }
        } else if (sender.getRole() == Role.INSTRUCTOR) {
            // sender là tutor → phải là tutor của khóa học này
            if (!course.getTutor().getId().equals(sender.getId())) {
                throw new RuntimeException("Instructor is not the owner of this course");
            }
        } else {
            // Nếu không phải USER hay INSTRUCTOR, không cho phép
            throw new RuntimeException("Invalid sender role");
        }

        // Tùy chọn: Kiểm tra receiver logic (nếu cần)
        // Ví dụ:
        // Nếu receiver là USER → phải enroll
        if (receiver.getRole() == Role.USER) {
            boolean enrolledReceiver = enrollmentRepository.existsByUserAndCourse(receiver, course);
            if (!enrolledReceiver) {
                throw new RuntimeException("The receiver (user) is not enrolled in this course");
            }
        } else if (receiver.getRole() == Role.INSTRUCTOR) {
            // receiver là tutor → phải là tutor course
            if (!course.getTutor().getId().equals(receiver.getId())) {
                throw new RuntimeException("The receiver (instructor) is not the owner of this course");
            }
        } else {
            // Trường hợp receiver có role khác
            throw new RuntimeException("Invalid receiver role");
        }

        Message msg = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .course(course)
                .content(payload.getContent())
                .build();

        return messageRepository.save(msg);
    }

    public List<Message> getConversation(Integer courseId, Integer userId1, Integer userId2) {
        User u1 = userService.findById(userId1)
                .orElseThrow(() -> new RuntimeException("User1 not found"));
        User u2 = userService.findById(userId2)
                .orElseThrow(() -> new RuntimeException("User2 not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return messageRepository.findConversation(course, u1, u2);
    }
}
