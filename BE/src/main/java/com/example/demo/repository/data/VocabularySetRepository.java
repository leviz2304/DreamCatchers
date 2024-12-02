package com.example.demo.repository.data;

import com.example.demo.entity.data.VocabularySet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabularySetRepository extends JpaRepository<VocabularySet, Integer> {
    List<VocabularySet> findByUserId(Integer userId);

}
