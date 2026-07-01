package com.examportal.backend.repository;

import com.examportal.backend.entity.ActiveExamSession;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActiveExamSessionRepository
        extends JpaRepository<
        ActiveExamSession,
        Long
        > {

    Optional<ActiveExamSession>
    findFirstByStudentEmailAndExamIdAndSubmittedFalseOrderByLastUpdatedAtDesc(

            String studentEmail,

            Long examId
    );
}