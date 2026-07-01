import { useEffect, useRef } from "react";

function useExamPersistence({

    examId,

    examStarted,

    submitted,

    answers,

    bookmarkedQuestions,

    currentQuestionIndex,

    timeLeft,

    violations,

    violationTimeline,

    setAnswers,

    setBookmarkedQuestions,

    setCurrentQuestionIndex,

    setTimeLeft,

    setViolations,

    setViolationTimeline
}) {

    const restoredRef = useRef(false);

    // RESTORE
    useEffect(() => {

        if (restoredRef.current) return;
        restoredRef.current = true;

        if (!examId) return;

        try {

            const savedData =
                localStorage.getItem(
                    `exam_state_${examId}`
                );

            if (!savedData) return;

            const parsed =
                JSON.parse(savedData);

            if (parsed.answers) {

                setAnswers(
                    parsed.answers
                );
            }

            if (
                Array.isArray(
                    parsed.bookmarkedQuestions
                )
            ) {

                setBookmarkedQuestions(
                    parsed.bookmarkedQuestions
                );
            }

            if (
                typeof parsed.currentQuestionIndex
                === "number"
            ) {

                setCurrentQuestionIndex(
                    parsed.currentQuestionIndex
                );
            }

            if (
                typeof parsed.timeLeft === "number" && parsed.timeLeft > 0
            ) {

                setTimeLeft( parsed.timeLeft);
            }

            if (
            typeof parsed.violations === "number"
        ) {

            setViolations(
                parsed.violations
            );
        }

        if (
            Array.isArray(
                parsed.violationTimeline
            )
        ) {

            setViolationTimeline(
                parsed.violationTimeline
            );
        }

        } catch (err) {

            console.log(
                "Failed to restore exam state",
                err
            );
        }

    }, [

        examId,

        setAnswers,

        setBookmarkedQuestions,

        setCurrentQuestionIndex,

        setTimeLeft
    ]);

    // SAVE
    useEffect(() => {

        if (
            !examStarted ||
            submitted
        ) {
            return;
        }

        try {

            const state = {

                answers,

                bookmarkedQuestions,

                currentQuestionIndex,

                timeLeft,

                violations,

                violationTimeline
            };

            localStorage.setItem(
                `exam_state_${examId}`,
                JSON.stringify(state)
            );

        } catch (err) {

            console.log(
                "Failed to save exam state",
                err
            );
        }

    }, [

        examId,

        examStarted,

        submitted,

        answers,

        bookmarkedQuestions,

        currentQuestionIndex,

        timeLeft,
        
        violations,

        violationTimeline


    ]);

    // CLEANUP AFTER SUBMIT
    useEffect(() => {

        if (!submitted) return;

        localStorage.removeItem(
            `exam_state_${examId}`
        );

    }, [

        submitted,

        examId
    ]);
}

export default useExamPersistence;