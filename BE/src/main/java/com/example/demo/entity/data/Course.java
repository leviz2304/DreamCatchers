package com.example.demo.entity.data;

import com.example.demo.entity.user.User;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ManyToAny;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    private String video;

    private int price;

    private int discount;

    private LocalDateTime date;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String thumbnail;

    private String alias;

    private boolean isDeleted = false;

    @ManyToMany
    @JoinTable(
            name = "course_category",
            joinColumns = @JoinColumn(name = "course_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "id")
    )
    @Builder.Default
    private List<Category> categories = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Section> sections = new ArrayList<>();



    // New mapping: reference to the instructor
    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    @JsonIgnore // Bỏ qua instructor khi serialize Course

    private User instructor;

    // Additional utility methods if needed
    public void addCategory(Category category) {
        this.categories.add(category);
    }

    public void addSection(Section section) {
        this.sections.add(section);
    }

}
