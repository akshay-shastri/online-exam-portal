package com.examportal.backend.service;

import com.examportal.backend.entity.Violation;

import com.examportal.backend.repository.ViolationRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;

@Service
public class ViolationService {

    @Autowired
    private ViolationRepository
            violationRepository;

    public Violation saveViolation(
            Violation violation
    ) {

        violation.setTimestamp(
                LocalDateTime.now()
        );

        return violationRepository
                .save(violation);
    }

    public List<Violation>
    getAllViolations() {

        return violationRepository
                .findAll();
    }
}