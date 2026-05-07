package com.examportal.backend.repository;

import com.examportal.backend.entity.Notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification>
    findByStudentEmailOrderByCreatedAtDesc(
            String studentEmail
    );

    boolean existsByStudentEmailAndMessage(
            String studentEmail,
            String message
    );
}