//package com.example.demo.mapper;
//
//import com.example.demo.dto.CourseDTO;
//import com.example.demo.entity.data.Course;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.Named;
//
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@Mapper(componentModel = "spring", uses = {SectionMapper.class})
//public interface CourseMapper {
//
//    @Mapping(source = "tutor.id", target = "tutorId")
//    @Mapping(source = "categories", target = "categoryIds", qualifiedByName = "mapCategoriesToIds")
//    @Mapping(source = "sections", target = "sections")
//    CourseDTO toDTO(Course course);
//
//    @Mapping(source = "tutorId", target = "tutor.id")
//    @Mapping(source = "categoryIds", target = "categories", qualifiedByName = "mapIdsToCategories")
//    @Mapping(source = "sections", target = "sections")
//    Course toEntity(CourseDTO courseDTO);
//
//    @Named("mapCategoriesToIds")
//    default Set<Integer> mapCategoriesToIds(Set<com.example.demo.entity.data.Category> categories) {
//        if (categories == null) {
//            return null;
//        }
//        return categories.stream()
//                .map(com.example.demo.entity.data.Category::getId)
//                .collect(Collectors.toSet());
//    }
//
//    @Named("mapIdsToCategories")
//    default Set<com.example.demo.entity.data.Category> mapIdsToCategories(Set<Integer> categoryIds) {
//        if (categoryIds == null) {
//            return null;
//        }
//        return categoryIds.stream()
//                .map(id -> {
//                    com.example.demo.entity.data.Category category = new com.example.demo.entity.data.Category();
//                    category.setId(id);
//                    return category;
//                })
//                .collect(Collectors.toSet());
//    }
//}
