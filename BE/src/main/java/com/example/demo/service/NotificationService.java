package com.example.demo.service;

import com.example.demo.entity.data.Notification;
import com.example.demo.repository.data.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private  final NotificationRepository notificationRepository;

    public Notification getNotificationById(int id) {
        return notificationRepository.findById(id).orElse(null);
    }

    public Notification readNotification(int id) {
        var notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return null;
        }
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
    public List<Notification> readAllNotification(int id) {
        var notifications = notificationRepository.findAllByUserIdOrderByDateDesc(id).orElse(null);
        if (notifications == null) {
            return null;
        }
        for (var notification : notifications ) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
        return notifications;
    }
    public List<Notification> removeAllNotificationsByEmail(int id) {
        var notifications = notificationRepository.findAllByUserIdOrderByDateDesc(id).orElse(null);
        if (notifications == null) {
            return null;
        }
        for (var notification : notifications ) {
            notification.setRead(true);
            notificationRepository.delete(notification);
        }
        return notifications;
    }
    public List<Notification> getAllNotificationsByEmail(int userId) {
        return notificationRepository.findAllByUserIdOrderByDateDesc(userId).orElse(null);
    }
}
