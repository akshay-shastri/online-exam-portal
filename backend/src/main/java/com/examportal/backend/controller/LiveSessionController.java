package com.examportal.backend.controller;

import java.util.List;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.examportal.backend.entity.LiveSession;
import com.examportal.backend.repository.LiveSessionRepository;

@RestController
@RequestMapping("/monitor")
@CrossOrigin(origins = "*")
public class LiveSessionController {

    @Autowired
    private LiveSessionRepository repository;

    @PostMapping("/update")
    public LiveSession updateSession(
            @RequestBody LiveSession session
    ) {

        Optional<LiveSession> existing =
                repository.findByStudentNameAndExamTitle(
                        session.getStudentName(),
                        session.getExamTitle()
                );

        if (existing.isPresent()) {

            LiveSession s = existing.get();

            s.setViolations(
                    session.getViolations()
            );

            s.setTimeLeft(
                    session.getTimeLeft()
            );

            s.setStatus(
                    session.getStatus()
            );

            return repository.save(s);
        }

        return repository.save(session);
    }

    @GetMapping("/live")
    public List<LiveSession> getLiveSessions() {

        return repository.findAll();
    }
}