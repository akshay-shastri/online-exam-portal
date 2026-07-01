package com.examportal.backend.service;

import com.examportal.backend.entity.Result;
import com.examportal.backend.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private EmailService emailService;

    public Result saveResult(Result result) {

    if (result.getStartedAt() == null) {
        result.setStartedAt(LocalDateTime.now());
    }

    result.setSubmittedAt(LocalDateTime.now());

    Result savedResult =
            resultRepository.save(result);

if (
        result.getEmail() != null &&
        !result.getEmail().isEmpty()
) {

    emailService.sendResultEmail(
            result.getEmail(),
            result.getStudentName(),
            result.getExamTitle(),
            result.getScore(),
            result.getPercentage()
    );
}

return savedResult;
    }

    public List<Result> getResultsByStudentName(
            String studentName
    ) {

        return resultRepository
                .findByStudentNameOrderBySubmittedAtDesc(studentName);
    }

    public List<Result> getResultsByEmail(
        String email
   ) {

        return resultRepository
            .findByEmailOrderBySubmittedAtDesc(email);
    }

    public boolean hasAttempted(
            String studentName,
            String examTitle
    ) {

        return resultRepository
                .existsByStudentNameAndExamTitle(
                        studentName,
                        examTitle
                );
    }

    public List<Result> getAllResults() {

        return resultRepository.findAll();
    }
}