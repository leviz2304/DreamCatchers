package com.example.demo.controller.PrivateController;

import com.example.demo.auth.AuthService;
import com.example.demo.dto.CourseDTO;
import com.example.demo.dto.EnrollDTO;
import com.example.demo.dto.ResponseObject;
import com.example.demo.exception.CourseNotFoundException;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@RestController
@RequestMapping("/api/v1/private/course")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;
    private final AuthService authService;
    @GetMapping("")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ResponseObject> getCourseByCourseTitle(@RequestParam("title") String title,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "5") int size
            , @RequestParam(defaultValue = "false") boolean isDeleted) {
        var result = courseService.getAllCourseByCourseTitle(title, isDeleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ResponseObject> create(@RequestPart CourseDTO course
          ) {
        System.out.println(course);
        var result = courseService.addCourse(course);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
    @PostMapping("/enroll")
    public ResponseEntity<ResponseObject> enrollCourse(@RequestBody EnrollDTO enrollDTO) {
        ResponseObject response = authService.enrollCourse(enrollDTO);
        return new ResponseEntity<>(response, response.getStatus());
    }


    @GetMapping("/{courseId}/is-enrolled")
    public ResponseEntity<Boolean> checkEnrollment(
            @PathVariable int courseId,
            @RequestParam int userId) {

        boolean isEnrolled = courseService.isUserEnrolled(courseId, userId);
        return ResponseEntity.ok(isEnrolled);
    }


    @PutMapping("/edit/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ResponseObject> updateCourse(@PathVariable int id
            , @RequestPart CourseDTO course
          )  {

        var result = courseService.updateCourse(id, course);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/restore/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseObject> restoreCourse(@PathVariable int id) {
        var result = courseService.restoreCourseById(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
    @PutMapping("/delete/soft/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseObject> softDelete(@PathVariable int id) {
        var result = courseService.softDelete(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
    @DeleteMapping("/delete/hard/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseObject> hardDelete(@PathVariable int id) {
        var result = courseService.hardDelete(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/deleted/category")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ResponseObject> getCourseDeletedByCategoryId(@RequestParam("id") int id, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = courseService.getAllCourseDeletedByCategoryId(id, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/getAllDeleted")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseObject> getAllDeleted(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "5") int size) {
        var result = courseService.getAllCourseDeleted(page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "5") int size) {
        var result = courseService.getAllCourse(page, size);
        System.out.println("Result"+result);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

}
