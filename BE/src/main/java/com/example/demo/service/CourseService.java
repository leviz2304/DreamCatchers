package com.example.demo.service;

import com.example.demo.cloudinary.CloudService;
import com.example.demo.dto.CourseStatisticDTO;
import com.example.demo.dto.ResponseObject;
import com.example.demo.dto.SectionDTO;
import com.example.demo.entity.data.*;
import com.example.demo.entity.user.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.CourseRepository;
import com.example.demo.dto.CourseDTO;
import com.example.demo.repository.data.LessonProgressRepository;
import com.example.demo.repository.data.ProgressRepository;
import com.example.demo.repository.data.SectionRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Data
@RequiredArgsConstructor
@Service
@Transactional
public class CourseService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final CloudService cloudService;
    private final CategoryService categoryService;
    private final LessonService lessonService;
    private final SectionService sectionService;
    private final ProgressRepository progressRepository;
    private final UserService userService; // Fetch instructors and students
    public ResponseObject getCourseById(int id, boolean isDeleted) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseObject.builder().mess("Course is not exist!").status(HttpStatus.BAD_REQUEST).build();
        }
        var sections = sectionService.getSectionsByCourse(course, isDeleted);
        course.setSections(sections);
        return ResponseObject.builder().content(course).status(HttpStatus.OK).build();
    }

    public ResponseObject getAllCourse(int page, int size) {
        var courses = courseRepository.findAllByIsDeleted(false, PageRequest.of(page, size));
        System.out.println("Gello"+courses);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Get successfully").content(courses).build();
    }

    public ResponseObject getAllCourseDeleted(int page, int size) {
        var courses = courseRepository.findAllByIsDeleted(true, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).mess("Get successfully").content(courses).build();
    }
    public boolean isUserEnrolled(int courseId, int userId) {
        return progressRepository.existsByCourse_IdAndUser_Id(courseId, userId);
    }
    private void unlockFirstLessonForUser(int courseId, int userId) {
        Course course = courseRepository.findById(courseId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        List<Section> sections = course.getSections();
        sections.sort(Comparator.comparingInt(Section::getId));
        if (!sections.isEmpty()) {
            Section firstSection = sections.get(0);
            List<Lesson> lessons = firstSection.getLessons();
            lessons.sort(Comparator.comparingInt(Lesson::getId));
            if (!lessons.isEmpty()) {
                Lesson firstLesson = lessons.get(0);
                LessonProgressKey key = new LessonProgressKey(userId, firstLesson.getId());
                LessonProgress lessonProgress = new LessonProgress();
                lessonProgress.setId(key);
                lessonProgress.setUser(user);
                lessonProgress.setLesson(firstLesson);
                lessonProgress.setUnlocked(true);
                lessonProgressRepository.save(lessonProgress);
            }

        }
    }

    public ResponseObject updateCourse(int id, CourseDTO courseDTO) {
        var course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseObject.builder().mess("Course does not exist!").status(HttpStatus.BAD_REQUEST).build();
        }

        course.setThumbnail(courseDTO.getThumbnail());
        course.setVideo(courseDTO.getVideo());
        course.setDescription(courseDTO.getDescription());
        course.setDiscount(courseDTO.getDiscount());
        course.setTitle(courseDTO.getTitle());

        sectionService.updateSections(courseDTO, course);

        if (courseDTO.isEditedCategories()) {
            categoryService.updateCategoriesForCourse(course, courseDTO.getCategories());
        }

        courseRepository.save(course);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Update successfully").build();
    }

    public ResponseObject addCourse(CourseDTO request) {
        if (courseRepository.findByTitle(request.getTitle()).isPresent()) {
            return ResponseObject.builder().mess("Course already exists").status(HttpStatus.BAD_REQUEST).build();
        }

        // Fetch instructor
        var instructor = userService.findByEmail(request.getInstructor());
        if (instructor == null) {
            return ResponseObject.builder().mess("Instructor not found").status(HttpStatus.BAD_REQUEST).build();
        }
        Course course = Course.builder()
                .title(request.getTitle())
                .price(request.getPrice())
                .discount(request.getDiscount())
                .description(request.getDescription())
                .date(LocalDateTime.now())
                .thumbnail(request.getThumbnail())
                .video(request.getVideo())
                .instructor(instructor)
                .categories(categoryService.getCategoriesByIds(request.getCategories()))
                .build();

        for (SectionDTO sectionDTO : request.getSections()) {
            Section section = Section.builder()
                    .title(sectionDTO.getTitle())
                    .course(course)
                    .build();

            if (sectionDTO.getLessons() != null) {
                lessonService.addLessonForSection(sectionDTO.getLessons(), section, null, 0);
            }

            course.getSections().add(section);
        }

        // Lưu Course
        courseRepository.save(course);

        return ResponseObject.builder().mess("Course created successfully").status(HttpStatus.OK).build();
    }

    public ResponseObject softDelete(int id) {
        var course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content(courseRepository.findAllByIsDeleted(false, PageRequest.of(0, 5))).mess("Course is not exist!").build();
        }
        course.setDeleted(true);
        courseRepository.save(course);
        return ResponseObject.builder().mess("Delete course successfully!").content(courseRepository.findAllByIsDeleted(false, PageRequest.of(0, 5))).status(HttpStatus.OK).build();
    }

    public ResponseObject hardDelete(int id) {
        var course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Course is not exist!").build();
        }
        courseRepository.delete(course);
        return ResponseObject.builder().mess("Delete course successfully!").status(HttpStatus.OK).build();
    }

    public ResponseObject getAllCourseByCategoryIdAndTitle(int id, String title) {
        List<Course> result = courseRepository.findAll();
        if (!Objects.equals(title, ""))
            result = result.stream().filter(c -> c.getTitle().contains(title)).toList();
        if (id != -1) {
            result = result.stream().filter(c -> c.getCategories().stream().anyMatch(ca -> ca.getId() == id)).toList();
        }
        return ResponseObject.builder().status(HttpStatus.OK).content(result).mess("Get data successfully").build();
    }

    public ResponseObject getAllCourseByCategoryId(int id, int page, int size) {
        if (id == -1) {
            return ResponseObject.builder().status(HttpStatus.OK).content(courseRepository.findAll(PageRequest.of(page, size))).mess("Get data successfully").build();
        }
        var result = courseRepository.findByCategoryId(id, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).mess("Get data successfully").build();
    }

    public ResponseObject getAllCourseDeletedByCategoryId(int id, int page, int size) {
        if (id == -1) {
            return ResponseObject.builder().status(HttpStatus.OK).content(courseRepository.findAllByIsDeleted(true, PageRequest.of(page, size))).mess("Get data successfully").build();
        }
        var result = courseRepository.findByCategoryIdAndIsDeleted(id, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).mess("Get data successfully").build();
    }

    public ResponseObject getAllCourseByCourseTitle(String title, boolean isDeleted, int page, int size) {
        var result = courseRepository.findByTitleContainingAndIsDeleted(title, isDeleted, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).mess("Get data successfully").build();
    }

    public ResponseObject restoreCourseById(int id) {
        var course = courseRepository.findById(id).orElse(null);
        if (course == null)
            return ResponseObject.builder().mess("Course does not exist").status(HttpStatus.BAD_REQUEST).build();
        course.setDeleted(false);
        courseRepository.save(course);
        return ResponseObject.builder().content(courseRepository.findAllByIsDeleted(true, PageRequest.of(0, 5))).mess("Restore successfully").status(HttpStatus.OK).build();
    }

    @Transactional
    public boolean enrollUser(int courseId, int userId) {
        // Check if the user is already enrolled in the course
        if (progressRepository.existsByCourse_IdAndUser_Id(courseId, userId)) {
            return false; // User is already enrolled
        }

        // Find course and user
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create a new Progress entry to represent the enrollment
        Progress progress = Progress.builder()
                .course(course)
                .user(user)
                .lessonIds(new ArrayList<>()) // Initialize if needed
                .build();

        // Save the Progress entity
        progressRepository.save(progress);

        return true; // User enrolled successfully
    }




    public ResponseObject getAllByPageable(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        var courses = courseRepository.findAllByIsDeleted(false, pageable);
        System.out.println("Fetched Courses: " + courses.getContent());
        return ResponseObject.builder().status(HttpStatus.OK).content(courses).build();
    }
    public ResponseObject getAllcoursesNotdeleted(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        var courses = courseRepository.findAllByIsDeleted(false, pageable);
        System.out.println("Fetched Courses: " + courses.getContent());
        return ResponseObject.builder().status(HttpStatus.OK).content(courses).build();
    }

}
