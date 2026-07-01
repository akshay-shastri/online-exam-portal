package com.examportal.backend.controller;

import com.examportal.backend.entity.ExamRegistration;
import com.examportal.backend.repository.ExamRegistrationRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import java.util.List;

@RestController
@RequestMapping(
    "/registrations"
)
public class
ExamRegistrationController {

    @Autowired
    private
    ExamRegistrationRepository
    registrationRepository;

    @PostMapping
    public ExamRegistration register(
        @RequestBody
        ExamRegistration registration
    ) {

        registration.setRegisteredAt(
            LocalDateTime.now()
        );

        return registrationRepository
            .save(registration);
    }

    @GetMapping("/{examId}")
    public List<ExamRegistration>
    getRegistrations(
        @PathVariable Long examId
    ) {

        return registrationRepository
            .findByExamId(examId);
    }

    @GetMapping(
        "/check/{examId}/{email}"
    )
    public boolean isRegistered(

        @PathVariable Long examId,

        @PathVariable String email
    ) {

        return registrationRepository
            .existsByExamIdAndStudentEmail(
                examId,
                email
            );
    }

    @GetMapping(
        "/count/{examId}"
    )
    public long countRegistrations(
        @PathVariable Long examId
    ) {

        return registrationRepository
            .countByExamId(examId);
    }
}