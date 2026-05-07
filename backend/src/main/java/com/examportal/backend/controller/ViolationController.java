package com.examportal.backend.controller;

import com.examportal.backend.entity.Violation;

import com.examportal.backend.service.ViolationService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/violations")
@CrossOrigin("*")
public class ViolationController {

    @Autowired
    private ViolationService
            violationService;

    @PostMapping
    public Violation saveViolation(
            @RequestBody Violation violation
    ) {

        return violationService
                .saveViolation(violation);
    }

    @GetMapping
    public List<Violation>
    getAllViolations() {

        return violationService
                .getAllViolations();
    }
}