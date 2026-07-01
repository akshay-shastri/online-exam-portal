import { useEffect } from "react";

function useExamTimer({
    examStarted,
    timeLeft,
    submitted,
    setTimeLeft,
    submitExam
}) {

    useEffect(() => {

        if (!examStarted) return;

        if (timeLeft === null || submitted)
            return;

        if (timeLeft <= 0) {

            submitExam();

            return;
        }

        const timer = setInterval(() => {

            setTimeLeft((prev) => prev - 1);

        }, 1000);

        return () => clearInterval(timer);

    }, [
        examStarted,
        timeLeft,
        submitted,
        submitExam,
        setTimeLeft
    ]);
}

export default useExamTimer;