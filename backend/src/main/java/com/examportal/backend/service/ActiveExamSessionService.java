package com.examportal.backend.service;

import com.examportal.backend.entity.ActiveExamSession;

import com.examportal.backend.repository.ActiveExamSessionRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.Optional;

@Service
public class ActiveExamSessionService {

    @Autowired
    private ActiveExamSessionRepository
            repository;

    public ActiveExamSession saveSession(

            ActiveExamSession session

    ) {

        session.setLastUpdatedAt(
                LocalDateTime.now()
        );

        if (session.getStartedAt() == null) {

            session.setStartedAt(
                    LocalDateTime.now()
            );
        }

        return repository.save(session);
    }

    public Optional<ActiveExamSession>
    getActiveSession(

            String email,

            Long examId

    ) {

        return repository
                .findFirstByStudentEmailAndExamIdAndSubmittedFalseOrderByLastUpdatedAtDesc(
                        email,
                        examId
                );
    }

    public void markSubmitted(

            String email,

            Long examId

    ) {

        Optional<ActiveExamSession>
                optionalSession =
                repository
                        .findFirstByStudentEmailAndExamIdAndSubmittedFalseOrderByLastUpdatedAtDesc(
                                email,
                                examId
                        );

        if (optionalSession.isPresent()) {

            ActiveExamSession session =
                    optionalSession.get();

            session.setSubmitted(true);

            session.setLastUpdatedAt(
                    LocalDateTime.now()
            );

            repository.save(session);
        }
    }
}