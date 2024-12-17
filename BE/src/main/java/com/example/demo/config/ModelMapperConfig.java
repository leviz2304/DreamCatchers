package com.example.demo.config;

import com.example.demo.converter.CategoryToIdConverter;
import com.example.demo.converter.IdToCategoryConverter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Autowired
    private CategoryToIdConverter categoryToIdConverter;

    @Autowired
    private IdToCategoryConverter idToCategoryConverter;

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        // Thiết lập chiến lược ánh xạ
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);

        // Đăng ký các converter
        modelMapper.addConverter(categoryToIdConverter);
        modelMapper.addConverter(idToCategoryConverter);

        return modelMapper;
    }
}
