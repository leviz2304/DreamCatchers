//package com.example.demo.mapper;
//
//import com.example.demo.dto.LessonDTO;
//import com.example.demo.entity.data.Lesson;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//
//@Mapper(componentModel = "spring")
//public interface LessonMapper {
//
//    @Mapping(source = "section.id", target = "sectionId")
//    LessonDTO toDTO(Lesson lesson);
//
//    @Mapping(target = "section", ignore = true) // Bỏ qua phần liên kết, sẽ xử lý trong service
//    Lesson toEntity(LessonDTO lessonDTO);
//}
