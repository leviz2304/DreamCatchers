package com.example.demo.controller.PrivateController;

import com.example.demo.entity.data.Enrollment;
import com.example.demo.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/private/courses")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;
    @GetMapping("/{courseId}/enrollment-status")

    public ResponseEntity<Map<String, Boolean>> checkEnrollment(
            @PathVariable Integer courseId,
            @RequestParam Integer userId) {
        boolean enrolled = enrollmentService.isUserEnrolledInCourse(userId, courseId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("enrolled", enrolled);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{courseId}/enroll/{userId}")
    public ResponseEntity<?> enrollCourse(@PathVariable Integer courseId, @PathVariable Integer userId) {
        Enrollment enrollment = enrollmentService.enrollUserToCourse(userId, courseId);
        return ResponseEntity.ok("Enrolled successfully!");
    }
}