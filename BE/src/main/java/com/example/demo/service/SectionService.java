package com.example.demo.service;

import com.example.demo.dto.CourseDTO;
import com.example.demo.dto.LessonDTO;
import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Lesson;
import com.example.demo.entity.data.Section;
import com.example.demo.repository.data.SectionRepository;
import com.example.demo.dto.SectionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SectionService {

    @Autowired
    private SectionRepository sectionRepository;
    @Autowired
    private LessonService lessonService;

    public void removeSection(Section section) {
        sectionRepository.delete(section);
    }

    public void removeAllSection(List<Section> sections) {
        sectionRepository.deleteAll(sections);
    }

    public Section findById(int id) {
        return sectionRepository.findById(id).orElse(null);
    }

    public void deleteSection(int id) {
        var section = sectionRepository.findById(id).orElse(null);
        if (section != null) {
            section.setDeleted(true);
            sectionRepository.save(section);
        }
    }

    public List<Section> getSectionsByCourse(Course course, boolean isDeleted) {
        return sectionRepository.findSectionsByCourse(course.getId(), isDeleted).orElse(null);
    }

    public void updateSection(SectionDTO sectionDTO) {
        var section = sectionRepository.findById(sectionDTO.getId()).orElse(null);

        if (section != null) {
            section.setTitle(sectionDTO.getTitle());
            var lesson = lessonService.updateLessonsOfSection(section, sectionDTO);
            section.setLessons(lesson);
            sectionRepository.save(section);
        }
    }

    public void addListSectionDtoToCourse(Course course, List<SectionDTO> sectionDTOs) {
        if (course.getSections() == null) course.setSections(new ArrayList<>());
        for (var sectionDTO : sectionDTOs) {
            var section = Section.builder()
                    .title(sectionDTO.getTitle())
                    .course(course)
                    .build();

            List<Lesson> lessons = new ArrayList<>();
            for (LessonDTO lessonDTO : sectionDTO.getLessons()) {
                Lesson lesson = Lesson.builder()
                        .description(lessonDTO.getDescription())
                        .linkVideo(lessonDTO.getLinkVideo())
                        .title(lessonDTO.getTitle())
                        .video(lessonDTO.getVideo())
                        .date(LocalDateTime.now())
                        .section(section)
                        .build();
                lessons.add(lesson);
            }
            section.setLessons(lessons);
            course.getSections().add(section);
            sectionRepository.save(section);
        }
    }



    public void updateSections(CourseDTO courseDTO, Course course) {
        if (courseDTO.getSections().isEmpty()) {
            if (course.getSections() == null || course.getSections().isEmpty()) return;
            else {
                course.getSections().forEach(section -> {
                    section.setDeleted(true);
                    sectionRepository.save(section);
                });
                return;
            }
        }

        var updateSections = new ArrayList<Section>();
        for (var sectionDTO : courseDTO.getSections()) {
            Section section;
            if (sectionDTO.getId() == 0) {
                section = Section.builder()
                        .title(sectionDTO.getTitle())
                        .course(course)
                        .build();

                List<Lesson> lessons = new ArrayList<>();
                for (LessonDTO lessonDTO : sectionDTO.getLessons()) {
                    Lesson lesson = Lesson.builder()
                            .description(lessonDTO.getDescription())
                            .linkVideo(lessonDTO.getLinkVideo())
                            .title(lessonDTO.getTitle())
                            .video(lessonDTO.getVideo())
                            .date(LocalDateTime.now())
                            .section(section)
                            .build();
                    lessons.add(lesson);
                }
                section.setLessons(lessons);
                course.getSections().add(section);
                updateSections.add(section);
            } else {
                section = sectionRepository.findById(sectionDTO.getId()).orElse(null);
                if (section != null) {
                    section.setTitle(sectionDTO.getTitle());
                    var lessons = lessonService.updateLessonsOfSection(section, sectionDTO);
                    section.setLessons(lessons);
                    updateSections.add(section);
                }
            }

            assert section != null;
            sectionRepository.save(section);
        }

        course.getSections().forEach(section -> {
            if (!updateSections.contains(section)) {
                section.setDeleted(true);
                sectionRepository.save(section);
            }
        });
    }


}
