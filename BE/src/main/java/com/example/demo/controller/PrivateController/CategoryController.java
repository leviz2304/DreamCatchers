package com.example.demo.controller.PrivateController;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.dto.ResponseObject;
import com.example.demo.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/private/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Tạo mới Category
    @PostMapping
    public ResponseEntity<ResponseObject> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        try {
            CategoryDTO savedCategory = categoryService.saveCategory(categoryDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.CREATED)
                            .mess("Category created successfully")
                            .content(savedCategory)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .mess("Error creating category: " + e.getMessage())
                            .content(null)
                            .build());
        }
    }

    // Lấy tất cả các Category
    @GetMapping
    public ResponseEntity<ResponseObject> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .mess("Fetched all categories successfully")
                        .content(categories)
                        .build());
    }

    // Lấy Category theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getCategoryById(@PathVariable Integer id) {
        Optional<CategoryDTO> categoryOpt = categoryService.getCategoryById(id);
        if (categoryOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.OK)
                            .mess("Fetched category successfully")
                            .content(categoryOpt.get())
                            .build());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.NOT_FOUND)
                            .mess("Category not found with id: " + id)
                            .content(null)
                            .build());
        }
    }

    // Cập nhật Category
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateCategory(@PathVariable Integer id, @Valid @RequestBody CategoryDTO categoryDTO) {
        try {
            CategoryDTO updatedCategory = categoryService.saveCategory(categoryDTO);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.OK)
                            .mess("Category updated successfully")
                            .content(updatedCategory)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .mess("Error updating category: " + e.getMessage())
                            .content(null)
                            .build());
        }
    }

    // Xóa Category
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteCategory(@PathVariable Integer id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.NO_CONTENT)
                            .mess("Category deleted successfully")
                            .content(null)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .mess("Error deleting category: " + e.getMessage())
                            .content(null)
                            .build());
        }
    }
}
