package com.examportal.backend.service;
import com.examportal.backend.dto.ExamCandidateDTO;
import com.examportal.backend.entity.ExamRegistration;
import com.examportal.backend.entity.Exam;
import com.examportal.backend.entity.Result;
import com.examportal.backend.repository.ExamRegistrationRepository;
import com.examportal.backend.repository.ExamRepository;
import com.examportal.backend.repository.ResultRepository;
import com.examportal.backend.repository.ViolationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExamCandidateService {

    @Autowired
    private ExamRegistrationRepository registrationRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ExamRepository examRepository;
        
    @Autowired
    private ViolationRepository violationRepository;

    public List<ExamCandidateDTO> getCandidates(Long examId) {

                Exam exam = examRepository.findById(examId).orElseThrow();
                List<ExamRegistration> registrations = registrationRepository.findByExamId(examId);
                List<ExamCandidateDTO> response = new ArrayList<>();

                for (ExamRegistration reg : registrations) {
                ExamCandidateDTO dto =  new ExamCandidateDTO();
                dto.setStudentName( reg.getStudentName() );
                dto.setStudentEmail( reg.getStudentEmail());
                dto.setRegisteredAt( reg.getRegisteredAt());
                List<Result> studentResults = resultRepository.findByEmailOrderBySubmittedAtDesc(reg.getStudentEmail() );
                Result result = null;
                for (Result r : studentResults) {

                        if (r.getExamTitle() != null && r.getExamTitle().equalsIgnoreCase(exam.getTitle())) {
                                result = r;
                                break;
                        }
                        }

                        if (result != null) {
                                dto.setResultId( result.getId() );
                                dto.setAttempted(true);
                                dto.setStartedAt(result.getStartedAt() );
                                dto.setSubmittedAt( result.getSubmittedAt());
                                dto.setScore( result.getScore());
                                dto.setPercentage( result.getPercentage());
                                dto.setViolationCount(violationRepository .countByStudentNameAndExamTitle(   reg.getStudentName(),exam.getTitle() ));
                        }
                        else {
                                dto.setAttempted(false);
                        }

                response.add(dto);
        }

        return response;
    }
}