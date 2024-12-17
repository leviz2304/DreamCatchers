package com.example.demo.service;

import com.example.demo.dto.LessonStatusDTO;
import com.example.demo.entity.data.Lesson;
import com.example.demo.entity.data.UserLessonProgress;
import com.example.demo.entity.data.UserLessonProgressId;
import com.example.demo.entity.user.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.LessonRepository;
import com.example.demo.repository.data.UserLessonProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProgressService {
    @Autowired
    private UserLessonProgressRepository userLessonProgressRepository;

    @Autowired
    private CourseService courseService; // để getAllLessonsInOrder
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LessonRepository lessonRepository;
    public void updateProgress(Integer userId, Integer lessonId, Double progressValue) {
        // Tìm user và lesson
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        UserLessonProgress progress = userLessonProgressRepository.findByIdUserIdAndIdLessonId(userId, lessonId);
        if (progress == null) {
            progress = new UserLessonProgress();
            progress.setId(new UserLessonProgressId(userId, lessonId));
            progress.setUser(user);
            progress.setLesson(lesson);
        }

        progress.setProgress(progressValue);
        userLessonProgressRepository.save(progress);
    }

    public boolean isLessonUnlocked(Integer userId, Integer lessonId, Integer courseId) {
        List<Lesson> allLessons = courseService.getAllLessonsInOrder(courseId);
        int index = -1;
        for (int i = 0; i < allLessons.size(); i++) {
            if (allLessons.get(i).getId().equals(lessonId)) {
                index = i;
                break;
            }
        }

        if (index == -1) {
            // bài học không thuộc khóa này
            return false;
        }

        if (index == 0) {
            // Bài học đầu tiên luôn mở khóa
            return true;
        }

        // Kiểm tra bài học trước đó
        Lesson prevLesson = allLessons.get(index - 1);

        // Lấy progress bài học trước
        UserLessonProgress prevProgress = userLessonProgressRepository
                .findByIdUserIdAndIdLessonId(userId, prevLesson.getId());

        // Nếu progress bài trước >=80% thì bài này mở khóa
        return prevProgress != null && prevProgress.getProgress() >= 80.0;
    }

    // Method để trả về danh sách bài học kèm trạng thái mở khóa
    public List<LessonStatusDTO> getUserLessonStatuses(Integer userId, Integer courseId) {
        List<Lesson> allLessons = courseService.getAllLessonsInOrder(courseId);
        List<LessonStatusDTO> result = new ArrayList<>();

        for (int i = 0; i < allLessons.size(); i++) {
            Lesson lesson = allLessons.get(i);
            boolean unlocked = false;
            if (i == 0) {
                unlocked = true; // bài đầu tiên mở
            } else {
                // Kiểm tra bài trước
                Lesson prevLesson = allLessons.get(i-1);
                UserLessonProgress prevProgress = userLessonProgressRepository
                        .findByIdUserIdAndIdLessonId(userId, prevLesson.getId());
                unlocked = prevProgress != null && prevProgress.getProgress() >= 80.0;
            }

            result.add(new LessonStatusDTO(lesson.getId(), lesson.getName(), unlocked));
        }

        return result;
    }
}


