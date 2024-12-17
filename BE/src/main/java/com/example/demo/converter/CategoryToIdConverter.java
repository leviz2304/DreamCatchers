package com.example.demo.converter;

import com.example.demo.entity.data.Category;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.stereotype.Component;

@Component
public class CategoryToIdConverter implements Converter<Category, Integer> {

    @Override
    public Integer convert(MappingContext<Category, Integer> context) {
        Category source = context.getSource();
        return source != null ? source.getId() : null;
    }
}
