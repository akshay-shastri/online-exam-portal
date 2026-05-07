package com.examportal.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    private String title;

    private String message;

    private String studentEmail;

    private boolean readStatus = false;

    private LocalDateTime createdAt;

    public Notification() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(
            String title
    ) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(
            String message
    ) {
        this.message = message;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(
            String studentEmail
    ) {
        this.studentEmail = studentEmail;
    }

    public boolean isReadStatus() {
        return readStatus;
    }

    public void setReadStatus(
            boolean readStatus
    ) {
        this.readStatus = readStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }
}