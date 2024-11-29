package com.example.demo.repository.data;
import com.example.demo.entity.data.QuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface QuestionOptionRepository extends JpaRepository<QuestionOption,Integer> {

}
