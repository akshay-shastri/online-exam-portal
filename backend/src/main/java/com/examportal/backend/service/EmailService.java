package com.examportal.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class EmailService {

    @Value("${BREVO_API_KEY}")
    private String apiKey;

    private void sendEmail(
            String toEmail,
            String subject,
            String content
    ) {

        try {

            URL url =
                    new URL("https://api.brevo.com/v3/smtp/email");

            HttpURLConnection conn =
                    (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");

            conn.setRequestProperty(
                    "accept",
                    "application/json"
            );

            conn.setRequestProperty(
                    "api-key",
                    apiKey
            );

            conn.setRequestProperty(
                    "content-type",
                    "application/json"
            );

            conn.setDoOutput(true);

            String body = """
            {
              "sender":{
                "name":"Smart Exam Portal",
                "email":"akshayshastri2474@gmail.com"
              },
              "to":[{"email":"%s"}],
              "subject":"%s",
              "htmlContent":"%s"
            }
            """.formatted(
                    toEmail,
                    subject,
                    content.replace("\"", "\\\"")
            );

            try (OutputStream os = conn.getOutputStream()) {

                byte[] input =
                        body.getBytes("utf-8");

                os.write(
                        input,
                        0,
                        input.length
                );
            }

            int responseCode =
                    conn.getResponseCode();

            System.out.println(
                    "Brevo API Response: "
                            + responseCode
            );

        } catch (Exception e) {

            e.printStackTrace();
        }
    }

    public void sendOtpEmail(
            String toEmail,
            String otp
    ) {

        sendEmail(
                toEmail,
                "Smart Exam Portal - Email Verification",
                "<h2>Your OTP is: "
                        + otp
                        + "</h2><p>This OTP will expire in 5 minutes.</p>"
        );
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

        sendEmail(
                toEmail,
                "Exam Result - " + examTitle,
                "<h2>Hello " + studentName + "</h2>"
                        + "<p>Exam: " + examTitle + "</p>"
                        + "<p>Score: " + score + "</p>"
                        + "<p>Percentage: " + percentage + "%</p>"
                        + "<p>Status: " + status + "</p>"
        );
    }

    public void sendReminderEmail(
            String toEmail,
            String studentName,
            String examTitle,
            String examTime
    ) {

        sendEmail(
                toEmail,
                "Upcoming Exam Reminder",
                "<h2>Hello " + studentName + "</h2>"
                        + "<p>Your exam is scheduled soon.</p>"
                        + "<p>Exam: " + examTitle + "</p>"
                        + "<p>Start Time: " + examTime + "</p>"
        );
    }

    public void sendExamCreatedEmail(
            String toEmail,
            String studentName,
            String examTitle,
            String examTime
    ) {

        sendEmail(
                toEmail,
                "Exam Scheduled Successfully",
                "<h2>Hello " + studentName + "</h2>"
                        + "<p>A new exam has been scheduled.</p>"
                        + "<p>Exam: " + examTitle + "</p>"
                        + "<p>Start Time: " + examTime + "</p>"
        );
    }
}