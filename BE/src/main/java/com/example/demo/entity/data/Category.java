package com.example.demo.entity.data;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "name")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private LocalDateTime date;
    private boolean isDeleted = false;
    @ManyToMany(mappedBy = "categories")
//! không được sử dụng @JsonBackReference() với Collections
    @JsonIgnore
    private List<Course> courses = new ArrayList<>();
}
