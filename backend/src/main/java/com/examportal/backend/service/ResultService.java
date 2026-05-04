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

    public Result saveResult(Result result) {
        result.setSubmittedAt(LocalDateTime.now());
        return resultRepository.save(result);
    }

    public List<Result> getResultsByStudentName(String studentName) {
        return resultRepository.findByStudentNameOrderBySubmittedAtDesc(studentName);
    }
}
