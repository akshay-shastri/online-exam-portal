package com.examportal.backend.service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    private final OkHttpClient client =
            new OkHttpClient();

    private void sendEmail(
            String toEmail,
            String subject,
            String body
    ) {

        MediaType mediaType =
                MediaType.parse(
                        "application/json"
                );

        String json = """
        {
          "from": "Smart Exam Portal <onboarding@resend.dev>",
          "to": ["%s"],
          "subject": "%s",
          "text": "%s"
        }
        """.formatted(
                toEmail,
                subject,
                body.replace("\n", "\\n")
        );

        RequestBody requestBody =
                RequestBody.create(
                        json,
                        mediaType
                );

        Request request =
                new Request.Builder()
                        .url(
                                "https://api.resend.com/emails"
                        )
                        .post(requestBody)
                        .addHeader(
                                "Authorization",
                                "Bearer " + resendApiKey
                        )
                        .addHeader(
                                "Content-Type",
                                "application/json"
                        )
                        .build();

        try (
                Response response =
                        client.newCall(request).execute()
        ) {

            if (!response.isSuccessful()) {

                System.out.println(response.body().string()
);

                throw new RuntimeException(
                        "Failed to send email"
                );
            }

        } catch (IOException e) {

            throw new RuntimeException(e);
        }
    }

    public void sendOtpEmail(
            String toEmail,
            String otp
    ) {

        String subject =
                "Smart Exam Portal - Email Verification";

        String body =
                "Your OTP for email verification is: "
                        + otp
                        + "\n\nThis OTP will expire in 5 minutes.";

        sendEmail(
                toEmail,
                subject,
                body
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

        String subject =
                "Exam Result - " + examTitle;

        String body =

                "Hello " + studentName + ",\n\n"

                        + "Your exam has been completed successfully.\n\n"

                        + "Exam: " + examTitle + "\n"

                        + "Score: " + score + "\n"

                        + "Percentage: " + percentage + "%\n"

                        + "Status: " + status + "\n\n"

                        + "Thank you for using Smart Exam Portal.";

        sendEmail(
                toEmail,
                subject,
                body
        );
    }

    public void sendReminderEmail(
            String toEmail,
            String studentName,
            String examTitle,
            String examTime
    ) {

        String subject =
                "Upcoming Exam Reminder";

        String body =

                "Hello " + studentName + ",\n\n"

                        + "Reminder: Your exam is scheduled soon.\n\n"

                        + "Exam: " + examTitle + "\n"

                        + "Start Time: " + examTime + "\n\n"

                        + "Please be prepared before the exam begins.\n\n"

                        + "Best of luck!\n"

                        + "Smart Exam Portal";

        sendEmail(
                toEmail,
                subject,
                body
        );
    }

    public void sendExamCreatedEmail(
            String toEmail,
            String studentName,
            String examTitle,
            String examTime
    ) {

        String subject =
                "Exam Scheduled Successfully";

        String body =

                "Hello " + studentName + ",\n\n"

                        + "A new exam has been scheduled for you.\n\n"

                        + "Exam: " + examTitle + "\n"

                        + "Start Time: " + examTime + "\n\n"

                        + "Please login to the Smart Exam Portal before the exam starts.\n\n"

                        + "Best of luck!\n"

                        + "Smart Exam Portal";

        sendEmail(
                toEmail,
                subject,
                body
        );
    }
}