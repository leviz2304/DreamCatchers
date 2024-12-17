//package com.example.demo.controller.PrivateController;
//
//import com.example.demo.dto.LessonDTO;
//import com.example.demo.dto.ResponseObject;
//import com.example.demo.service.LessonService;
//import com.example.demo.service.SectionService;
//import com.example.demo.service.VideoStorageService;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/lessons")
//public class LessonController {
//
//    @Autowired
//    private LessonService lessonService;
//
//    @Autowired
//    private SectionService sectionService;
//
//    @Autowired
//    private VideoStorageService videoStorageService;
//
//    // Tạo mới Lesson với Video Upload
//    @PostMapping("/upload")
//    public ResponseEntity<ResponseObject> createLesson(
//            @RequestParam String name,
//            @RequestParam Integer sectionId, // ID của Section
//            @RequestParam MultipartFile videoFile) {
//        try {
//            // Upload video lên Google Cloud Storage
//            String videoUrl = videoStorageService.uploadVideo(
//                    videoFile.getBytes(),
//                    videoFile.getOriginalFilename(),
//                    videoFile.getContentType()
//            );
//
//            // Tạo Lesson mới
//            LessonDTO lessonDTO = LessonDTO.builder()
//                    .name(name)
//                    .videoUrl(videoUrl)
//                    .sectionId(sectionId)
//                    .build();
//
//            LessonDTO savedLesson = lessonService.saveLesson(lessonDTO);
//            return ResponseEntity.status(HttpStatus.CREATED)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.CREATED)
//                            .mess("Lesson created successfully")
//                            .content(savedLesson)
//                            .build());
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.NOT_FOUND)
//                            .mess(e.getMessage())
//                            .content(null)
//                            .build());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.BAD_REQUEST)
//                            .mess("Error creating lesson: " + e.getMessage())
//                            .content(null)
//                            .build());
//        }
//    }
//
//    // Lấy tất cả các Lesson
//    @GetMapping
//    public ResponseEntity<ResponseObject> getAllLessons() {
//        List<LessonDTO> lessons = lessonService.getAllLessons();
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ResponseObject.builder()
//                        .status(HttpStatus.OK)
//                        .mess("Fetched all lessons successfully")
//                        .content(lessons)
//                        .build());
//    }
//
//    // Lấy Lesson theo ID
//    @GetMapping("/{id}")
//    public ResponseEntity<ResponseObject> getLessonById(@PathVariable Integer id) {
//        Optional<LessonDTO> lessonOpt = lessonService.getLessonById(id);
//        if (lessonOpt.isPresent()) {
//            return ResponseEntity.status(HttpStatus.OK)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.OK)
//                            .mess("Fetched lesson successfully")
//                            .content(lessonOpt.get())
//                            .build());
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.NOT_FOUND)
//                            .mess("Lesson not found with id: " + id)
//                            .content(null)
//                            .build());
//        }
//    }
//
//    // Cập nhật Lesson
//    @PutMapping("/{id}")
//    public ResponseEntity<ResponseObject> updateLesson(
//            @PathVariable Integer id,
//            @Valid @RequestBody LessonDTO lessonDTO) {
//        try {
//            LessonDTO updatedLesson = lessonService.updateLesson(id, lessonDTO);
//            return ResponseEntity.status(HttpStatus.OK)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.OK)
//                            .mess("Lesson updated successfully")
//                            .content(updatedLesson)
//                            .build());
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.NOT_FOUND)
//                            .mess(e.getMessage())
//                            .content(null)
//                            .build());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.BAD_REQUEST)
//                            .mess("Error updating lesson: " + e.getMessage())
//                            .content(null)
//                            .build());
//        }
//    }
//
//    // Xóa Lesson
//    @DeleteMapping("/{id}")
//    public ResponseEntity<ResponseObject> deleteLesson(@PathVariable Integer id) {
//        try {
//            lessonService.deleteLesson(id);
//            return ResponseEntity.status(HttpStatus.NO_CONTENT)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.NO_CONTENT)
//                            .mess("Lesson deleted successfully")
//                            .content(null)
//                            .build());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.BAD_REQUEST)
//                            .mess("Error deleting lesson: " + e.getMessage())
//                            .content(null)
//                            .build());
//        }
//    }
//}
