package com.example.demo.service;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.entity.data.Category;
import com.example.demo.repository.data.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Tạo mới hoặc cập nhật Category
    @Transactional
    public CategoryDTO saveCategory(CategoryDTO categoryDTO) {
        Category category = modelMapper.map(categoryDTO, Category.class);
        Category savedCategory = categoryRepository.save(category);
        return modelMapper.map(savedCategory, CategoryDTO.class);
    }

    // Lấy tất cả các Category
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .collect(Collectors.toList());
    }

    // Lấy Category theo ID
    public Optional<CategoryDTO> getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .map(category -> modelMapper.map(category, CategoryDTO.class));
    }

    // Xóa Category
    @Transactional
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
