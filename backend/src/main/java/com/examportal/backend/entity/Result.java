package com.examportal.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;



@Entity
@Table(name = "results")
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;

    private String examTitle;

    private double score;

    private int totalQuestions;

    private double percentage;

    private String email;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String startFaceImage;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String endFaceImage;

    private LocalDateTime submittedAt;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String questionsJson;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String answersJson;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String violationTimelineJson;

    public Result() {
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

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getStartFaceImage() {
    return startFaceImage;
}

    public void setStartFaceImage(String startFaceImage) {
        this.startFaceImage = startFaceImage;
    }

    public String getEndFaceImage() {
    return endFaceImage;
}

    public void setEndFaceImage(String endFaceImage) {
        this.endFaceImage = endFaceImage;
    }


    public String getQuestionsJson() {
    return questionsJson;
}

    public void setQuestionsJson(
            String questionsJson
    ) {
        this.questionsJson = questionsJson;
    }

    public String getAnswersJson() {
        return answersJson;
    }

    public void setAnswersJson(
            String answersJson
    ) {
        this.answersJson = answersJson;
    }

    public String getViolationTimelineJson() {
    return violationTimelineJson;
}

    public void setViolationTimelineJson(
            String violationTimelineJson
    ) {
        this.violationTimelineJson = violationTimelineJson;
    }
}
