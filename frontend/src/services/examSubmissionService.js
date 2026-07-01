import API from "./api";

export const submitExamService =
    async ({ questions,answers, examId,violations, startFaceImage,endFaceImage,violationTimeline, captureFaceSnapshot,streamRef,faceIntervalRef }) => {

        let correctAnswers = 0;
        let wrongAnswers = 0;
        const positiveMarks = questions[0]?.exam?.positiveMarks || 1;
        const negativeMarks = questions[0]?.exam?.negativeMarks || 0;
        questions.forEach((question) => {

            const selected = answers[question.id];
            if (!selected) return;
            const correctOptionValue = question.correctAnswer;
            if (String(selected).toUpperCase() ===  String(correctOptionValue).toUpperCase()) {
                correctAnswers++;
            } else {
                wrongAnswers++;
            }
            });

        const finalScore = parseFloat(( (correctAnswers * positiveMarks)   - (wrongAnswers * negativeMarks) ).toFixed(2));
        const totalQuestions = questions.length;
        const percentage = totalQuestions > 0 ? parseFloat( ((correctAnswers / totalQuestions) * 100).toFixed(2) ): 0;
        const examStartedAt = localStorage.getItem(`exam_started_${examId}` );
        const studentName = localStorage.getItem("name") || "Unknown";
        const email = localStorage.getItem("email");
        const examTitle = questions.length > 0 && questions[0].exam ? questions[0].exam.title   : `Exam ${examId}`;
        const examType = questions.length > 0 &&questions[0].exam ? questions[0].exam.examType: "MAIN";
        const capturedEndImage = captureFaceSnapshot();

        await API.post("/results", { studentName,  email, examTitle,  examType, startedAt: examStartedAt,score: finalScore,totalQuestions,  percentage, startFaceImage, endFaceImage:  capturedEndImage || endFaceImage, questionsJson: JSON.stringify(questions), answersJson:JSON.stringify(answers), violationTimelineJson: JSON.stringify(violationTimeline)  });

        localStorage.removeItem( `exam_answers_${examId}` );
        localStorage.removeItem( `exam_started_${examId}`);
        localStorage.removeItem(    `violations_${examId}` );
        
        if (faceIntervalRef.current) {
            clearInterval(faceIntervalRef.current );
            faceIntervalRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks() .forEach((t) => t.stop());
            streamRef.current = null;
        }

        await API.post( "/monitor/update", { studentName, examTitle,violations,timeLeft: 0, status: "SUBMITTED"  } );
        return { finalScore, correctAnswers,wrongAnswers,   totalQuestions,  percentage, examTitle};
    };