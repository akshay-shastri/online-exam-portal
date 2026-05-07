package com.examportal.backend.service;

import com.examportal.backend.entity.Notification;

import com.examportal.backend.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository
            notificationRepository;

    public Notification saveNotification(
            Notification notification
    ) {

        notification.setCreatedAt(
                LocalDateTime.now()
        );

        return notificationRepository
                .save(notification);
    }

    public List<Notification>
    getNotificationsByEmail(
            String email
    ) {

        return notificationRepository
                .findByStudentEmailOrderByCreatedAtDesc(
                        email
                );
    }

    public boolean notificationExists(
        String email,
        String message
) {

    return notificationRepository
            .existsByStudentEmailAndMessage(
                    email,
                    message
            );
}
}