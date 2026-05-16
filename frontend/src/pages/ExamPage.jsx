import {
    useEffect,
    useState,
    useRef,
    useCallback
} from "react";
import * as faceapi from "face-api.js";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import PremiumLoader from "../components/PremiumLoader";

function ExamPage() {

    const { examId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [questionsError, setQuestionsError] = useState(false);
    const [alreadyAttempted, setAlreadyAttempted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [totalDuration, setTotalDuration] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submissionStage, setSubmissionStage] = useState("idle");
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [warning, setWarning] = useState("");
    const [flashWarning, setFlashWarning] = useState(false);
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [examStarted, setExamStarted] = useState(false);
    const [fullscreenExited, setFullscreenExited] = useState(false);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const [startFaceImage, setStartFaceImage] = useState(null);
    const [endFaceImage,setEndFaceImage] = useState(null);
    const [captureCountdown, setCaptureCountdown] = useState(null);
    const [captureFlash, setCaptureFlash] = useState(false);
    const [capturingPhoto, setCapturingPhoto] = useState(false);
    const [violationTimeline, setViolationTimeline] = useState([]);
    const [resultData, setResultData] = useState(null);

    // Refs — always hold current values, no stale closure issues
    const violationsRef = useRef(0);
    const submittedRef = useRef(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const questionsRef = useRef([]);
    const answersRef = useRef({});
    const timeLeftRef = useRef(null);
    const faceIntervalRef = useRef(null);
    const startFaceImageRef = useRef(null);
    const endFaceImageRef = useRef(null);
    const violationTimelineRef = useRef([]);

    // Keep refs in sync with state
    useEffect(() => { questionsRef.current = questions; }, [questions]);
    useEffect(() => { answersRef.current = answers; }, [answers]);
    useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
    useEffect(() => { startFaceImageRef.current = startFaceImage;}, [startFaceImage]);
    useEffect(() => {endFaceImageRef.current = endFaceImage;}, [endFaceImage]);


    // ── Hoisted helpers (component scope, no stale closures) ──

    const playWarningSound = useCallback(() => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            osc1.type = "sawtooth";
            osc2.type = "square";
            osc1.frequency.setValueAtTime(700, ctx.currentTime);
            osc2.frequency.setValueAtTime(900, ctx.currentTime);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            osc1.start(); osc2.start();
            osc1.stop(ctx.currentTime + 0.4);
            osc2.stop(ctx.currentTime + 0.4);
        } catch (e) {
            console.log(e);
        }
    }, []);

    const triggerFlashWarning = useCallback(() => {
        setFlashWarning(true);
        setTimeout(() => setFlashWarning(false), 600);
    }, []);

    const speakWarning = useCallback((message) => {

    try {

        // STOP previous speech
        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(
                message
            );

        speech.rate = 1;

        speech.pitch = 1;

        speech.volume = 1;

        speech.lang = "en-US";

        window.speechSynthesis.speak(
            speech
        );

    } catch (e) {

        console.log(e);
    }

}, []);


const speakMessage = useCallback((message) => {

    try {

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(
                message
            );

        speech.rate = 1;

        speech.pitch = 1;

        speech.volume = 1;

        speech.lang = "en-US";

        window.speechSynthesis.speak(
            speech
        );

    } catch (e) {

        console.log(e);
    }

}, []);

    // ── submitExam uses refs so it never reads stale state ──

    const submitExam = useCallback(async () => {
        if (submittedRef.current) return;
        submittedRef.current = true;
        setSubmitted(true);
        setShowSubmitConfirm(false);
        setSubmitting(true);
        setSubmissionStage("processing");   

        const qs = questionsRef.current;
        const ans = answersRef.current;
        const tl = timeLeftRef.current;

        let correctAnswers = 0;
        let wrongAnswers = 0;

        const positiveMarks = qs[0]?.exam?.positiveMarks || 1;
        const negativeMarks = qs[0]?.exam?.negativeMarks || 0;

        qs.forEach((question) => {
            console.log(ans[question.id], question.correctAnswer);
            const selected = ans[question.id];
            if (!selected) return;
            if (selected === question.correctAnswer) {
                correctAnswers++;
            } else {
                wrongAnswers++;
            }
        });

        const finalScore = parseFloat(((correctAnswers * positiveMarks) - (wrongAnswers * negativeMarks)).toFixed(2));        
        
        const totalQuestions = qs.length;
        const percentage = totalQuestions > 0 ? parseFloat(((correctAnswers / totalQuestions) * 100).toFixed(2)): 0;

        const studentName = localStorage.getItem("name") || "Unknown";
        const email = localStorage.getItem("email");
        const examTitle = qs.length > 0 && qs[0].exam ? qs[0].exam.title : `Exam ${examId}`;

        console.log("Capturing END snapshot...");

const endImage = captureFaceSnapshot();

console.log(
    "END snapshot captured:",
    !!endImage
);

if (endImage) {

    setEndFaceImage(endImage);

    endFaceImageRef.current = endImage;
}

        try {
            await API.post("/results", { studentName, email, examTitle, score: finalScore, totalQuestions, percentage, startFaceImage: startFaceImageRef.current, endFaceImage: endFaceImageRef.current, questionsJson: JSON.stringify(qs), answersJson: JSON.stringify(ans), violationTimelineJson:JSON.stringify(violationTimelineRef.current)});
        } catch (error) {
            console.log(error);
        }

        localStorage.removeItem(`exam_answers_${examId}`);

        localStorage.removeItem(`violations_${examId}`);

        // Stop camera stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
        }

        // STOP FACE DETECTION
        if (faceIntervalRef.current) {
            clearInterval(faceIntervalRef.current);
            faceIntervalRef.current = null;
        }

        // STOP CAMERA
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }

        setCameraEnabled(false);

        try {

            await API.post(
                "/monitor/update",
                {

                    studentName,

                    examTitle,

                    violations:
                        violationsRef.current,

                    timeLeft: 0,

                    status: "SUBMITTED"
                }
            );

        } catch (e) {

            console.log(e);
        }

        setResultData({
    score: finalScore,
    correctAnswers,
    wrongAnswers,
    totalQuestions,
    examTitle,
    timeTaken: qs[0]?.exam
        ? `${Math.floor((qs[0].exam.duration * 60 - (tl || 0)) / 60)} min`
        : "N/A",
    questions: qs,
    answers: ans,
    violations: violationsRef.current,
});

setSubmissionStage("success");
setSubmitting(false);

       
    }, [examId, navigate]);

   // ── Violation handler — uses ref, never stale ──

const handleViolation = useCallback((reason) => {

    console.log("VIOLATION:", reason);

    if (submittedRef.current) return;

    if (violationsRef.current >= 3) return;

    violationsRef.current += 1;

    const count = violationsRef.current;

    const timelineEntry = { reason, time: new Date().toLocaleTimeString()};

    const updatedTimeline = [ ...violationTimelineRef.current, timelineEntry];

    violationTimelineRef.current = updatedTimeline;
    setViolationTimeline(updatedTimeline);

    triggerFlashWarning();

    playWarningSound();

    speakWarning(reason);

    setWarning(
        `Warning: ${reason} (${count}/3)`
    );

    setTimeout(() => {

    setWarning("");

}, 3000);

    toast.error(
        `${reason} (${count}/3)`
    );

    const studentName = localStorage.getItem("name") || "Unknown";

    const examTitle =
        questionsRef.current[0]?.exam?.title
        || `Exam ${examId}`;

    API.post("/violations", {
        studentName,
        examTitle,
        violationType: reason
    }).catch((err) => console.log(err));

    if (count >= 3) {

        toast.error("Exam auto-submitted due to multiple violations.");
        speakWarning("Exam auto submitted due to multiple violations");


        setCameraEnabled(false);

        submitExam();
    }

}, [ triggerFlashWarning,playWarningSound, speakWarning, submitExam, examId]

);


    // ── Timer ──

    useEffect(() => {

    // DO NOT START TIMER BEFORE EXAM STARTS
    if (!examStarted) return;

    if (timeLeft === null || submitted) return;

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
    submitExam
]);

    useEffect(() => {
        if (timeLeft === 60) toast.error("Only 1 minute remaining!");
    }, [timeLeft]);


  // ── Tab switch monitoring ──

  useEffect(() => {

    if (
    !examStarted ||
    alreadyAttempted ||
    submitted ||
    submittedRef.current
) return;

    let mounted = true;

    const handleVisibilityChange = () => {

        if (!mounted) return;

        if (
            document.hidden &&
            !submittedRef.current
        ) {

            handleViolation(
                "Tab switching detected"
            );
        }
    };

    document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
    );

    return () => {

        mounted = false;

        document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
        );
    };

}, [examStarted, handleViolation]);
// ── Fullscreen monitoring ──
useEffect(() => {

    // DO NOT MONITOR BEFORE EXAM STARTS
    if (
        !examStarted ||
        alreadyAttempted ||
        submitted ||
        submittedRef.current
    ) {
        return;
    }

    const handleFullscreenChange = () => {

        if (
            !document.fullscreenElement &&
            !submittedRef.current
        ) {

            setFullscreenExited(true);

            handleViolation(
                "Fullscreen exit detected"
            );
        }
    };

    document.addEventListener(
        "fullscreenchange",
        handleFullscreenChange
    );

    return () => {

        document.removeEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );
    };

}, [
    examStarted,
    alreadyAttempted,
    submitted,
    handleViolation
]);
// DEVTOOLS
useEffect(() => {

    // DO NOT RUN MONITORING
    // before exam starts or after submit
    if (
        !examStarted ||
        alreadyAttempted ||
        submitted ||
        submittedRef.current
    ) {
        return;
    }

    const handleKeyDown = (e) => {

        const key = e.key.toLowerCase();

        if (e.key === "F12") {

            e.preventDefault();

            handleViolation(
                "F12 shortcut detected"
            );

            return;
        }

        if (
            e.ctrlKey &&
            e.shiftKey &&
            (
                key === "i" ||
                key === "j" ||
                key === "c"
            )
        ) {

            e.preventDefault();

            handleViolation(
                "Developer shortcut detected"
            );

            return;
        }

        if (
            e.ctrlKey &&
            key === "u"
        ) {

            e.preventDefault();

            handleViolation(
                "View source shortcut detected"
            );

            return;
        }

        if (
            e.ctrlKey &&
            key === "c"
        ) {

            e.preventDefault();

            handleViolation(
                "Copy shortcut detected"
            );

            return;
        }
    };

    const handleRightClick = (e) => {

        e.preventDefault();

        handleViolation(
            "Right click detected"
        );
    };

    const detectDevTools =
        setInterval(() => {

            // STOP CHECKING AFTER SUBMIT
            if (
                submittedRef.current ||
                alreadyAttempted
            ) {
                return;
            }

            const widthThreshold =
                window.outerWidth -
                window.innerWidth > 160;

            const heightThreshold =
                window.outerHeight -
                window.innerHeight > 160;

            if (
                widthThreshold ||
                heightThreshold
            ) {

                handleViolation(
                    "Developer tools detected"
                );
            }

        }, 2000);

    window.addEventListener(
        "keydown",
        handleKeyDown
    );

    window.addEventListener(
        "contextmenu",
        handleRightClick
    );

    return () => {

        clearInterval(detectDevTools);

        window.removeEventListener(
            "keydown",
            handleKeyDown
        );

        window.removeEventListener(
            "contextmenu",
            handleRightClick
        );
    };

}, [
    examStarted,
    alreadyAttempted,
    submitted,
    handleViolation
]);

    // ── Live monitor ping ──

    useEffect(() => {

        if (
            !examStarted ||
            submittedRef.current ||
            alreadyAttempted
        ) {
            return;
        }

        const interval = setInterval(async () => {

            try {

                const studentName =
                    localStorage.getItem("name")
                    || "Unknown";

                const examTitle =
                    questionsRef.current[0]?.exam?.title
                    || `Exam ${examId}`;

                await API.post(
                    "/monitor/update",
                    {

                        studentName,

                        examTitle,

                        violations:
                            violationsRef.current,

                        timeLeft:
                            timeLeftRef.current || 0,

                        status:
                            submittedRef.current
                                ? "SUBMITTED"
                                : "ACTIVE"
                    }
                );

            } catch (err) {

                console.log(
                    "LIVE MONITOR ERROR:",
                    err
                );
            }

        }, 5000);

        return () => clearInterval(interval);

    }, [
        examStarted,
        alreadyAttempted,
        examId
    ]);

    // ── Camera startup + track monitoring ──

    useEffect(() => {

    // ONLY RUN CAMERA AFTER EXAM STARTS
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

        console.log("[CAMERA] Starting camera initialization...");

        // PREVENT DOUBLE INITIALIZATION
        if (streamRef.current) {
            console.log("[CAMERA] Stream already exists, skipping initialization");
            setCameraEnabled(true);
            return;
        }

        await faceapi
            .nets
            .tinyFaceDetector
            .loadFromUri("/models");
            console.log("[CAMERA] Face detection model loaded");

        if (cancelled) {
            console.log("[CAMERA] Initialization cancelled");
            return;
        }

        const stream =
            await navigator
                .mediaDevices
                .getUserMedia({
                    video: true
                });

        console.log("[CAMERA] Stream acquired:", stream);
        console.log("[CAMERA] Video tracks:", stream.getVideoTracks());

        if (cancelled) {
            console.log("[CAMERA] Cancellation detected after stream acquired, stopping tracks");
            stream.getTracks().forEach((t) => t.stop());
            return;
        }

        // STORE STREAM REFERENCE
        streamRef.current = stream;

        // ATTACH STREAM TO VIDEO ELEMENT
      if (videoRef.current) {

    const video = videoRef.current;

    console.log("[CAMERA] attaching stream");

    video.srcObject = stream;

    try {

        await video.play();

        console.log("[CAMERA] PLAY SUCCESS");

        setCameraEnabled(true);

    } catch (err) {

        console.error(
            "[CAMERA] PLAY FAILED",
            err
        );

        setCameraEnabled(false);
    }
}

        // MONITOR VIDEO TRACKS FOR DISCONNECTION
        stream.getVideoTracks().forEach((track) => {
            console.log("[CAMERA] Setting up track event listeners");
            
            track.addEventListener("ended", () => {
                console.log("[CAMERA] Track ended event fired");
                setCameraEnabled(false);
                triggerFlashWarning();
                playWarningSound();
                setWarning("Warning: Camera disconnected. Exam auto-submitted.");
                toast.error("Camera disconnected. Exam auto-submitted.");
                speakWarning("Camera disconnected. Exam auto submitted");
                submitExam();
            });

            track.addEventListener("mute", () => {
                console.log("[CAMERA] Track mute event fired");
                setCameraEnabled(false);
                triggerFlashWarning();
                playWarningSound();
                setWarning("Warning: Camera disabled. Exam auto-submitted.");
                toast.error("Camera disabled. Exam auto-submitted.");
                speakWarning("Camera disabled. Exam auto submitted");
                submitExam();
            });
        });

        // START FACE DETECTION INTERVAL (ONLY AFTER STREAM IS ATTACHED)
        if (faceIntervalRef.current) {
            clearInterval(faceIntervalRef.current);
            faceIntervalRef.current = null;
        }

        console.log("[CAMERA] Starting face detection interval");

        faceIntervalRef.current = setInterval(async () => {
            if (!examStarted) return;
            if (cancelled || !videoRef.current || submittedRef.current) return;
            
            const video = videoRef.current;
            if (video.readyState < 2) {
                console.log("[FACE-DETECTION] Video not ready, skipping detection");
                return;
            }

            try {
                const detections = await faceapi.detectAllFaces(
                    video,
                    new faceapi.TinyFaceDetectorOptions()
                );

                console.log("[FACE-DETECTION] Detections found:", detections.length);

                if (detections.length === 0) {
                    console.log("[FACE-DETECTION] No face detected - triggering violation");
                    handleViolation("No face detected");
                } else if (detections.length > 1) {
                    console.log("[FACE-DETECTION] Multiple faces detected - triggering violation");
                    handleViolation("Multiple faces detected");
                }
            } catch (err) {
                console.error("[FACE-DETECTION] Face detection error:", err);
            }
        }, 2500);

        console.log("[CAMERA] Camera initialization complete");

    } catch (error) {
        if (cancelled) {
            console.log("[CAMERA] Error caught but initialization was cancelled");
            return;
        }
        console.error("[CAMERA] Camera initialization error:", error);
        setCameraEnabled(false);
        triggerFlashWarning();
        playWarningSound();
        setWarning("Warning: Camera access is required during exam.");
        toast.error("Camera access denied.");
        speakWarning("Camera access is required during exam");
    }
};

startCamera();

return () => {

    console.log("[CAMERA-CLEANUP] Component cleanup started");
    cancelled = true;

    // stop face detection interval
    if (faceIntervalRef.current) {
        console.log("[CAMERA-CLEANUP] Clearing face detection interval");
        clearInterval(faceIntervalRef.current);
        faceIntervalRef.current = null;
    }

    // stop webcam stream
    if (streamRef.current) {
        console.log("[CAMERA-CLEANUP] Stopping video tracks");
        streamRef.current
            .getTracks()
            .forEach((track) => {
                console.log("[CAMERA-CLEANUP] Stopping track:", track.kind);
                track.stop();
            });
        streamRef.current = null;
    }

    // Clear video source
    if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.onloadedmetadata = null;
    }

    // hide camera UI
    setCameraEnabled(false);
    console.log("[CAMERA-CLEANUP] Cleanup complete");
};

}, [
    examStarted,
    alreadyAttempted,
    submitted,
    triggerFlashWarning,
    playWarningSound,
    submitExam,
    handleViolation
]);

 const fetchQuestions = async () => {

    setQuestionsLoading(true);

    setQuestionsError(false);

    const studentName = localStorage.getItem("name") || "";

    try {

        const response =
            await API.get(
                `/questions/${examId}`
            );

        const data = response.data;

        const shuffled =
            [...data].sort(
                () => Math.random() - 0.5
            );

        setQuestions(shuffled);

       if (
    shuffled.length > 0 &&
    shuffled[0].exam?.duration
) {

    const durationInMinutes =
        shuffled[0].exam.duration;

    setTotalDuration(durationInMinutes);

    // DO NOT START TIMER YET
    setTimeLeft(durationInMinutes * 60);

} else {

    setTotalDuration(5);

    setTimeLeft(300);
}

        

        // Already attempted check
        if (
            shuffled.length > 0 &&
            shuffled[0].exam
        ) {

            const examTitle =
                shuffled[0].exam.title;

            try {

                const checkRes =
                    await API.get(
                        `/results/check/${encodeURIComponent(
                            studentName
                        )}/${encodeURIComponent(
                            examTitle
                        )}`
                    );

                if (
                    checkRes.data.attempted
                ) {

                    setAlreadyAttempted(true);
                }

            } catch (e) {

                console.log(e);
            }
        }

    } catch (error) {

        console.log(error);

        setQuestionsError(true);

        toast.error(
            "Failed to load questions."
        );

    } finally {

        setQuestionsLoading(false);
    }
};
    useEffect(() => { fetchQuestions(); }, []);

    // ── Option select ──

    const handleOptionSelect = (questionId, option) => {
        if (submittedRef.current) return;
        const updated = { ...answersRef.current, [questionId]: option };
        setAnswers(updated);
        localStorage.setItem(`exam_answers_${examId}`, JSON.stringify(updated));
    };

    const toggleBookmark = (questionId) => {

    setBookmarkedQuestions((prev) => {

        if (prev.includes(questionId)) {

            return prev.filter(
                (id) => id !== questionId
            );
        }

        return [...prev, questionId];
    });
};

const handleViewResults = () => {

    navigate("/result", {
        state: resultData
    });
};


// FULL SCREEN
const enterFullscreen = async () => {

    try {

        const elem =
            document.documentElement;

        if (elem.requestFullscreen) {

            await elem.requestFullscreen();
        }

    } catch (e) {

        console.log(e);
    }
};



const captureFaceSnapshot = () => {

    const video = videoRef.current;

    // SAFETY CHECKS
    if (!video) {
        console.log("No video ref available");
        return null;
    }

    if (video.readyState < 2) {
        console.log("Video not ready yet");
        return null;
    }

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;

    const ctx =
        canvas.getContext("2d");

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const image =
        canvas.toDataURL(
            "image/jpeg"
        );

    console.log(
        "Snapshot captured:",
        !!image
    );

    return image;
};

const startVerificationCapture = async () => {

    if (capturingPhoto) return;

    setCapturingPhoto(true);

    speakMessage(
        "Please look at the camera"
    );

    let count = 3;

    setCaptureCountdown(count);

    const interval = setInterval(() => {

        count--;

        if (count > 0) {

            setCaptureCountdown(count);

        } else {

            clearInterval(interval);

            setCaptureCountdown(null);

            setCaptureFlash(true);

            setTimeout(() => {

                setCaptureFlash(false);

            }, 250);

            const image =
                captureFaceSnapshot();

            if (image) {

                setStartFaceImage(image);

                toast.success(
                    "Verification photo captured"
                );

                speakMessage(
                    "Photo captured successfully"
                );

            } else {

                toast.error(
                    "Failed to capture photo"
                );
            }

            setCapturingPhoto(false);
        }

    }, 1000);
};


    // ── Fullscreen helper ──
const startExam = async () => {

    console.log("START EXAM CLICKED");

    try {

        const elem =
            document.documentElement;

        if (elem.requestFullscreen) {

            await elem.requestFullscreen();
        }

    } catch (e) {

        console.log(
            "Fullscreen failed:",
            e
        );
    }

    // START TIMER ONLY AFTER EXAM STARTS
    if (
        questions.length > 0 &&
        questions[0].exam?.duration
    ) {

        setTimeLeft(
            questions[0].exam.duration * 60
        );
    }

    setExamStarted(true);
};


// RE-ENTER FUNCTION 
const reEnterFullscreen = async () => {

    try {

        const elem =
            document.documentElement;

        if (elem.requestFullscreen) {

            await elem.requestFullscreen();
        }

        setFullscreenExited(false);

    } catch (e) {

        console.log(e);
    }
};
    // ── Derived display values ──

    const displayTime = timeLeft !== null ? timeLeft : 0;
    const safeTime = typeof displayTime === "number" && !isNaN(displayTime)? displayTime : 0;

    const minutes = Math.floor(safeTime / 60);

    const seconds = safeTime % 60;
    const answeredCount = Object.keys(answers).length;
    const currentQuestion = questions[currentQuestionIndex];
    const totalDurationInSeconds = totalDuration * 60;
    const timerPercentage = (displayTime / totalDurationInSeconds) * 100;
    const optionLabels = ["A", "B", "C", "D"];



    const isMobileDevice = () => { 
        const userAgent = navigator.userAgent.toLowerCase();

    const mobileKeywords = ["android", "iphone", "ipad", "ipod", "mobile", "opera mini", "iemobile"];

    const isMobileUA = mobileKeywords.some(keyword =>
            userAgent.includes(keyword)
        );

    const hasTouch = navigator.maxTouchPoints > 1;

    const smallScreen = window.innerWidth <= 1024;

    return ( isMobileUA || (hasTouch && smallScreen));
};

    // ── Timer urgency (UI only) ──
   const timerUrgency = safeTime < 30  ? "danger" : safeTime < 120 ? "critical" : safeTime < 300 ? "warning" : "normal";                 

    const timerColors = {
        normal:   { text: '#e9d5ff',  glow: 'rgba(124,58,237,0.55)',  bg: 'linear-gradient(135deg,#7c3aed,#a855f7)',  border: 'rgba(167,139,250,0.35)' },
        warning:  { text: '#fed7aa',  glow: 'rgba(249,115,22,0.55)',  bg: 'linear-gradient(135deg,#c2410c,#f97316)',  border: 'rgba(249,115,22,0.45)'  },
        critical: { text: '#fecaca',  glow: 'rgba(239,68,68,0.65)',   bg: 'linear-gradient(135deg,#991b1b,#ef4444)',  border: 'rgba(239,68,68,0.55)'   },
        danger: { text: '#ffffff', glow: 'rgba(239,68,68,0.95)',  bg: 'linear-gradient(135deg,#7f1d1d,#dc2626,#ef4444)', border: 'rgba(252,165,165,0.9)',},
     };
    const tc = timerColors[timerUrgency];


    if (isMobileDevice()) {

    return (

        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 text-center">

            <div>

                <h1 className="text-3xl font-bold mb-4">
                    Desktop Required
                </h1>

                <p className="text-gray-300 text-lg">
                    This exam can only be attended on a desktop or laptop device.
                </p>

            </div>

        </div>
    );
}
    return (

    <div
        className={`min-h-screen relative ${examStarted ? "select-none": "" } ${flashWarning ? "bg-red-900": "bg-[#0c0a1e]"} transition-colors duration-150`}

        onCopy={(e) => {
            if (examStarted) {
                e.preventDefault();
                handleViolation("Copy attempt detected");
            }
        }}
    >

        {captureCountdown && (

            <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center">

                <div className="text-white text-9xl font-black animate-pulse">

                    {captureCountdown}

                </div>

            </div>
        )}

        {captureFlash && (

            <div className="fixed inset-0 z-[99998] bg-white animate-pulse" />

        )}

            {/* Header */}
            <div className="sticky top-0 z-50" style={{background:'rgba(12,10,30,0.88)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderBottom:'1px solid rgba(168,85,247,0.12)'}}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'linear-gradient(135deg,#6d28d9,#a21caf)',boxShadow:'0 0 16px rgba(109,40,217,0.45)'}}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold" style={{background:'linear-gradient(90deg,#f3e8ff,#c4b5fd)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Smart Exam Portal</p>
                            <p className="text-xs" style={{color:'rgba(196,181,253,0.5)'}}>Examination in Progress</p>
                        </div>
                    </div>
                    {!alreadyAttempted && (
                        <div
className={`exam-timer-pill text-sm sm:text-base ${
    timerUrgency === 'danger'
        ? ' exam-timer-critical'
        : timerUrgency === 'critical'
        ? ' exam-timer-critical'
        : timerUrgency === 'warning'
        ? ' exam-timer-warning'
        : ''
}`}                            style={{
                                background: tc.bg,
                                boxShadow: `0 0 18px ${tc.glow}, 0 2px 8px rgba(0,0,0,0.4)`,
                                border: `1px solid ${tc.border}`,
                                color: tc.text,
                            }}
                        >
                            {/* Clock icon */}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{opacity:0.85,flexShrink:0}}>
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="exam-timer-digits">
                                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                            </span>
                            {timerUrgency !== 'normal' && (
                                <span className="exam-timer-label">
{timerUrgency === 'danger'
    ? '🚨 Final Seconds'
    : timerUrgency === 'critical'
    ? '⚠ Critical'
    : '⚠ Low'}                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Timer bar */}
            <div className="w-full h-1.5 overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
                <div
                    className={`h-full transition-all duration-1000${timerUrgency === 'critical' ? ' exam-timerbar-pulse' : ''}`}
                    style={{
                        width: `${timerPercentage}%`,
                        background:
                            timerUrgency === 'critical' ? 'linear-gradient(90deg,#991b1b,#ef4444,#f87171)'
                            : timerUrgency === 'warning'  ? 'linear-gradient(90deg,#c2410c,#f97316,#fb923c)'
                            : 'linear-gradient(90deg,#4f46e5,#7c3aed,#a855f7)',
                        boxShadow:
                            timerUrgency === 'critical' ? '0 0 8px rgba(239,68,68,0.7)'
                            : timerUrgency === 'warning'  ? '0 0 8px rgba(249,115,22,0.6)'
                            : '0 0 6px rgba(124,58,237,0.5)',
                        borderRadius: '0 2px 2px 0',
                        transition: 'width 1s linear, background 0.8s ease, box-shadow 0.8s ease',
                    }}
                />
            </div>
{/* Camera preview */}
{!alreadyAttempted && !submitted && (
<div className="fixed top-[84px] right-2 sm:right-4 z-50 max-w-full overflow-hidden">        <div
            style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: cameraEnabled ? '1px solid rgba(34,197,94,0.45)' : '1px solid rgba(239,68,68,0.45)',
                boxShadow: cameraEnabled
                    ? '0 0 20px rgba(34,197,94,0.2), 0 8px 32px rgba(0,0,0,0.5)'
                    : '0 0 20px rgba(239,68,68,0.2), 0 8px 32px rgba(0,0,0,0.5)',
                background: 'rgba(8,6,20,0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
    width:'120px',
    height:'82px',bjectFit:'cover', display:'block', background:'#000'}}
            />
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    background: cameraEnabled ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                }}
            >
                <span style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    background: cameraEnabled ? '#22c55e' : '#ef4444',
                    boxShadow: cameraEnabled ? '0 0 6px #22c55e' : '0 0 6px #ef4444',
                }} />
                <span style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
                    color: cameraEnabled ? '#86efac' : '#fca5a5',
                }}>
                    {cameraEnabled ? 'LIVE' : 'OFFLINE'}
                </span>
            </div>
        </div>
    </div>
)}

            {fullscreenExited && (
    <div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{background:'rgba(4,2,18,0.88)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)'}}
    >
        <div
            className="text-center max-w-md w-full mx-4 rounded-3xl overflow-hidden"
            style={{
                background: 'linear-gradient(160deg,rgba(109,40,217,0.14) 0%,rgba(12,10,30,0.95) 100%)',
                border: '1px solid rgba(239,68,68,0.4)',
                boxShadow: '0 0 60px rgba(239,68,68,0.15), 0 32px 64px rgba(0,0,0,0.6)',
            }}
        >
            <div style={{height:'3px', background:'linear-gradient(90deg,#991b1b,#ef4444,#f87171)'}} />
            <div className="p-10">
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.35)',
                        boxShadow: '0 0 28px rgba(239,68,68,0.25)',
                    }}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <h2
                    className="text-2xl font-black mb-3"
                    style={{background:'linear-gradient(90deg,#fecaca,#f87171)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}
                >
                    Fullscreen Required
                </h2>
                <p style={{color:'rgba(196,181,253,0.55)', fontSize:'14px', lineHeight:'1.7', marginBottom:'28px'}}>
                    You exited fullscreen mode. Please return to fullscreen to continue the exam.
                </p>
                <button
                    onClick={reEnterFullscreen}
                    className="w-full py-3.5 rounded-2xl font-black text-sm transition-all duration-200"
                    style={{
                        background: 'linear-gradient(135deg,#991b1b,#dc2626,#ef4444)',
                        border: '1px solid rgba(239,68,68,0.4)',
                        color: '#fff',
                        boxShadow: '0 0 24px rgba(239,68,68,0.4)',
                        letterSpacing: '0.3px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow='0 0 40px rgba(239,68,68,0.6)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 24px rgba(239,68,68,0.4)'; e.currentTarget.style.transform='translateY(0)'; }}
                >
                    Return to Fullscreen
                </button>
            </div>
        </div>
    </div>
)}

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

                {/* Warning banner */}
                {warning && (
                    <div className="mb-6 flex justify-center">
                        <div
                            className="exam-warning-banner w-full max-w-2xl"
                            role="status"
                            aria-live="polite"
                        >
                            <div className="exam-warning-banner-icon" aria-hidden="true">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="exam-warning-banner-kicker">Violation detected</p>
                                <p className="exam-warning-banner-text">
                                    {warning}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            {questionsLoading && (

    <PremiumLoader
        title="Preparing Examination..."
        subtitle="Loading questions, verification system, and exam environment."
        height="70vh"
    />

)}

              {/* Already Attempted */}
{!questionsLoading && alreadyAttempted && (
    <div className="flex items-center justify-center py-20">
        <div
            className="w-full max-w-2xl rounded-3xl overflow-hidden text-center"
            style={{
                background:
                    'linear-gradient(160deg,rgba(16,185,129,0.12) 0%,rgba(12,10,30,0.92) 100%)',
                border:
                    '1px solid rgba(16,185,129,0.28)',
                boxShadow:
                    '0 0 60px rgba(16,185,129,0.14), 0 24px 64px rgba(0,0,0,0.55)',
                backdropFilter:'blur(22px)',
            }}
        >
            <div
                className="h-1"
                style={{
                    background:
                        'linear-gradient(90deg,#059669,#10b981,#34d399)'
                }}
            />

            <div className="p-12">

                <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
                    style={{
                        background:
                            'rgba(16,185,129,0.15)',
                        border:
                            '1px solid rgba(16,185,129,0.35)',
                        boxShadow:
                            '0 0 32px rgba(16,185,129,0.25)',
                    }}
                >
                    <svg
                        width="42"
                        height="42"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                </div>

                <h2
                    className="text-3xl sm:text-4xl font-black mb-4"
                    style={{
                        background:
                            'linear-gradient(90deg,#d1fae5,#6ee7b7)',
                        WebkitBackgroundClip:'text',
                        WebkitTextFillColor:'transparent',
                    }}
                >
                    Exam Already Attempted
                </h2>

                <p
                    className="mb-10"
                    style={{
                        color:'rgba(167,243,208,0.75)',
                        fontSize:'15px',
                        lineHeight:'1.8',
                    }}
                >
                    You have already completed this examination.
                    Multiple attempts are not allowed.
                </p>

                <button
                    onClick={() => navigate("/student-dashboard")}
                    className="premium-back-btn"
                    style={{
                        background:
                            'linear-gradient(135deg,#059669,#10b981)',
                        border:
                            '1px solid rgba(110,231,183,0.35)',
                        color:'#fff',
                        boxShadow:
                            '0 0 28px rgba(16,185,129,0.35)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform='translateY(-2px)';
                        e.currentTarget.style.boxShadow='0 0 42px rgba(16,185,129,0.45)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform='translateY(0)';
                        e.currentTarget.style.boxShadow='0 0 28px rgba(16,185,129,0.35)';
                    }}
                >
                    Back
                </button>
            </div>
        </div>
    </div>
)}


              {/* Error */}
{!questionsLoading && questionsError && (
    <div className="flex items-center justify-center py-20">
        <div
            className="w-full max-w-2xl rounded-3xl overflow-hidden text-center"
            style={{
                background:
                    'linear-gradient(160deg,rgba(239,68,68,0.12) 0%,rgba(12,10,30,0.92) 100%)',
                border:
                    '1px solid rgba(239,68,68,0.28)',
                boxShadow:
                    '0 0 60px rgba(239,68,68,0.14), 0 24px 64px rgba(0,0,0,0.55)',
                backdropFilter:'blur(22px)',
            }}
        >
            <div
                className="h-1"
                style={{
                    background:
                        'linear-gradient(90deg,#991b1b,#ef4444,#f87171)'
                }}
            />

            <div className="p-12">

                <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
                    style={{
                        background:
                            'rgba(239,68,68,0.15)',
                        border:
                            '1px solid rgba(239,68,68,0.35)',
                        boxShadow:
                            '0 0 32px rgba(239,68,68,0.25)',
                    }}
                >
                    <svg
                        width="42"
                        height="42"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f87171"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                </div>

                <h2
                    className="text-3xl sm:text-4xl font-black mb-4"
                    style={{
                        background:
                            'linear-gradient(90deg,#fecaca,#f87171)',
                        WebkitBackgroundClip:'text',
                        WebkitTextFillColor:'transparent',
                    }}
                >
                    Failed to Load Questions
                </h2>

                <p
                    className="mb-10"
                    style={{
                        color:'rgba(252,165,165,0.75)',
                        fontSize:'15px',
                        lineHeight:'1.8',
                    }}
                >
                    Something went wrong while loading the examination.
                    Please try again.
                </p>

                <button
                    onClick={fetchQuestions}
                    className="px-8 py-4 rounded-2xl font-bold transition-all duration-200"
                    style={{
                        background:
                            'linear-gradient(135deg,#991b1b,#ef4444)',
                        border:
                            '1px solid rgba(248,113,113,0.35)',
                        color:'#fff',
                        boxShadow:
                            '0 0 28px rgba(239,68,68,0.35)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform='translateY(-2px)';
                        e.currentTarget.style.boxShadow='0 0 42px rgba(239,68,68,0.45)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform='translateY(0)';
                        e.currentTarget.style.boxShadow='0 0 28px rgba(239,68,68,0.35)';
                    }}
                >
                    Retry Loading
                </button>
            </div>
        </div>
    </div>
)}

                {/* Instructions */}
                {!questionsLoading && !questionsError && !alreadyAttempted && questions.length > 0 && !examStarted && (
                    <div
                        className="rounded-3xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(160deg,rgba(109,40,217,0.13) 0%,rgba(12,10,30,0.85) 100%)',
                            border: '1px solid rgba(168,85,247,0.28)',
                            boxShadow: '0 0 60px rgba(109,40,217,0.18), 0 24px 64px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                        }}
                    >
                        {/* Top accent bar */}
                        <div className="h-1" style={{background:'linear-gradient(90deg,#7c3aed,#a855f7,#06b6d4)'}} />

                        <div className="p-10">
                            {/* Heading */}
                            <div className="text-center mb-10">
                                <div
                                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
                                    style={{
                                        background: 'rgba(124,58,237,0.2)',
                                        border: '1px solid rgba(168,85,247,0.35)',
                                        color: '#c4b5fd',
                                        boxShadow: '0 0 16px rgba(124,58,237,0.2)',
                                    }}
                                >
                                    <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#a855f7',boxShadow:'0 0 6px #a855f7',display:'inline-block'}} />
                                    Exam Ready
                                </div>
                                <h2
                                    className="text-3xl sm:text-4xl font-black mb-3"
                                    style={{
                                        background: 'linear-gradient(90deg,#f3e8ff,#c4b5fd,#a78bfa)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: 'none',
                                        filter: 'drop-shadow(0 0 18px rgba(168,85,247,0.45))',
                                    }}
                                >
                                    Exam Instructions
                                </h2>
                                <p style={{color:'rgba(196,181,253,0.55)',fontSize:'15px'}}>Please read all instructions carefully before starting.</p>
                            </div>

                            {/* Instruction items */}
                            <div className="space-y-3 mb-10">
                                {[
                                    { icon: '⏱', label: 'Duration', value: `${totalDuration} minutes`, accent: true },
                                    { icon: '📷', label: 'Webcam access is required throughout the exam.' },
                                    { icon: '🖥', label: 'Fullscreen mode will be enabled automatically.' },
                                    { icon: '⚠', label: 'Tab switching and fullscreen exit are monitored.' },
                                    { icon: '🚫', label: 'Multiple violations will auto-submit the exam.' },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 rounded-2xl transition-all duration-200"
                                        style={{
                                            padding: '14px 18px',
                                            background: item.accent
                                                ? 'linear-gradient(135deg,rgba(124,58,237,0.22),rgba(168,85,247,0.12))'
                                                : 'rgba(255,255,255,0.04)',
                                            border: item.accent
                                                ? '1px solid rgba(168,85,247,0.35)'
                                                : '1px solid rgba(255,255,255,0.07)',
                                            boxShadow: item.accent ? '0 0 20px rgba(124,58,237,0.15)' : 'none',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = item.accent
                                                ? 'linear-gradient(135deg,rgba(124,58,237,0.32),rgba(168,85,247,0.2))'
                                                : 'rgba(124,58,237,0.1)';
                                            e.currentTarget.style.border = '1px solid rgba(168,85,247,0.35)';
                                            e.currentTarget.style.boxShadow = '0 0 16px rgba(124,58,237,0.18)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = item.accent
                                                ? 'linear-gradient(135deg,rgba(124,58,237,0.22),rgba(168,85,247,0.12))'
                                                : 'rgba(255,255,255,0.04)';
                                            e.currentTarget.style.border = item.accent
                                                ? '1px solid rgba(168,85,247,0.35)'
                                                : '1px solid rgba(255,255,255,0.07)';
                                            e.currentTarget.style.boxShadow = item.accent ? '0 0 20px rgba(124,58,237,0.15)' : 'none';
                                        }}
                                    >
                                        <span style={{fontSize:'20px',flexShrink:0}}>{item.icon}</span>
                                        <span style={{color:'rgba(196,181,253,0.85)',fontSize:'14px',fontWeight:500}}>
                                            {item.label}
                                            {item.value && (
                                                <span style={{color:'#e9d5ff',fontWeight:800,marginLeft:'8px'}}>{item.value}</span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Capture / Preview */}
                            <div className="mb-6">
                                {!startFaceImage ? (
                                    <button
                                        onClick={startVerificationCapture}
                                        disabled={capturingPhoto}
                                        className="w-full py-4 rounded-2xl font-bold text-base transition-all duration-200"
                                        style={{
                                            background: capturingPhoto
                                                ? 'rgba(124,58,237,0.25)'
                                                : 'linear-gradient(135deg,rgba(109,40,217,0.55),rgba(168,85,247,0.4))',
                                            border: '1px solid rgba(168,85,247,0.45)',
                                            color: capturingPhoto ? 'rgba(196,181,253,0.5)' : '#e9d5ff',
                                            boxShadow: capturingPhoto ? 'none' : '0 0 24px rgba(124,58,237,0.3)',
                                            cursor: capturingPhoto ? 'not-allowed' : 'pointer',
                                        }}
                                        onMouseEnter={e => {
                                            if (!capturingPhoto) {
                                                e.currentTarget.style.boxShadow = '0 0 36px rgba(168,85,247,0.5)';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.boxShadow = capturingPhoto ? 'none' : '0 0 24px rgba(124,58,237,0.3)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                                <circle cx="12" cy="13" r="4" />
                                            </svg>
                                            {capturingPhoto ? 'Capturing...' : 'Capture Verification Photo'}
                                        </span>
                                    </button>
                                ) : (
                                    <div
                                        className="flex flex-col items-center rounded-3xl p-6"
                                        style={{
                                            background: 'linear-gradient(160deg,rgba(16,185,129,0.12),rgba(12,10,30,0.6))',
                                            border: '1px solid rgba(16,185,129,0.35)',
                                            boxShadow: '0 0 32px rgba(16,185,129,0.15)',
                                        }}
                                    >
                                        <div className="relative mb-4">
                                            <img
                                                src={startFaceImage}
                                                alt="Captured Face"
                                                className="w-44 h-36 object-cover rounded-2xl"
                                                style={{
                                                    border: '2px solid rgba(16,185,129,0.6)',
                                                    boxShadow: '0 0 24px rgba(16,185,129,0.35)',
                                                }}
                                            />
                                            <div
                                                className="absolute -top-2 -right-2 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                                                style={{
                                                    background: 'linear-gradient(135deg,#059669,#10b981)',
                                                    color: '#fff',
                                                    boxShadow: '0 0 12px rgba(16,185,129,0.5)',
                                                }}
                                            >
                                                ✓ Verified
                                            </div>
                                        </div>
                                        <p style={{color:'#6ee7b7',fontWeight:600,fontSize:'14px',marginBottom:'16px'}}>
                                            Verification photo captured successfully
                                        </p>
                                        <button
                                            onClick={() => {
                                                setStartFaceImage(null);
                                                startFaceImageRef.current = null;
                                                toast.success('Capture a new photo');
                                            }}
                                            className="px-6 py-2.5 rounded-xl font-semibold transition-all duration-200"
                                            style={{
                                                background: 'rgba(255,255,255,0.06)',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                color: 'rgba(196,181,253,0.7)',
                                                fontSize: '13px',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
                                        >
                                            Recapture Photo
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Start Exam button */}
                            <button
                                onClick={() => {
                                    if (!startFaceImage) {
                                        toast.error('Please capture verification photo first.');
                                        return;
                                    }
                                    startExam();
                                }}
                                className="w-full py-4 rounded-2xl font-black text-lg transition-all duration-200"
                                style={{
                                    background: startFaceImage
                                        ? 'linear-gradient(135deg,#6d28d9,#7c3aed,#a855f7)'
                                        : 'rgba(255,255,255,0.05)',
                                    border: startFaceImage
                                        ? '1px solid rgba(216,180,254,0.4)'
                                        : '1px solid rgba(255,255,255,0.08)',
                                    color: startFaceImage ? '#fff' : 'rgba(196,181,253,0.3)',
                                    boxShadow: startFaceImage
                                        ? '0 0 32px rgba(124,58,237,0.5), 0 8px 24px rgba(0,0,0,0.4)'
                                        : 'none',
                                    cursor: startFaceImage ? 'pointer' : 'not-allowed',
                                    letterSpacing: '0.5px',
                                }}
                                onMouseEnter={e => {
                                    if (startFaceImage) {
                                        e.currentTarget.style.boxShadow = '0 0 48px rgba(168,85,247,0.65), 0 12px 32px rgba(0,0,0,0.5)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = startFaceImage
                                        ? '0 0 32px rgba(124,58,237,0.5), 0 8px 24px rgba(0,0,0,0.4)'
                                        : 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                    Start Exam
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Exam */}
                {!questionsLoading && !questionsError && !alreadyAttempted && questions.length > 0 && examStarted && (
                <>

                    {/* Progress bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm font-semibold mb-2" style={{color:'rgba(196,181,253,0.7)'}}>
                            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                            <span>{answeredCount}/{questions.length} answered</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.07)'}}>
                            <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                                    background: 'linear-gradient(90deg,#7c3aed,#a855f7,#06b6d4)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Two-column layout: mini-map sidebar + question card */}
                    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">

                        {/* ── Question Mini Map (sticky sidebar) ── */}
                        <div
                            className="hidden lg:flex flex-col gap-0 flex-shrink-0"
                            style={{
                                width: '210px',
                                position: 'sticky',
                                top: '80px',
                                maxHeight: 'calc(100vh - 120px)',
                            }}
                        >
                            <div
                                className="rounded-2xl overflow-hidden"
                                style={{
                                    background: 'linear-gradient(160deg,rgba(124,58,237,0.13) 0%,rgba(12,10,30,0.7) 100%)',
                                    border: '1px solid rgba(168,85,247,0.18)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                                }}
                            >
                                {/* Mini-map header */}
                                <div
                                    className="px-4 py-3 flex items-center justify-between"
                                    style={{borderBottom:'1px solid rgba(168,85,247,0.12)'}}
                                >
                                    <span className="text-xs font-bold tracking-widest uppercase" style={{color:'rgba(196,181,253,0.6)'}}>Questions</span>
                                    <span
                                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                                        style={{background:'rgba(124,58,237,0.25)',color:'#c4b5fd',border:'1px solid rgba(167,139,250,0.2)'}}
                                    >
                                        {answeredCount}/{questions.length}
                                    </span>
                                </div>

                                {/* Scrollable grid */}
                                <div
                                    className="p-3 overflow-y-auto"
                                    style={{maxHeight:'calc(100vh - 260px)'}}
                                >
                                    <div className="grid grid-cols-4 gap-2">
                                        {questions.map((q, index) => {
                                            const answered = !!answers[q.id];
                                            const active   = currentQuestionIndex === index;
                                            const bookmarked = bookmarkedQuestions.includes(q.id);

                                            let bg, color, shadow, border;
                                            if (active) {
                                                bg     = 'linear-gradient(135deg,#7c3aed,#a855f7)';
                                                color  = '#fff';
                                                shadow = '0 0 12px rgba(168,85,247,0.7),0 0 24px rgba(124,58,237,0.4)';
                                                border = '2px solid rgba(216,180,254,0.6)';
                                            } else if (bookmarked) {
                                                bg     = 'rgba(234,179,8,0.2)';
                                                color  = '#fde68a';
                                                shadow = 'none';
                                                border = '2px solid rgba(234,179,8,0.5)';
                                            } else if (answered) {
                                                bg     = 'rgba(34,197,94,0.18)';
                                                color  = '#86efac';
                                                shadow = 'none';
                                                border = '2px solid rgba(34,197,94,0.35)';
                                            } else {
                                                bg     = 'rgba(255,255,255,0.05)';
                                                color  = 'rgba(196,181,253,0.55)';
                                                shadow = 'none';
                                                border = '2px solid rgba(255,255,255,0.08)';
                                            }

                                            return (
                                                <button
                                                    key={q.id}
                                                    onClick={() => setCurrentQuestionIndex(index)}
                                                    title={`Question ${index + 1}${answered ? ' — Answered' : ''}${bookmarked ? ' — Bookmarked' : ''}`}
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '10px',
                                                        background: bg,
                                                        color,
                                                        border,
                                                        boxShadow: shadow,
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        position: 'relative',
                                                    }}
                                                    onMouseEnter={e => {
                                                        if (!active) {
                                                            e.currentTarget.style.transform = 'scale(1.15)';
                                                            e.currentTarget.style.boxShadow = '0 0 10px rgba(168,85,247,0.4)';
                                                        }
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (!active) {
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                            e.currentTarget.style.boxShadow = shadow;
                                                        }
                                                    }}
                                                >
                                                    {bookmarked && !active ? '★' : index + 1}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Legend */}
                                <div
                                    className="px-4 py-3 space-y-1.5"
                                    style={{borderTop:'1px solid rgba(168,85,247,0.1)'}}
                                >
                                    {[
                                        {color:'linear-gradient(135deg,#7c3aed,#a855f7)', label:'Current'},
                                        {color:'rgba(34,197,94,0.5)',                     label:'Answered'},
                                        {color:'rgba(234,179,8,0.4)',                     label:'Bookmarked'},
                                        {color:'rgba(255,255,255,0.08)',                  label:'Unattempted'},
                                    ].map(({color: c, label}) => (
                                        <div key={label} className="flex items-center gap-2">
                                            <div style={{width:'10px',height:'10px',borderRadius:'3px',background:c,flexShrink:0}} />
                                            <span style={{fontSize:'11px',color:'rgba(196,181,253,0.5)'}}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Question Card (main content) ── */}
                        <div className="flex-1 min-w-0">

                            {/* Mobile mini-map (horizontal scroll) */}
                            <div
                                className="lg:hidden mb-5 rounded-2xl p-3 overflow-x-auto"
                                style={{
                                    background: 'linear-gradient(160deg,rgba(124,58,237,0.13) 0%,rgba(12,10,30,0.7) 100%)',
                                    border: '1px solid rgba(168,85,247,0.18)',
                                    backdropFilter: 'blur(20px)',
                                }}
                            >
                                <div className="flex gap-2" style={{minWidth:'max-content'}}>
                                    {questions.map((q, index) => {
                                        const answered    = !!answers[q.id];
                                        const active      = currentQuestionIndex === index;
                                        const bookmarked  = bookmarkedQuestions.includes(q.id);

                                        let bg, color, border;
                                        if (active)          { bg='linear-gradient(135deg,#7c3aed,#a855f7)'; color='#fff';              border='2px solid rgba(216,180,254,0.6)'; }
                                        else if (bookmarked) { bg='rgba(234,179,8,0.2)';                     color='#fde68a';           border='2px solid rgba(234,179,8,0.5)'; }
                                        else if (answered)   { bg='rgba(34,197,94,0.18)';                    color='#86efac';           border='2px solid rgba(34,197,94,0.35)'; }
                                        else                 { bg='rgba(255,255,255,0.05)';                  color='rgba(196,181,253,0.55)'; border='2px solid rgba(255,255,255,0.08)'; }

                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() => setCurrentQuestionIndex(index)}
                                                style={{
                                                    width:'34px', height:'34px', borderRadius:'9px',
                                                    background:bg, color, border,
                                                    fontSize:'11px', fontWeight:700,
                                                    flexShrink:0,
                                                    boxShadow: active ? '0 0 12px rgba(168,85,247,0.7)' : 'none',
                                                    transition:'all 0.2s',
                                                    display:'flex', alignItems:'center', justifyContent:'center',
                                                }}
                                            >
                                                {bookmarked && !active ? '★' : index + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Question Card */}
                            <div
                                className="rounded-3xl overflow-hidden premium-hover-lift"
                                style={{
                                    background: 'linear-gradient(160deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
                                    border: '1px solid rgba(168,85,247,0.15)',
                                    boxShadow: `0 0 0 1px rgba(168,85,247,0.08), 0 20px 60px rgba(0,0,0,0.55), 0 0 40px rgba(124,58,237,0.12)`,
                                    padding: 'clamp(18px, 3vw, 32px)',
                                    position:'relative',
                                    overflow:'hidden',
                                }}
                            >

                            <div
                                style={{
                                    position:'absolute',
                                    inset:0,
                                    background: 'radial-gradient(circle at top right, rgba(168,85,247,0.12), transparent 40%)',
                                    pointerEvents:'none',
                                }}
                            />
                                <div className="h-1" style={{background:'linear-gradient(90deg,#7c3aed,#a855f7,#06b6d4)'}} />
                                <div className="p-8">

                                    <div className="flex items-start gap-4 mb-8">
                                        <div
                                            className="w-10 h-10 rounded-xl font-bold flex items-center justify-center flex-shrink-0 text-white"
                                            style={{background:'linear-gradient(135deg,#7c3aed,#a855f7)',boxShadow:'0 0 16px rgba(124,58,237,0.5)'}}
                                        >
                                            {currentQuestionIndex + 1}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold leading-relaxed tracking-tight" style={{color:'rgba(243,232,255,0.95)'}}>
                                            {currentQuestion.questionText}
                                        </h2>
                                    </div>

                                    <div className="flex justify-end mb-6">
                                        <button
                                            onClick={() => toggleBookmark(currentQuestion.id)}
                                            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                                            style={{
                                                background: bookmarkedQuestions.includes(currentQuestion.id)
                                                    ? 'rgba(234,179,8,0.2)'
                                                    : 'rgba(255,255,255,0.06)',
                                                border: bookmarkedQuestions.includes(currentQuestion.id)
                                                    ? '1px solid rgba(234,179,8,0.4)'
                                                    : '1px solid rgba(255,255,255,0.1)',
                                                color: bookmarkedQuestions.includes(currentQuestion.id)
                                                    ? '#fde68a'
                                                    : 'rgba(196,181,253,0.6)',
                                            }}
                                        >
                                            {bookmarkedQuestions.includes(currentQuestion.id) ? '★ Bookmarked' : '☆ Bookmark'}
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {[currentQuestion.optionA, currentQuestion.optionB, currentQuestion.optionC, currentQuestion.optionD].map((option, i) => {
                                            const isSelected = answers[currentQuestion.id] === optionLabels[i];
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={async () => {
                                                        if (!document.fullscreenElement) {
                                                            try { await enterFullscreen(); } catch (e) { console.log(e); }
                                                        }
                                                        handleOptionSelect(currentQuestion.id, optionLabels[i]);
                                                    }}
                                                    className="w-full text-left flex items-center gap-4 transition-all duration-200"
                                                    style={{
                                                        padding: '14px 18px',
                                                        borderRadius: '16px',
                                                        border: isSelected
                                                            ? '2px solid rgba(168,85,247,0.7)'
                                                            : '2px solid rgba(255,255,255,0.07)',
                                                        background: isSelected
                                                            ? 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(168,85,247,0.15))'
                                                            : 'rgba(255,255,255,0.03)',
                                                        boxShadow: isSelected
                                                            ? '0 0 20px rgba(124,58,237,0.25),inset 0 1px 0 rgba(255,255,255,0.06)'
                                                            : 'none',
                                                    }}
                                                    onMouseEnter={e => {
                                                        if (!isSelected) {
                                                            e.currentTarget.style.border = '2px solid rgba(168,85,247,0.3)';
                                                            e.currentTarget.style.background = 'linear-gradient(135deg,rgba(124,58,237,0.16),rgba(168,85,247,0.08))';
                                                        }
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (!isSelected) {
                                                            e.currentTarget.style.border = '2px solid rgba(255,255,255,0.07)';
                                                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                                        }
                                                    }}
                                                >
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                                                        style={{
                                                            background: isSelected
                                                                ? 'linear-gradient(135deg,#7c3aed,#a855f7)'
                                                                : 'rgba(255,255,255,0.07)',
                                                            color: isSelected ? '#fff' : 'rgba(196,181,253,0.7)',
                                                            border: isSelected
                                                                ? '1px solid rgba(216,180,254,0.4)'
                                                                : '1px solid rgba(255,255,255,0.1)',
                                                            boxShadow: isSelected ? '0 0 10px rgba(124,58,237,0.5)' : 'none',
                                                        }}
                                                    >
                                                        {optionLabels[i]}
                                                    </div>
                                                    <span
                                                        className="font-medium"
                                                        style={{color: isSelected ? 'rgba(243,232,255,0.95)' : 'rgba(196,181,253,0.8)'}}
                                                    >
                                                        {option}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Navigation */}
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-stretch sm:items-center justify-between mt-10">
                                        <button
                                            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                                            disabled={currentQuestionIndex === 0}
                                            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                            style={{
                                                background: 'rgba(255,255,255,0.06)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                color: 'rgba(196,181,253,0.8)',
                                            }}
                                            onMouseEnter={e => { if (currentQuestionIndex !== 0) e.currentTarget.style.background='rgba(255,255,255,0.1)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
                                        >
                                            ← Previous
                                        </button>

                                        {currentQuestionIndex === questions.length - 1 ? (
                                            <button
                                                onClick={() => setShowSubmitConfirm(true)}
                                                className="premium-btn-primary w-full sm:w-auto px-8 py-3 text-sm font-bold"
                                            >
                                                Submit Exam
                                            </button>
                                        ) : (
                                            <button
                                                onClick={async () => {
                                                    if (!document.fullscreenElement) {
                                                        try { await enterFullscreen(); } catch (e) { console.log(e); }
                                                    }
                                                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                                                }}
                                                className="premium-btn-primary w-full sm:w-auto px-6 py-3 text-sm font-semibold"
                                            >
                                                Next →
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </>
                )}

            </div>


            <ConfirmModal
                isOpen={showSubmitConfirm}
                title="Submit Exam"
                message={
                    answeredCount < questions.length
                        ? `You still have ${questions.length - answeredCount} unanswered question${questions.length - answeredCount !== 1 ? "s" : ""}. Submit anyway?`
                        : "Are you sure you want to submit?"
                }
                confirmLabel="Submit"
                confirmClass="premium-btn-primary"
                onConfirm={submitExam}
                onCancel={() => setShowSubmitConfirm(false)}
            />

            {/* ───────────────── SUBMISSION PROCESSING OVERLAY ───────────────── */}

{submissionStage === "processing" && (

    <div className="submission-overlay">

        <div className="submission-card">

            <div className="submission-loader"></div>

            <div className="submission-icon-glow"></div>

            <h1 className="submission-title">
                Submitting Your Exam...
            </h1>

            <p className="submission-subtitle">
                Please wait while we securely process your responses,
                face verification, and exam activity.
            </p>

            <div className="submission-warning-box">

                <div className="submission-warning-item">
                    • Do not close the browser
                </div>

                <div className="submission-warning-item">
                    • Do not refresh the page
                </div>

                <div className="submission-warning-item">
                    • Do not disconnect internet
                </div>

                <div className="submission-warning-item">
                    • Uploading face verification securely
                </div>

            </div>

        </div>

    </div>
)}

{/* ───────────────── SUCCESS OVERLAY ───────────────── */}

{submissionStage === "success" && (

    <div className="submission-overlay">

        <div className="submission-card success-card">

            <div className="success-checkmark">

                ✓

            </div>

            <h1 className="submission-title success-title">
                Exam Submitted Successfully
            </h1>

            <p className="submission-subtitle">

                Thank you for attempting the examination.

                <br />

                Your responses have been securely recorded.

            </p>

            <button
                className="premium-btn-primary mt-6"
                onClick={handleViewResults}
            >
                View Results
            </button>

        </div>

    </div>
)}

        </div>
    );
}

export default ExamPage;
