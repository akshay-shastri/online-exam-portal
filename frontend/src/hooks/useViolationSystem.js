import { useCallback, useRef } from "react";

import toast from "react-hot-toast";

import API from "../services/api";

import { speak } from "../utils/speechUtils";

import { playWarningSound } from "../utils/audioUtils";

function useViolationSystem({

    submittedRef,

    proctoringEnabled,

    violationsRef,

    violationTimelineRef,

    setViolationTimeline,

    setWarning,

    triggerFlashWarning,

    submitExam,

    questionsRef,

    examId,

    setCameraEnabled

}) {

    const lastViolationTimeRef = useRef(0);
    const lastViolationReasonRef = useRef("");
    const warningTimeoutRef = useRef(null);

    const handleViolation = useCallback((reason) => {

        if (!proctoringEnabled) {

            return;
        }

        console.log("VIOLATION:", reason);

        if (submittedRef.current) return;

        if (violationsRef.current >= 3)
            return;

         const now = Date.now();
        /* PREVENT SPAM VIOLATIONS */
        if (
    now -
    lastViolationTimeRef.current <
    4000
) {
            console.log( "Violation cooldown active" );
            return;
        }
        lastViolationReasonRef.current = reason;
        lastViolationTimeRef.current = now;


        violationsRef.current += 1;

        const count = violationsRef.current;

        const timelineEntry = { reason, time: new Date() .toLocaleTimeString() };

        const updatedTimeline = [            ...violationTimelineRef.current, timelineEntry ];

        violationTimelineRef.current =  updatedTimeline;

        setViolationTimeline( updatedTimeline );

        triggerFlashWarning();

        playWarningSound();

        speak(reason);

        setWarning(`Warning: ${reason} (${count}/3)`);

        clearTimeout( warningTimeoutRef.current);
        warningTimeoutRef.current = setTimeout(() => {
            setWarning("");
        }, 3000);
        toast.error(`${reason} (${count}/3)`);

        const studentName = localStorage.getItem("name") || "Unknown";

        const examTitle = questionsRef.current[0]?.exam?.title || `Exam ${examId}`;

        API.post("/violations", {

            studentName,

            examTitle,

            violationType: reason

        }).catch((err) =>
            console.log(err)
        );

        if (count >= 3) {

            toast.error(
                "Exam auto-submitted due to multiple violations."
            );

            speak(
                "Exam auto submitted due to multiple violations"
            );

            setCameraEnabled(false);

            submitExam();
        }

    }, [

        submittedRef,

        proctoringEnabled,

        violationsRef,

        violationTimelineRef,

        setViolationTimeline,

        setWarning,

        triggerFlashWarning,

        submitExam,

        questionsRef,

        examId,

        setCameraEnabled

    ]);

    return {
        handleViolation
    };
}

export default useViolationSystem;