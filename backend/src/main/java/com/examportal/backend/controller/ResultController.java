package com.examportal.backend.controller;

import com.examportal.backend.entity.Result;
import com.examportal.backend.repository.ResultRepository;
import com.examportal.backend.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
// @CrossOrigin(origins = "http://localhost:5173")
// @CrossOrigin("*") 
@RestController
@RequestMapping("/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @Autowired
    private ResultRepository resultRepository;

    @PostMapping
    public Result saveResult(
            @RequestBody Result result
    ) {

        return resultService.saveResult(result);
    }

    // ANALYTICS API

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {

        List<Result> results =
                resultRepository.findAll();

        Set<String> uniqueStudents =
                new HashSet<>();

        Map<String, Integer> examAttempts =
                new HashMap<>();

        double totalPercentage = 0;

        int passCount = 0;

        for (Result result : results) {

            uniqueStudents.add(
                    result.getStudentName()
            );

            examAttempts.put(
                    result.getExamTitle(),
                    examAttempts.getOrDefault(
                            result.getExamTitle(),
                            0
                    ) + 1
            );

            totalPercentage +=
                    result.getPercentage();

            if (result.getPercentage() >= 40) {

                passCount++;
            }
        }

        double averageScore =
                results.isEmpty()
                        ? 0
                        : totalPercentage / results.size();

        double passPercentage =
                results.isEmpty()
                        ? 0
                        : ((double) passCount / results.size()) * 100;

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "totalAttempts",
                results.size()
        );

        response.put(
                "totalStudents",
                uniqueStudents.size()
        );

        response.put(
                "averageScore",
                Math.round(averageScore)
        );

        response.put(
                "passPercentage",
                Math.round(passPercentage)
        );

        response.put(
                "examAttempts",
                examAttempts
        );

        return response;
    }


    @GetMapping("/check/{studentName}/{examTitle}")
    public ResponseEntity<Map<String, Boolean>>
    checkAttempt(
            @PathVariable String studentName,
            @PathVariable String examTitle
    ) {

        boolean attempted =
                resultService.hasAttempted(
                        studentName,
                        examTitle
                );

        return ResponseEntity.ok(
                Map.of("attempted", attempted)
        );
    }

    @GetMapping("/leaderboard")
public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {

    List<Result> results = resultService.getAllResults();

    Map<String, List<Result>> grouped =
            results.stream()
                    .collect(Collectors.groupingBy(Result::getStudentName));

    List<Map<String, Object>> leaderboard = new ArrayList<>();

    for (String student : grouped.keySet()) {

        List<Result> studentResults = grouped.get(student);

        int attempts = studentResults.size();

        double averageScore =
        studentResults.stream()
                .mapToDouble(Result::getScore)
                .average()
                .orElse(0);


        Map<String, Object> data = new HashMap<>();

        data.put("studentName", student);
        data.put("attempts", attempts);
data.put("averageScore", Math.round(averageScore * 100.0) / 100.0);
        leaderboard.add(data);
    }
leaderboard.sort((a, b) ->
        Double.compare(
                (Double) b.get("averageScore"),
                (Double) a.get("averageScore")
        )
);

    return ResponseEntity.ok(leaderboard);
}


@GetMapping
public List<Result> getAllResults() {

    return resultService
            .getAllResults();
}

    @GetMapping("/{studentName}")
    public List<Result> getResultsByStudentName(
            @PathVariable String studentName
    ) {

        return resultService
                .getResultsByStudentName(studentName);
    }

    

}