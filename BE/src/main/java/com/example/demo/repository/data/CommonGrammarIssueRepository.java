package com.example.demo.repository.data;

import com.example.demo.entity.data.CommonGrammarIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommonGrammarIssueRepository extends JpaRepository<CommonGrammarIssue, Integer> {
    CommonGrammarIssue findTopByUserIdOrderByCreatedAtDesc(Integer userId);
}
