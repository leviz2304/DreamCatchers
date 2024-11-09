package com.example.demo.repository.data;

import com.example.demo.entity.data.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    Optional<List<Notification>> findAllByUserIdOrderByDateDesc(int userId);



}
