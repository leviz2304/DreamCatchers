package com.example.demo.converter;

import com.example.demo.entity.data.Category;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.stereotype.Component;

@Component
public class IdToCategoryConverter implements Converter<Integer, Category> {

    @Override
    public Category convert(MappingContext<Integer, Category> context) {
        Integer source = context.getSource();
        if (source == null) {
            return null;
        }
        // Tạo một Category với ID đã cho. Bạn có thể fetch từ database nếu cần.
        return Category.builder().id(source).build();
    }
}
