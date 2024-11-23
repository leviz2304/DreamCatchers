package com.example.demo.service;

import com.example.demo.entity.data.*;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.LessonProgressRepository;
import com.example.demo.repository.data.LessonRepository;
import com.example.demo.repository.data.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class LessonProgressService {
    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SectionRepository sectionRepository;

    public void updateProgress(int userId, int lessonId, double progress) {
        LessonProgressKey key = new LessonProgressKey(userId, lessonId);
        LessonProgress lessonProgress = lessonProgressRepository.findById(key).orElseGet(() -> {
            LessonProgress lp = new LessonProgress();
            lp.setId(key);
            lp.setUser(userRepository.findById(userId).orElseThrow());
            lp.setLesson(lessonRepository.findById(lessonId).orElseThrow());
            lp.setUnlocked(true);
            return lp;
        });

        lessonProgress.setProgressPercentage(progress);
        if (progress >= 80 && !lessonProgress.isCompleted()) {
            lessonProgress.setCompleted(true);
            unlockNextLesson(userId, lessonId);
        }

        lessonProgressRepository.save(lessonProgress);
    }

    private void unlockNextLesson(int userId, int currentLessonId) {
        // Find the next lesson in the course
        Lesson currentLesson = lessonRepository.findById(currentLessonId).orElseThrow();
        Section currentSection = currentLesson.getSection();
        Course course = currentSection.getCourse();

        List<Section> sections = course.getSections();
        // Sort sections and lessons if not already sorted
        sections.sort(Comparator.comparingInt(Section::getId));

        boolean nextLessonFound = false;

        for (int i = 0; i < sections.size(); i++) {
            Section section = sections.get(i);
            List<Lesson> lessons = section.getLessons();
            lessons.sort(Comparator.comparingInt(Lesson::getId));

            for (int j = 0; j < lessons.size(); j++) {
                Lesson lesson = lessons.get(j);
                if (nextLessonFound) {
                    // Unlock this lesson for the user
                    LessonProgressKey key = new LessonProgressKey(userId, lesson.getId());
                    LessonProgress lessonProgress = new LessonProgress();
                    lessonProgress.setId(key);
                    lessonProgress.setUser(userRepository.findById(userId).orElseThrow());
                    lessonProgress.setLesson(lesson);
                    lessonProgress.setUnlocked(true);
                    lessonProgressRepository.save(lessonProgress);
                    return; // Only unlock the immediate next lesson
                }
                if (lesson.getId() == currentLessonId) {
                    nextLessonFound = true;
                }
            }
        }
    }

    public List<LessonProgress> getUserProgressForCourse(int userId, int courseId) {
        // Fetch all LessonProgress for the user with related entities
        List<LessonProgress> allProgress = lessonProgressRepository.findByUserIdWithCourse(userId);

        // Filter by courseId (no lazy loading issues)
        return allProgress.stream()
                .filter(lp -> lp.getLesson().getSection().getCourse().getId() == courseId)
                .collect(Collectors.toList());
    }
}
