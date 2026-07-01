package com.examportal.backend.controller;

import com.examportal.backend.entity.ActiveExamSession;

import com.examportal.backend.service.ActiveExamSessionService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/active-sessions")
@CrossOrigin(origins = "*")
public class ActiveExamSessionController {

    @Autowired
    private ActiveExamSessionService
            service;

    @PostMapping("/save")
    public ActiveExamSession saveSession(

            @RequestBody
            ActiveExamSession session

    ) {

        return service.saveSession(
                session
        );
    }

    @GetMapping("/restore")
    public ResponseEntity<?> restoreSession(

            @RequestParam String email,

            @RequestParam Long examId

    ) {

        Optional<ActiveExamSession>
                session =
                service.getActiveSession(
                        email,
                        examId
                );

        if (session.isPresent()) {

            return ResponseEntity.ok(
                    session.get()
            );
        }

        return ResponseEntity
                .notFound()
                .build();
    }

    @PostMapping("/submit")
    public ResponseEntity<?> markSubmitted(

            @RequestParam String email,

            @RequestParam Long examId

    ) {

        service.markSubmitted(
                email,
                examId
        );

        return ResponseEntity.ok().build();
    }
}