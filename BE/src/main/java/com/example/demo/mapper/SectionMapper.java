//package com.example.demo.mapper;
//
//import com.example.demo.dto.SectionDTO;
//import com.example.demo.entity.data.Section;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//
//@Mapper(componentModel = "spring", uses = {LessonMapper.class})
//public interface SectionMapper {
//
//    @Mapping(source = "course.id", target = "courseId")
//    SectionDTO toDTO(Section section);
//
//    @Mapping(target = "course", ignore = true) // Bỏ qua phần liên kết, sẽ xử lý trong service
//    Section toEntity(SectionDTO sectionDTO);
//}
