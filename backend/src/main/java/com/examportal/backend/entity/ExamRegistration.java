package com.examportal.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "exam_registrations",
    uniqueConstraints = {

        @UniqueConstraint(
            columnNames = {
                "exam_id",
                "student_email"
            }
        )
    }
)
public class ExamRegistration {

    @Id
    @GeneratedValue(
        strategy =
            GenerationType.IDENTITY
    )
    private Long id;

    private Long examId;

    private String studentName;

    private String studentEmail;

    private LocalDateTime registeredAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(
            String studentName
    ) {
        this.studentName =
            studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(
            String studentEmail
    ) {
        this.studentEmail =
            studentEmail;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(
            LocalDateTime registeredAt
    ) {
        this.registeredAt =
            registeredAt;
    }
}