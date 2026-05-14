package com.examportal.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examportal.backend.entity.LiveSession;

public interface LiveSessionRepository
        extends JpaRepository<LiveSession, Long> {

    Optional<LiveSession>
    findByStudentNameAndExamTitle(
            String studentName,
            String examTitle
    );
}