package com.example.demo.service;

import com.example.demo.cloudinary.CloudService;
import com.example.demo.dto.ResponseObject;
import com.example.demo.dto.SectionDTO;
import com.example.demo.dto.LessonDTO;
import com.example.demo.entity.data.Lesson;
import com.example.demo.entity.data.Section;
import com.example.demo.repository.data.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

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
        if(newSection.getLessons().isEmpty()) {
            oldSection.setLessons(oldSection.getLessons().stream().peek(lesson -> lesson.setDeleted(true)).collect(Collectors.toList()));
            for (var oldLesson:
                    oldSection.getLessons()) {
                oldLesson.setDeleted(true);
                lessonRepository.save(oldLesson);
            }
            return null;
        }

        var lessonsUpdate = new ArrayList<Lesson>();

        for(var newLesson : newSection.getLessons()) {
            var currentLesson = oldSection.getLessons().stream()
                    .filter(l -> newLesson.getId() == l.getId())
                    .findFirst()
                    .orElse(null);
            if(currentLesson != null) {
                currentLesson.setDescription(newLesson.getDescription());
                currentLesson.setTitle(newLesson.getTitle());
                currentLesson.setVideo(newLesson.getVideo());
                currentLesson.setLinkVideo(newLesson.getLinkVideo());
                lessonsUpdate.add(currentLesson);
            } else {
                currentLesson = Lesson.builder()
                        .description(newLesson.getDescription())
                        .video(newLesson.getVideo())
                        .title(newLesson.getTitle())
                        .linkVideo(newLesson.getLinkVideo())
                        .build();
                oldSection.getLessons().add(currentLesson);
                lessonsUpdate.add(currentLesson);
            }
        }
        oldSection.setLessons(oldSection.getLessons().stream().peek(lesson -> {
            if(lessonsUpdate.stream().noneMatch(l -> l.getId() == lesson.getId())) {
                lesson.setDeleted(true);
            }
        }).collect(Collectors.toList()));

       return oldSection.getLessons();
    }

    public int updateVideo(LessonDTO lessonDTO, Lesson lesson, List<String> videos, int index) {
        if(videos != null && videos.size() > index) {
            switch (lessonDTO.getActionVideo()) {
                case "REMOVE" -> {
                    System.out.println("REMOVE  VIDEO");
                    lesson.setVideo(null);
                }
                case "UPDATE" -> {
                    System.out.println("UPDATE VIDEO");
                    lesson.setVideo(videos.get(index));
                    index++;
                }
                case "NONE" -> {
                    System.out.println("NONE  VIDEO");
                    lesson.setVideo(null);
                }
                case "KEEP" -> {
                    System.out.println("KEEP  VIDEO");
                    System.out.println(lessonDTO.getVideo());
                    lesson.setVideo(lessonDTO.getVideo());
                }
                default -> System.out.println("DEFAULT  VIDEO");
            }
        }
        return index;
    }

//    public int addLessonForSection(List<LessonDTO> newLessons, Section section, SectionDTO sectionDTO, List<String> videos, int indexVideo) {
//        if(section.getLessons() == null) {
//            section.setLessons(new ArrayList<>());
//        }
//        for (var lesson : sectionDTO.getLessons()
//        ) {
//            Lesson tLesson = Lesson.builder()
//                    .section(section)
//                    .date(LocalDateTime.now())
//                    .title(lesson.getTitle())
//                    .description(lesson.getDescription())
//                    .linkVideo(lesson.getLinkVideo())
//                    .build();
//            section.getLessons().add(tLesson);
//                if(videos != null && videos.size() > indexVideo)
//                {
//                    indexVideo = updateVideo(lesson, tLesson, videos, indexVideo);
//                }
//        }
//        return indexVideo;
//    }
 }
