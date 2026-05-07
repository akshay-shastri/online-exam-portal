package com.examportal.backend.service;

import com.examportal.backend.entity.Exam;
import com.examportal.backend.repository.ExamRepository;
import com.examportal.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.examportal.backend.entity.User;
import com.examportal.backend.repository.UserRepository;
import java.time.format.DateTimeFormatter;

import java.util.List;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public Exam createExam(Exam exam) {

    Exam savedExam =
            examRepository.save(exam);

    List<User> users =
            userRepository.findAll();

    String formattedStartTime =
            exam.getStartTime()
                    .format(
                            DateTimeFormatter.ofPattern(
                                    "dd MMM yyyy hh:mm a"
                            )
                    );

    for (User user : users) {

        if (!"STUDENT".equalsIgnoreCase(
                user.getRole()
        )) {
            continue;
        }

        try {

            emailService.sendExamCreatedEmail(
                    user.getEmail(),
                    user.getName(),
                    savedExam.getTitle(),
                    formattedStartTime
            );

        } catch (Exception e) {

            e.printStackTrace();
        }
    }

    return savedExam;
}

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @Transactional
    public void deleteExam(Long examId) {
        questionRepository.deleteAll(questionRepository.findByExamId(examId));
        examRepository.deleteById(examId);
    }
}