import { useEffect } from "react";

import * as faceapi from "face-api.js";

import toast from "react-hot-toast";

import { speak } from "../utils/speechUtils";

import { playWarningSound } from "../utils/audioUtils";

function useCameraMonitoring({

    examStarted,

    alreadyAttempted,

    submitted,

    submittedRef,

    videoRef,

    streamRef,

    faceIntervalRef,

    setCameraEnabled,

    triggerFlashWarning,

    setWarning,

    submitExam,

    handleViolation

}) {

    useEffect(() => {

        if (
            alreadyAttempted ||
            submitted ||
            submittedRef.current
        ) {
            return;
        }

        let cancelled = false;

        const startCamera = async () => {

            try {

                console.log(
                    "[CAMERA] Starting camera initialization..."
                );

              if (streamRef.current) {

    console.log(
        "[CAMERA] Reusing existing stream"
    );

    const existingStream =
        streamRef.current;

    const video =
        videoRef.current;

   if (!video) {

    setTimeout(() => {

        startCamera();

    }, 300);

    return;
}

    video.srcObject = null;

    await new Promise((resolve) =>
        setTimeout(resolve, 100)
    );

    video.srcObject =
        existingStream;

    video.muted = true;

    video.playsInline = true;

    video.autoplay = true;

    try {

        await video.play();

        setCameraEnabled(true);
        return;

    } catch (err) {

        console.error(err);

        setCameraEnabled(false);
    }
}

                await faceapi
                    .nets
                    .tinyFaceDetector
                    .loadFromUri("/models");

                console.log(
                    "[CAMERA] Face detection model loaded"
                );

                if (cancelled) return;

                const stream =
                    await navigator
                        .mediaDevices
                        .getUserMedia({
                            video: true
                        });

                if (cancelled) {

                    stream
                        .getTracks()
                        .forEach((t) => t.stop());

                    return;
                }

                streamRef.current =
                    stream;

                if (videoRef.current) {

                    const video =
                        videoRef.current;

                   video.srcObject = stream;

                    try {

                        await new Promise((resolve) => {

                            video.onloadedmetadata =
                                () => resolve();
                        });

                        await video.play();

                        setCameraEnabled(true);

                    } catch (err) {

                        console.error(err);

                        setCameraEnabled(false);
                    }
                                    }

                stream
                    .getVideoTracks()
                    .forEach((track) => {

                        track.addEventListener(
                            "ended",
                            () => {

                                setCameraEnabled(false);

                                triggerFlashWarning();

                                playWarningSound();

                                setWarning(
                                    "Warning: Camera disconnected. Exam auto-submitted."
                                );

                                toast.error(
                                    "Camera disconnected. Exam auto-submitted."
                                );

                                speak(
                                    "Camera disconnected. Exam auto submitted"
                                );

                                submitExam();
                            }
                        );

                        track.addEventListener(
                            "mute",
                            () => {

                                setCameraEnabled(false);

                                triggerFlashWarning();

                                playWarningSound();

                                setWarning(
                                    "Warning: Camera disabled. Exam auto-submitted."
                                );

                                toast.error(
                                    "Camera disabled. Exam auto-submitted."
                                );

                                speak(
                                    "Camera disabled. Exam auto submitted"
                                );

                                submitExam();
                            }
                        );
                    });

                if (faceIntervalRef.current) {

                    clearInterval(
                        faceIntervalRef.current
                    );

                    faceIntervalRef.current =
                        null;
                }

            
                faceIntervalRef.current = setInterval(async () => {

                       if (!examStarted) {
                                return;
                            }

                        if (
                            cancelled ||
                            !videoRef.current ||
                            submittedRef.current
                        ) {
                            return;
                        }

                        const video =
                            videoRef.current;


                        try {


                           const detections =
                            await faceapi.detectAllFaces(

                                video,

                                new faceapi.TinyFaceDetectorOptions({

                                    inputSize: 416,

                                    scoreThreshold: 0.5
                                })
                            );

                    

                                                        

                            if (
                                !detections ||
                                detections.length === 0
                            ) {

                               
                                handleViolation(
                                    "No face detected"
                                );

                            } else if (
                                detections &&
                                detections.length > 1
                            ) {

                                

                                handleViolation(
                                    "Multiple faces detected"
                                );
                            }

                        } catch (err) {

                            console.error(err);
                        }

                    }, 1200);

            } catch (error) {

                if (cancelled) return;

                console.error(error);

                setCameraEnabled(false);

                setWarning(
                    "Please allow camera access to start the exam."
                );

                toast.error(
                    "Please allow camera access."
                );

                speak(
                    "Please allow camera access to start the exam"
                );
                            }
        };

       if (
    videoRef.current
) {

    startCamera();
}
        return () => {

    cancelled = true;

    if (faceIntervalRef.current) {

        clearInterval(
            faceIntervalRef.current
        );

        faceIntervalRef.current =
            null;
    }

    if (streamRef.current) {

        streamRef.current
            .getTracks()
            .forEach((track) =>
                track.stop()
            );

        streamRef.current = null;
    }

    if (videoRef.current) {

        videoRef.current.srcObject =
            null;

        videoRef.current.onloadedmetadata =
            null;
    }

};

    }, [
    
        examStarted,

    alreadyAttempted,

    submitted
    ]);
}

export default useCameraMonitoring;