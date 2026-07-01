package com.examportal.backend.controller;

import com.examportal.backend.dto.ExamCandidateDTO;
import com.examportal.backend.service.ExamCandidateService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/exam")
public class ExamCandidateController {

    @Autowired
    private ExamCandidateService service;

    @GetMapping("/{examId}/candidates")
    public List<ExamCandidateDTO> getCandidates(
            @PathVariable Long examId
    ) {

        return service.getCandidates(
                examId
        );
    }
}