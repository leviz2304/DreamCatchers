package com.example.demo.repository.data;

import com.example.demo.entity.data.UserEssay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserEssayRepository extends JpaRepository<UserEssay,Integer> {
    List<UserEssay>findAllByUserId(int userId);

}
