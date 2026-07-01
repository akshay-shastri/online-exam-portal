package com.examportal.backend.service;

import com.examportal.backend.entity.Exam;
import com.examportal.backend.entity.Notification;
import com.examportal.backend.entity.User;

import com.examportal.backend.repository.ExamRepository;
import com.examportal.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.scheduling.annotation.Scheduled;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;

@Service
public class ReminderScheduler {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService
            notificationService;

    @Scheduled(fixedRate = 60000)
    public void sendExamReminders() {

        List<Exam> exams =
                examRepository.findAll();

        List<User> users =
                userRepository.findAll();

        LocalDateTime now =
                LocalDateTime.now();

        for (Exam exam : exams) {

            if (exam.getStartTime() == null)
                continue;

            long minutes =
                    java.time.Duration
                            .between(
                                    now,
                                    exam.getStartTime()
                            )
                            .toMinutes();

            if (minutes >= 0 &&
                    minutes <= 60) {

                
                for (User user : users) {

    if (!"STUDENT".equalsIgnoreCase(
            user.getRole()
    )) {
        continue;
    }

    String message =
            exam.getTitle()
            + " starts within 1 hour";

    boolean alreadySent =
            notificationService
                    .notificationExists(
                            user.getEmail(),
                            message
                    );

    if (alreadySent) {
        continue;
    }

    try {

//         emailService
//                 .sendReminderEmail(
//                         user.getEmail(),
//                         user.getName(),
//                         exam.getTitle(),
//                         exam.getStartTime()
//     .format(
//         java.time.format.DateTimeFormatter.ofPattern(
//             "dd MMM yyyy hh:mm a"
//         )
//     )
//                 );

        Notification notification =
                new Notification();

        notification.setTitle(
                "Upcoming Exam"
        );

        notification.setMessage(
                message
        );

        notification.setStudentEmail(
                user.getEmail()
        );

        notificationService
                .saveNotification(
                        notification
                );

    } catch (Exception e) {

        System.out.println(
                e.getMessage()
        );
    }
}
            }
        }
    }
}