package com.examportal.backend.service;

import com.examportal.backend.entity.Exam;
import com.examportal.backend.repository.ExamRepository;
import com.examportal.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
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