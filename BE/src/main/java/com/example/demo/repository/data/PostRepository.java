package com.example.demo.repository.data;

import com.example.demo.entity.data.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;

public interface PostRepository extends JpaRepository<Post, Integer> {
    Page<Post> findAll(@NonNull Pageable pageable);
    @Query("SELECT COUNT(p) FROM Post p WHERE p.isDeleted = false")
    int countActivePosts(); // Trả về kiểu int

}
