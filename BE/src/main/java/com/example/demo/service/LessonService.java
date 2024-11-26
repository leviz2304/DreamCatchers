package com.example.demo.service;

import com.example.demo.dto.ResponseObject;
import com.example.demo.dto.SectionDTO;
import com.example.demo.dto.LessonDTO;
import com.example.demo.entity.data.Lesson;
import com.example.demo.entity.data.Section;
import com.example.demo.repository.data.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonService {
    private final LessonRepository lessonRepository;

    public ResponseObject getById(int id) {
        var lesson = lessonRepository.findById(id).orElse(null);
        if(lesson == null) {
            return ResponseObject.builder().content("Lesson is not exist!").status(HttpStatus.BAD_REQUEST).build();
        }
        return  ResponseObject.builder().status(HttpStatus.OK).content(lesson).build();
    }

    public List<Lesson> getLessonsBySections(List<Integer> list) {
        return lessonRepository.findLessonsBySections(list);
    }

    public List<Lesson> updateLessonsOfSection(Section oldSection, SectionDTO newSection) {
        if (newSection.getLessons().isEmpty()) {
            // Handle deletion...
            return null;
        }

        var lessonsUpdate = new ArrayList<Lesson>();

        for (var newLesson : newSection.getLessons()) {
            var currentLesson = oldSection.getLessons().stream()
                    .filter(l -> newLesson.getId() == l.getId())
                    .findFirst()
                    .orElse(null);

            if (currentLesson != null) {
                // Update existing lesson
                currentLesson.setDescription(newLesson.getDescription());
                currentLesson.setTitle(newLesson.getTitle());
                currentLesson.setVideo(newLesson.getVideo());
                currentLesson.setLinkVideo(newLesson.getLinkVideo());
                // Ensure section is set
                currentLesson.setSection(oldSection);
                lessonsUpdate.add(currentLesson);
            } else {
                // Create new lesson
                currentLesson = Lesson.builder()
                        .description(newLesson.getDescription())
                        .video(newLesson.getVideo())
                        .title(newLesson.getTitle())
                        .linkVideo(newLesson.getLinkVideo())
                        .section(oldSection) // Set the section
                        .build();
                oldSection.getLessons().add(currentLesson);
                lessonsUpdate.add(currentLesson);
            }
        }

        // Handle deletion of removed lessons...
        return oldSection.getLessons();
    }
//    public int updateVideo(LessonDTO lessonDTO, Lesson lesson, List<String> videos, int index) {
//        if(videos != null && videos.size() > index) {
//            switch (lessonDTO.getActionVideo()) {
//                case "REMOVE" -> {
//                    System.out.println("REMOVE  VIDEO");
//                    lesson.setVideo(null);
//                }
//                case "UPDATE" -> {
//                    System.out.println("UPDATE VIDEO");
//                    lesson.setVideo(videos.get(index));
//                    index++;
//                }
//                case "NONE" -> {
//                    System.out.println("NONE  VIDEO");
//                    lesson.setVideo(null);
//                }
//                case "KEEP" -> {
//                    System.out.println("KEEP  VIDEO");
//                    System.out.println(lessonDTO.getVideo());
//                    lesson.setVideo(lessonDTO.getVideo());
//                }
//                default -> System.out.println("DEFAULT  VIDEO");
//            }
//        }
//        return index;
//    }
public int updateVideo(Lesson lesson, List<String> videos, int index) {
    if (videos != null && videos.size() > index) {
        switch (lesson.getActionVideo()) { // Đảm bảo Lesson có trường `actionVideo`
            case "REMOVE" -> {
                System.out.println("REMOVE VIDEO");
                lesson.setVideo(null);
            }
            case "UPDATE" -> {
                System.out.println("UPDATE VIDEO");
                lesson.setVideo(videos.get(index));
                index++;
            }
            case "NONE" -> {
                System.out.println("NONE VIDEO");
                lesson.setVideo(null);
            }
            case "KEEP" -> {
                System.out.println("KEEP VIDEO");
                lesson.setVideo(lesson.getVideo());
            }
            default -> System.out.println("DEFAULT VIDEO");
        }
    }
    return index;
}

    public int addLessonForSection(List<LessonDTO> lessonDTOs, Section section, List<String> videos, int indexVideo) {
        if (section.getLessons() == null) {
            section.setLessons(new ArrayList<>());
        }
        for (LessonDTO lessonDTO : lessonDTOs) {
            Lesson lesson = Lesson.builder()
                    .section(section)
                    .date(LocalDateTime.now())
                    .title(lessonDTO.getTitle())
                    .description(lessonDTO.getDescription())
                    .linkVideo(lessonDTO.getLinkVideo())
                    .video(lessonDTO.getVideo())
                    .actionVideo(lessonDTO.getActionVideo())
                    .build();
            section.getLessons().add(lesson);

            if (videos != null && videos.size() > indexVideo) {
                indexVideo = updateVideo(lesson, videos, indexVideo);
            }
        }
        return indexVideo;
    }

}
