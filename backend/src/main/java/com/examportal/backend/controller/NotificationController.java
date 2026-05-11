package com.examportal.backend.controller;

import com.examportal.backend.entity.Notification;

import com.examportal.backend.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService
            notificationService;

    @PostMapping
    public Notification saveNotification(
            @RequestBody Notification notification
    ) {

        return notificationService
                .saveNotification(notification);
    }

    @GetMapping("/{email}")
    public List<Notification>
    getNotifications(
            @PathVariable String email
    ) {

        return notificationService
                .getNotificationsByEmail(
                        email
                );
    }
}