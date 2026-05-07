package com.examportal.backend.service;

import com.examportal.backend.entity.Question;
import com.examportal.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    public List<Question> getQuestionsByExam(Long examId) {
        return questionRepository.findByExamId(examId);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public Question updateQuestion(
        Long id,
        Question updatedQuestion
) {

    Question question =
            questionRepository.findById(id)
                    .orElseThrow();

    question.setQuestionText(
            updatedQuestion.getQuestionText()
    );

    question.setOptionA(
            updatedQuestion.getOptionA()
    );

    question.setOptionB(
            updatedQuestion.getOptionB()
    );

    question.setOptionC(
            updatedQuestion.getOptionC()
    );

    question.setOptionD(
            updatedQuestion.getOptionD()
    );

    question.setCorrectAnswer(
            updatedQuestion.getCorrectAnswer()
    );

    return questionRepository.save(question);
    }


}