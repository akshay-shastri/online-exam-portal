package com.examportal.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Smart Exam Portal - Email Verification"
        );

        message.setText(
                "Your OTP for email verification is: "
                        + otp +
                        "\n\nThis OTP will expire in 5 minutes."
        );

        mailSender.send(message);
    }

    public void sendResultEmail(
        String toEmail,
        String studentName,
        String examTitle,
        double score,
        double percentage
) {

    String status =
            percentage >= 40
                    ? "PASSED"
                    : "FAILED";

    SimpleMailMessage message =
            new SimpleMailMessage();

    message.setTo(toEmail);

    message.setSubject(
            "Exam Result - " + examTitle
    );

    message.setText(

            "Hello " + studentName + ",\n\n" +

            "Your exam has been completed successfully.\n\n" +

            "Exam: " + examTitle + "\n" +

            "Score: " + score + "\n" +

            "Percentage: " + percentage + "%\n" +

            "Status: " + status + "\n\n" +

            "Thank you for using Smart Exam Portal.");

    mailSender.send(message);
}

public void sendReminderEmail(
        String toEmail,
        String studentName,
        String examTitle,
        String examTime
) {

    SimpleMailMessage message =
            new SimpleMailMessage();

    message.setTo(toEmail);

    message.setSubject(
            "Upcoming Exam Reminder"
    );

    message.setText(

            "Hello " + studentName + ",\n\n" +

            "Reminder: Your exam is scheduled soon.\n\n" +

            "Exam: " + examTitle + "\n" +

            "Start Time: " + examTime + "\n\n" +

            "Please be prepared before the exam begins.\n\n" +

            "Best of luck!\n" +

            "Smart Exam Portal"
    );

    mailSender.send(message);
}

}