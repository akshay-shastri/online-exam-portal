package com.examportal.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "violations")
public class Violation {

    @Id
    @GeneratedValue(
            strategy =
            GenerationType.IDENTITY
    )
    private Long id;

    private String studentName;

    private String examTitle;

    private String violationType;

    private LocalDateTime timestamp;

    public Violation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(
            String studentName
    ) {
        this.studentName = studentName;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public void setExamTitle(
            String examTitle
    ) {
        this.examTitle = examTitle;
    }

    public String getViolationType() {
        return violationType;
    }

    public void setViolationType(
            String violationType
    ) {
        this.violationType =
                violationType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(
            LocalDateTime timestamp
    ) {
        this.timestamp = timestamp;
    }
}