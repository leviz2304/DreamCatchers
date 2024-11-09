package com.example.demo.entity.data;


import com.example.demo.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String content;
    @ManyToOne
    private User user;
    private LocalDateTime date ;
    private String title;
    private boolean isDeleted = false;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Comment> comment;
}
