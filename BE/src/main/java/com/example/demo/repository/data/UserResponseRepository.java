package com.example.demo.repository.data;

import com.example.demo.entity.data.UserResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserResponseRepository extends JpaRepository<UserResponse, Integer> {

}
