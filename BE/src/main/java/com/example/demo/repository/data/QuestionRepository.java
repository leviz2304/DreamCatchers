package com.example.demo.repository.data;
import com.example.demo.entity.data.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question,Integer> {
    List<Question> findByPassage_Test_Id(int testId);
    List<Question> findByListeningSection_Test_Id(int testId);


}
