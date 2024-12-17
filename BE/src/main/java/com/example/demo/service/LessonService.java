//package com.example.demo.service;
//
//import com.example.demo.dto.LessonDTO;
//import com.example.demo.entity.data.Lesson;
//import com.example.demo.mapper.LessonMapper;
//import com.example.demo.repository.data.LessonRepository;
//import com.example.demo.repository.data.SectionRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class LessonService {
//
//    @Autowired
//    private LessonRepository lessonRepository;
//
//    @Autowired
//    private SectionRepository sectionRepository;
//
//    @Autowired
//    private LessonMapper lessonMapper;
//
//    // Tạo mới hoặc cập nhật Lesson
//    public LessonDTO saveLesson(LessonDTO lessonDTO) {
//        Lesson lesson = lessonMapper.toEntity(lessonDTO);
//
//        // Liên kết với Section
//        if (lessonDTO.getSectionId() != null) {
//            lesson.setSection(sectionRepository.findById(lessonDTO.getSectionId())
//                    .orElseThrow(() -> new RuntimeException("Section not found with id: " + lessonDTO.getSectionId())));
//        }
//
//        Lesson savedLesson = lessonRepository.save(lesson);
//        return lessonMapper.toDTO(savedLesson);
//    }
//
//    // Lấy tất cả các Lesson
//    public List<LessonDTO> getAllLessons() {
//        return lessonRepository.findAll().stream()
//                .map(lessonMapper::toDTO)
//                .collect(Collectors.toList());
//    }
//
//    // Lấy Lesson theo ID
//    public Optional<LessonDTO> getLessonById(Integer id) {
//        return lessonRepository.findById(id)
//                .map(lessonMapper::toDTO);
//    }
//
//    // Xóa Lesson
//    public void deleteLesson(Integer id) {
//        lessonRepository.deleteById(id);
//    }
//
//    // Cập nhật Lesson
//    public LessonDTO updateLesson(Integer id, LessonDTO lessonDTO) {
//        Optional<Lesson> optionalLesson = lessonRepository.findById(id);
//        if (!optionalLesson.isPresent()) {
//            throw new RuntimeException("Lesson not found with id: " + id);
//        }
//        Lesson lesson = optionalLesson.get();
//
//        // Cập nhật thông tin cơ bản
//        lesson.setName(lessonDTO.getName());
//        lesson.setVideoUrl(lessonDTO.getVideoUrl());
//
//        // Cập nhật Section nếu có
//        if (lessonDTO.getSectionId() != null) {
//            lesson.setSection(sectionRepository.findById(lessonDTO.getSectionId())
//                    .orElseThrow(() -> new RuntimeException("Section not found with id: " + lessonDTO.getSectionId())));
//        }
//
//        Lesson updatedLesson = lessonRepository.save(lesson);
//        return lessonMapper.toDTO(updatedLesson);
//    }
//}
