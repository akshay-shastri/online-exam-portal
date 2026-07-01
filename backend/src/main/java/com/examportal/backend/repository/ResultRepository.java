package com.examportal.backend.repository;

import com.examportal.backend.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository
        extends JpaRepository<Result, Long> {

    List<Result> findByStudentNameOrderBySubmittedAtDesc(
            String studentName
    );

    List<Result> findByEmailOrderBySubmittedAtDesc(
        String email
    );

    Result findByEmailAndExamTitle(
        String email,
        String examTitle
    );

    Result findById(long id);

    boolean existsByStudentNameAndExamTitle(
            String studentName,
            String examTitle
    );

    long count();

    List<Result> findAll();
}