package com.examportal.backend.controller;

import com.examportal.backend.entity.Question;
import com.examportal.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@CrossOrigin("*")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        return questionService.addQuestion(question);
    }

    @GetMapping("/{examId}")
    public List<Question> getQuestions(@PathVariable Long examId) {
        return questionService.getQuestionsByExam(examId);
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }

    @PutMapping("/{id}")
    public Question updateQuestion(
        @PathVariable Long id,
        @RequestBody Question question
    ) {

    return questionService.updateQuestion(
            id,
            question
    );
    }
}