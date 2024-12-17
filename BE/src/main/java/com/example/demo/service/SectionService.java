//package com.example.demo.service;
//
//import com.example.demo.dto.SectionDTO;
//import com.example.demo.entity.data.Course;
//import com.example.demo.entity.data.Section;
//import com.example.demo.mapper.SectionMapper;
//import com.example.demo.repository.data.CourseRepository;
//import com.example.demo.repository.data.SectionRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class SectionService {
//
//    @Autowired
//    private SectionRepository sectionRepository;
//
//    @Autowired
//    private CourseRepository courseRepository;
//
//    @Autowired
//    private SectionMapper sectionMapper;
//
//    // Tạo mới hoặc cập nhật Section
//    public SectionDTO saveSection(SectionDTO sectionDTO) {
//        Section section = sectionMapper.toEntity(sectionDTO);
//
//        // Liên kết với Course
//        Optional<Course> courseOpt = courseRepository.findById(sectionDTO.getCourseId());
//        if (!courseOpt.isPresent()) {
//            throw new RuntimeException("Course not found with id: " + sectionDTO.getCourseId());
//        }
//        section.setCourse(courseOpt.get());
//
//        Section savedSection = sectionRepository.save(section);
//        return sectionMapper.toDTO(savedSection);
//    }
//
//    // Lấy tất cả các Section
//    public List<SectionDTO> getAllSections() {
//        return sectionRepository.findAll().stream()
//                .map(sectionMapper::toDTO)
//                .collect(Collectors.toList());
//    }
//
//    // Lấy Section theo ID
//    public Optional<SectionDTO> getSectionById(Integer id) {
//        return sectionRepository.findById(id)
//                .map(sectionMapper::toDTO);
//    }
//
//    // Xóa Section
//    public void deleteSection(Integer id) {
//        sectionRepository.deleteById(id);
//    }
//
//    // Cập nhật Section
//    public SectionDTO updateSection(Integer id, SectionDTO sectionDTO) {
//        Optional<Section> optionalSection = sectionRepository.findById(id);
//        if (!optionalSection.isPresent()) {
//            throw new RuntimeException("Section not found with id: " + id);
//        }
//        Section section = optionalSection.get();
//
//        // Cập nhật thông tin cơ bản
//        section.setName(sectionDTO.getName());
//
//        // Cập nhật Course nếu cần
//        if (sectionDTO.getCourseId() != null) {
//            Optional<Course> courseOpt = courseRepository.findById(sectionDTO.getCourseId());
//            if (!courseOpt.isPresent()) {
//                throw new RuntimeException("Course not found with id: " + sectionDTO.getCourseId());
//            }
//            section.setCourse(courseOpt.get());
//        }
//
//        // Cập nhật Lessons nếu cần (nếu bạn có logic cụ thể)
//
//        Section updatedSection = sectionRepository.save(section);
//        return sectionMapper.toDTO(updatedSection);
//    }
//}
