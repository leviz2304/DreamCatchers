package com.example.demo.service;

import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.data.Category;
import com.example.demo.entity.data.Course;
import com.example.demo.repository.data.CategoryRepository;
import com.example.demo.repository.data.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;

    public ResponseObject getAllCategory(int page, int size) {
        var categories = categoryRepository.findAllByIsDeleted(false, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).mess("Get successfully").content(categories).build();
    }

    public ResponseObject getAllCategoryDeleted(int page, int size) {
        var categories = categoryRepository.findAllByIsDeleted(true, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).mess("Get successfully").content(categories).build();
    }

    public Category getById(int id) {
        var cate = categoryRepository.findById(id).orElse(null);
        if(cate == null) {
            return null;
        }
        return cate;
    }

    public void updateCategoriesForCourse(Course course, List<Integer> categories) {
        List<Category> newCategories = new ArrayList<>();
        for(var temp : categories) {
            var cate = categoryRepository.findById(temp).orElse(null);
            if(cate != null) {
                newCategories.add(cate);
                course.getCategories().add(cate);
            }
        }

        course.getCategories().removeIf(old -> !newCategories.contains(old));
    }

    public void addCategoriesForCourse(Course course, List<Integer> categories) {
        if(categories == null) {
            course.setCategories(null);
            return;
        }
        for(var temp : categories) {
            categoryRepository.findById(temp).ifPresent(cate -> course.getCategories().add(cate));
        }
    }

    public ResponseObject getByTitle(String title, int page, int size) {
        var result = categoryRepository.findByNameContaining(title, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).mess("Get data successfully").content(result).build();
    }

    public ResponseObject updateCategoryById(int id, Category category) {
        var tempCategory = categoryRepository.findById(id).orElse(null);
        var existName = categoryRepository.findByName(category.getName()).orElse(null);
        if (tempCategory == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Category does not exist!").build();
        }
        if(existName != null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("The category name existed!").build();
        }
        categoryRepository.save(category);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Update successfully").build();
    }

    public ResponseObject createCategory(String name)
    {
        var result = categoryRepository.findByName(name).orElse(null);
        if(result == null) {
            result = Category.builder().name(name).build();
            categoryRepository.save(result);
            return ResponseObject.builder().status(HttpStatus.OK).mess("Create category successfully").build();
        }
        return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Category existed").build();
    }

    public ResponseObject softDelete(int id) {
        var category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Category does not exist!").build();
        }
        category.setDeleted(true);
        for (Course course : category.getCourses()) {
            course.getCategories().remove(category);
            courseRepository.save(course);
        }
        category.setCourses(null);
        categoryRepository.save(category);
        return ResponseObject.builder().mess("Delete course successfully!").status(HttpStatus.OK).build();
    }

    public ResponseObject hardDelete(int id) {
        var category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Course is not exist!").build();
        }
        categoryRepository.delete(category);
        return ResponseObject.builder().mess("Delete course successfully!").status(HttpStatus.OK).build();
    }

    public ResponseObject restoreCategoryById(int id) {
        var category = categoryRepository.findById(id).orElse(null);
        if(category == null) return ResponseObject.builder().mess("Category does not exist").status(HttpStatus.BAD_REQUEST).build();
        category.setDeleted(false);
        return ResponseObject.builder().mess("Restore successfully").status(HttpStatus.OK).build();
    }
}