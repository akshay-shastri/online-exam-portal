package com.examportal.backend.repository;

import com.examportal.backend.entity.Violation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ViolationRepository
        extends JpaRepository<
        Violation,
        Long
        > {
}