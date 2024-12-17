package com.example.demo.service;

import com.example.demo.dto.CourseDTO;
import com.example.demo.dto.SectionDTO;
import com.example.demo.dto.LessonDTO;
import com.example.demo.entity.data.Category;
import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Section;
import com.example.demo.entity.data.Lesson;
import com.example.demo.entity.user.User;
import com.example.demo.repository.data.CategoryRepository;
import com.example.demo.repository.data.CourseRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;
    public List<Lesson> getAllLessonsInOrder(Integer courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return course.getSections().stream()
                .sorted(Comparator.comparing(Section::getId))
                .flatMap(sec -> sec.getLessons().stream()
                        .sorted(Comparator.comparing(Lesson::getId)))
                .collect(Collectors.toList());
    }
    @Transactional()
    public List<CourseDTO> getAllCourses() {
        List<Course> courseEntities = courseRepository.findAll();
        List<CourseDTO> courseDTOs = new ArrayList<>();

        for (Course course : courseEntities) {
            CourseDTO dto = mapToDTO(course);
            courseDTOs.add(dto);
        }

        return courseDTOs;
    }
    private CourseDTO mapToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setThumbnailUrl(course.getThumbnailUrl());
        dto.setVideoPreviewUrl(course.getVideoPreviewUrl());
        dto.setTutorId(course.getTutor().getId());

        Set<Integer> categoryIds = course.getCategories().stream()
                .map(Category::getId)
                .collect(Collectors.toSet());
        dto.setCategoryIds(categoryIds);

        if (course.getSections() != null) {
            List<SectionDTO> sectionDTOs = new ArrayList<>();
            for (Section section : course.getSections()) {
                SectionDTO sectionDTO = new SectionDTO();
                sectionDTO.setName(section.getName());

                if (section.getLessons() != null) {
                    List<LessonDTO> lessonDTOs = new ArrayList<>();
                    for (Lesson lesson : section.getLessons()) {
                        LessonDTO lessonDTO = new LessonDTO();
                        lessonDTO.setName(lesson.getName());
                        lessonDTO.setVideoUrl(lesson.getVideoUrl());
                        lessonDTOs.add(lessonDTO);
                    }
                    sectionDTO.setLessons(lessonDTOs);
                }

                sectionDTOs.add(sectionDTO);
            }
            dto.setSections(sectionDTOs);
        }

        return dto;
    }
    public CourseDTO getCourseById(Integer id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        CourseDTO courseDTO = modelMapper.map(course, CourseDTO.class);

        courseDTO.setTutorId(course.getTutor().getId());

        Set<Integer> categoryIds = course.getCategories().stream()
                .map(Category::getId)
                .collect(Collectors.toSet());
        courseDTO.setCategoryIds(categoryIds);

        if (course.getSections() != null) {
            List<SectionDTO> sectionDTOs = course.getSections().stream()
                    .map(section -> {
                        SectionDTO sectionDTO = modelMapper.map(section, SectionDTO.class);
                        sectionDTO.setCourseId(course.getId());

                        if (section.getLessons() != null) {
                            List<LessonDTO> lessonDTOs = section.getLessons().stream()
                                    .map(lesson -> modelMapper.map(lesson, LessonDTO.class))
                                    .collect(Collectors.toList());
                            sectionDTO.setLessons(lessonDTOs);
                        }

                        return sectionDTO;
                    })
                    .collect(Collectors.toList());
            courseDTO.setSections(sectionDTOs);
        }

        return courseDTO;
    }

    public CourseDTO createCourse(CourseDTO courseDTO) {
        Course course = modelMapper.map(courseDTO, Course.class);

        User tutor = userRepository.findById(courseDTO.getTutorId())
                .orElseThrow(() -> new RuntimeException("Tutor not found with id: " + courseDTO.getTutorId()));
        course.setTutor(tutor);

        Set<Category> categories = categoryRepository.findAllById(courseDTO.getCategoryIds())
                .stream().collect(Collectors.toSet());
        course.setCategories(categories);

        if (courseDTO.getSections() != null && !courseDTO.getSections().isEmpty()) {
            List<Section> sections = courseDTO.getSections().stream()
                    .map(sectionDTO -> {
                        Section section = modelMapper.map(sectionDTO, Section.class);
                        section.setCourse(course);

                        if (sectionDTO.getLessons() != null && !sectionDTO.getLessons().isEmpty()) {
                            List<Lesson> lessons = sectionDTO.getLessons().stream()
                                    .map(lessonDTO -> {
                                        Lesson lesson = modelMapper.map(lessonDTO, Lesson.class);
                                        lesson.setSection(section);
                                        return lesson;
                                    })
                                    .collect(Collectors.toList());
                            section.setLessons(lessons);
                        }

                        return section;
                    })
                    .collect(Collectors.toList());
            course.setSections(sections);
        }

        Course savedCourse = courseRepository.save(course);
        return modelMapper.map(savedCourse, CourseDTO.class);
    }

    public CourseDTO updateCourse(Integer id, CourseDTO courseDTO) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        existingCourse.setTitle(courseDTO.getTitle());
        existingCourse.setDescription(courseDTO.getDescription());
        existingCourse.setThumbnailUrl(courseDTO.getThumbnailUrl());
        existingCourse.setVideoPreviewUrl(courseDTO.getVideoPreviewUrl());

        if (courseDTO.getTutorId() != null) {
            User tutor = userRepository.findById(courseDTO.getTutorId())
                    .orElseThrow(() -> new RuntimeException("Tutor not found with id: " + courseDTO.getTutorId()));
            existingCourse.setTutor(tutor);
        }

        if (courseDTO.getCategoryIds() != null) {
            Set<Category> categories = categoryRepository.findAllById(courseDTO.getCategoryIds())
                    .stream().collect(Collectors.toSet());
            existingCourse.setCategories(categories);
        }

        if (courseDTO.getSections() != null) {
            existingCourse.getSections().clear();

            List<Section> sections = courseDTO.getSections().stream()
                    .map(sectionDTO -> {
                        Section section = modelMapper.map(sectionDTO, Section.class);
                        section.setCourse(existingCourse);

                        // Thiết lập lessons nếu có
                        if (sectionDTO.getLessons() != null && !sectionDTO.getLessons().isEmpty()) {
                            List<Lesson> lessons = sectionDTO.getLessons().stream()
                                    .map(lessonDTO -> {
                                        Lesson lesson = modelMapper.map(lessonDTO, Lesson.class);
                                        lesson.setSection(section);
                                        return lesson;
                                    })
                                    .collect(Collectors.toList());
                            section.setLessons(lessons);
                        }

                        return section;
                    })
                    .collect(Collectors.toList());
            existingCourse.getSections().addAll(sections);
        }

        Course updatedCourse = courseRepository.save(existingCourse);
        return modelMapper.map(updatedCourse, CourseDTO.class);
    }

    public void deleteCourse(Integer id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        courseRepository.delete(course);
    }
}
