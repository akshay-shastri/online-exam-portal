package com.examportal.backend.repository;

import com.examportal.backend.entity.ExamRegistration;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface
ExamRegistrationRepository
extends JpaRepository<
        ExamRegistration,
        Long
> {

    boolean existsByExamIdAndStudentEmail(
        Long examId,
        String studentEmail
    );

    List<ExamRegistration>
    findByExamId(Long examId);

    long countByExamId(Long examId);
}