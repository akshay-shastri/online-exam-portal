package com.examportal.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "active_exam_sessions")
public class ActiveExamSession {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    private String studentEmail;

    private String studentName;

    private Long examId;

    private String examTitle;

    private int timeLeft;

    private int currentQuestionIndex;

    private int violations;

    private boolean submitted = false;

    private LocalDateTime startedAt;

    private LocalDateTime lastUpdatedAt;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String answersJson;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String bookmarksJson;

    public ActiveExamSession() {
    }

    public Long getId() {
        return id;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(
            String studentEmail
    ) {
        this.studentEmail = studentEmail;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(
            String studentName
    ) {
        this.studentName = studentName;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public void setExamTitle(
            String examTitle
    ) {
        this.examTitle = examTitle;
    }

    public int getTimeLeft() {
        return timeLeft;
    }

    public void setTimeLeft(int timeLeft) {
        this.timeLeft = timeLeft;
    }

    public int getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }

    public void setCurrentQuestionIndex(
            int currentQuestionIndex
    ) {
        this.currentQuestionIndex =
                currentQuestionIndex;
    }

    public int getViolations() {
        return violations;
    }

    public void setViolations(int violations) {
        this.violations = violations;
    }

    public boolean isSubmitted() {
        return submitted;
    }

    public void setSubmitted(
            boolean submitted
    ) {
        this.submitted = submitted;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(
            LocalDateTime startedAt
    ) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getLastUpdatedAt() {
        return lastUpdatedAt;
    }

    public void setLastUpdatedAt(
            LocalDateTime lastUpdatedAt
    ) {
        this.lastUpdatedAt =
                lastUpdatedAt;
    }

    public String getAnswersJson() {
        return answersJson;
    }

    public void setAnswersJson(
            String answersJson
    ) {
        this.answersJson = answersJson;
    }

    public String getBookmarksJson() {
        return bookmarksJson;
    }

    public void setBookmarksJson(
            String bookmarksJson
    ) {
        this.bookmarksJson =
                bookmarksJson;
    }
}