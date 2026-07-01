package com.examportal.backend.entity;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "exams")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private int duration;

    private double positiveMarks;

    private double negativeMarks;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;

    private boolean active = true;

    private Integer maxAttempts = 1;

    private String examType = "MAIN";

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime registrationStart;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime registrationEnd;

    private boolean reviewEnabled = false;

    private boolean proctoringEnabled = true;

    public Exam() {
    }

    public Exam(
        Long id,
        String title,
        int duration,
        double positiveMarks,
        double negativeMarks
) {
    this.id = id;
    this.title = title;
    this.duration = duration;
    this.positiveMarks = positiveMarks;
    this.negativeMarks = negativeMarks;
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

    public void setTitle(String title) {
        this.title = title;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public double getPositiveMarks() {
    return positiveMarks;
    }

    public void setPositiveMarks(double positiveMarks) {
        this.positiveMarks = positiveMarks;
    }

    public double getNegativeMarks() {
        return negativeMarks;
    }

    public void setNegativeMarks(double negativeMarks) {
        this.negativeMarks = negativeMarks;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(
            LocalDateTime startTime
    ) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(
            LocalDateTime endTime
    ) {
        this.endTime = endTime;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getExamType() {
        return examType;
    }

    public void setExamType(String examType) {
        this.examType = examType;
    }

    public LocalDateTime getRegistrationStart() {
        return registrationStart;
    }

    public void setRegistrationStart(
            LocalDateTime registrationStart
    ) {
        this.registrationStart =
                registrationStart;
    }

    public LocalDateTime getRegistrationEnd() {
        return registrationEnd;
    }

    public void setRegistrationEnd(
            LocalDateTime registrationEnd
    ) {
        this.registrationEnd =
                registrationEnd;
    }

    public int getMaxAttempts() {
        return maxAttempts;
    }


    public boolean isReviewEnabled() {
        return reviewEnabled;
    }

    public void setReviewEnabled(
            boolean reviewEnabled
    ) {
        this.reviewEnabled =
                reviewEnabled;
    }

    public boolean isProctoringEnabled() {
        return proctoringEnabled;
    }

    public void setProctoringEnabled(
            boolean proctoringEnabled
    ) {
        this.proctoringEnabled =
                proctoringEnabled;
    }


    public void setMaxAttempts(
            Integer maxAttempts
    ) {
        this.maxAttempts =
            maxAttempts;
    }

}