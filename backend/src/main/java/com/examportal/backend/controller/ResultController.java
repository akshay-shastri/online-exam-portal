package com.examportal.backend.controller;

import com.examportal.backend.entity.Result;
import com.examportal.backend.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/results")
@CrossOrigin("*")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @PostMapping
    public Result saveResult(@RequestBody Result result) {
        return resultService.saveResult(result);
    }

    @GetMapping("/{studentName}")
    public List<Result> getResultsByStudentName(@PathVariable String studentName) {
        return resultService.getResultsByStudentName(studentName);
    }
}
