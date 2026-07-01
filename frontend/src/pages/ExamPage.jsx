import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import PremiumLoader from "../components/PremiumLoader";
import QuestionPalette from "../components/exam/QuestionPalette";
import ExamInstructions from "../components/exam/ExamInstructions";
import QuestionCard from "../components/exam/QuestionCard";
import useExamTimer from "../hooks/useExamTimer";
import API from "../services/api";
import useViolationSystem from "../hooks/useViolationSystem";
import useCameraMonitoring from "../hooks/useCameraMonitoring";
import useSecurityMonitoring from "../hooks/useSecurityMonitoring";
import useExamPersistence from "../hooks/useExamPersistence";
import { speak } from "../utils/speechUtils";
import { isMobileDevice } from "../utils/deviceUtils";
import { timerColors } from "../constants/timerConfig";
import { fetchExamQuestions } from "../services/examService";
import { submitExamService } from "../services/examSubmissionService";
import { saveActiveSession, restoreActiveSession, markSessionSubmitted } from "../services/activeSessionService";
import { ShieldCheck, Signal, Clock3, AlertTriangle, TriangleAlert, CheckCircle2, CircleAlert, Camera, ArrowLeft, RefreshCw } from "lucide-react";

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
    const [submissionStage, setSubmissionStage] = useState("idle");
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [warning, setWarning] = useState("");
    const [flashWarning, setFlashWarning] = useState(false);
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [examStarted, setExamStarted] = useState(false);
    const [monitoringActive, setMonitoringActive] = useState(false);
    const [examReady, setExamReady] = useState(false);
    const [sessionRestored, setSessionRestored] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [fullscreenExited, setFullscreenExited] = useState(false);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const [startFaceImage, setStartFaceImage] = useState(null);
    const [endFaceImage, setEndFaceImage] = useState(null);
    const [captureCountdown, setCaptureCountdown] = useState(null);
    const [captureFlash, setCaptureFlash] = useState(false);
    const [capturingPhoto, setCapturingPhoto] = useState(false);
    const [violationTimeline, setViolationTimeline] = useState([]);
    const [resultData, setResultData] = useState(null);
    const [startingExam, setStartingExam] = useState(false);
    const [examConfig, setExamConfig] = useState(null);
    const [networkStatus, setNetworkStatus] = useState("good");

    // Refs — always hold current values, no stale closure issues
    const violationsRef = useRef(0);
    const submittedRef = useRef(false);
    const videoRef = useRef(null);
    const questionsRef = useRef([]);
    const streamRef = useRef(null);
    const answersRef = useRef({});
    const timeLeftRef = useRef(null);
    const faceIntervalRef = useRef(null);
    const startFaceImageRef = useRef(null);
    const endFaceImageRef = useRef(null);
    const violationTimelineRef = useRef([]);
    const flashTimeoutRef = useRef(null);
    const captureIntervalRef = useRef(null);
    const captureFlashTimeoutRef = useRef(null);
    const submittingRef = useRef(false);
    // const proctoringEnabled = examConfig?.examType === "PRACTICE" ? false : examConfig?.proctoringEnabled ?? true;
    const proctoringEnabled = examConfig?.examType !== "PRACTICE" && (examConfig?.proctoringEnabled ?? false);

    console.log( "Exam Type:", examConfig?.examType, "Proctoring:", proctoringEnabled );
    useEffect(() => {
    const checkNetwork = () => {

    if (!navigator.onLine) {
        setNetworkStatus("poor");
        return;
    }

    const connection = navigator.connection ||    navigator.mozConnection ||   navigator.webkitConnection;

    if (!connection) {
        setNetworkStatus("medium");
        return;
    }

    const type = connection.effectiveType;

    if (type === "4g") {
        setNetworkStatus("good");
    }
    else if (type === "3g") {
        setNetworkStatus("medium");
    }
    else {
        setNetworkStatus("poor");
    }
    };

    checkNetwork();
    const interval = setInterval(checkNetwork, 5000);

    return () => clearInterval(interval);
    }, []);

    useEffect(() => {

    const updateNetwork = () => {

        if (!navigator.onLine) {
            setNetworkStatus("poor");
            return;
        }

        const connection = navigator.connection;

        if (!connection) {
            setNetworkStatus("medium");
            return;
        }

        switch (connection.effectiveType) {

            case "4g":
                setNetworkStatus("good");
                break;

            case "3g":
                setNetworkStatus("medium");
                break;

            default:
                setNetworkStatus("poor");
        }
    };

    updateNetwork();

    window.addEventListener( "online", updateNetwork );

    window.addEventListener("offline", updateNetwork);

    return () => {
        window.removeEventListener( "online", updateNetwork );

        window.removeEventListener("offline",updateNetwork );
    };

    }, []);

    useEffect(() => {
        if (!proctoringEnabled) {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            setCameraEnabled(false);
            return;
        }

        if (!examStarted) return;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
                setCameraEnabled(true);
            } catch (err) {
                console.log(err);
                setCameraEnabled(false);
            }
        };

        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            setCameraEnabled(false);
        };
    }, [examStarted, proctoringEnabled]);

    useEffect(() => { return () => { clearTimeout(flashTimeoutRef.current); }; }, []);
    useEffect(() => { return () => { clearInterval(captureIntervalRef.current); }; }, []);
    useEffect(() => { return () => { clearTimeout(captureFlashTimeoutRef.current); }; }, []);

    // Keep refs in sync with state
    useEffect(() => {
        questionsRef.current = questions;
        answersRef.current = answers;
        timeLeftRef.current = timeLeft;
        startFaceImageRef.current = startFaceImage;
        endFaceImageRef.current = endFaceImage;
    }, [questions, answers, timeLeft, startFaceImage, endFaceImage]);

    // ── Hoisted helpers (component scope, no stale closures) ──
    const triggerFlashWarning = useCallback(() => {
        clearTimeout(flashTimeoutRef.current);
        setFlashWarning(true);
        flashTimeoutRef.current = setTimeout(() => {
            setFlashWarning(false);
        }, 600);
    }, []);

    const captureFaceSnapshot = useCallback(() => {
        const video = videoRef.current;
        if (!video) {
            console.log("No video ref available");
            return null;
        }
        if (video.readyState < 2) {
            console.log("Video not ready yet");
            return null;
        }

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL("image/jpeg");
        console.log("Snapshot captured:", !!image);
        return image;
    }, []);

    // ── submitExam uses refs so it never reads stale state ──
    const submitExam = useCallback(async () => {
        if (submittedRef.current || submittingRef.current) return;

        submittingRef.current = true;
        setShowSubmitConfirm(false);
        setSubmissionStage("processing");
        const qs = questionsRef.current;
        const ans = answersRef.current;
        const tl = timeLeftRef.current;

        try {
            const result = await submitExamService({ questions: qs, answers: ans, examId, violations: violationsRef.current, startFaceImage: startFaceImageRef.current, endFaceImage: endFaceImageRef.current, violationTimeline: violationTimelineRef.current, captureFaceSnapshot, streamRef, faceIntervalRef });
            submittedRef.current = true;
            setSubmitted(true);
            await markSessionSubmitted(localStorage.getItem("email"), Number(examId));
            setResultData({ examId, examType: questionsRef.current[0]?.exam?.examType || "MAIN", score: result.finalScore, correctAnswers: result.correctAnswers, wrongAnswers: result.wrongAnswers, totalQuestions: result.totalQuestions, examTitle: result.examTitle, timeTaken: qs[0]?.exam ? `${Math.floor((qs[0]?.exam.duration * 60 - (tl || 0)) / 60)} min` : "N/A", questions: qs, answers: ans, violations: violationsRef.current });
            submittingRef.current = false;
            setSubmissionStage("success");
        } catch (error) {
            console.log(error);
            submittingRef.current = false;
            setSubmissionStage("idle");
            toast.error("Failed to submit exam");
        }
    }, [examId, captureFaceSnapshot]);

    useEffect(() => {
        if (timeLeft === 60) toast.error("Only 1 minute remaining!");
    }, [timeLeft]);

    // ── Live monitor ping ──
    useEffect(() => {
        if (!examStarted || submittedRef.current || alreadyAttempted) return;

        const interval = setInterval(async () => {
            try {
                const studentName = localStorage.getItem("name") || "Unknown";
                const examTitle = questionsRef.current[0]?.exam?.title || `Exam ${examId}`;
                await API.post("/monitor/update", {
                    studentName: studentName || "Unknown Student",
                    examTitle: examTitle || "Unknown Exam",
                    violations: violationsRef.current || 0,
                    timeLeft: timeLeftRef.current || 0,
                    status: submittedRef.current ? "SUBMITTED" : "ACTIVE"
                });
            } catch (err) {
                console.log("LIVE MONITOR ERROR:", err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [examStarted, alreadyAttempted, examId, submitted]);

    const fetchQuestions = useCallback(async () => {
        setQuestionsLoading(true);
        setQuestionsError(false);
        const studentName = localStorage.getItem("name") || "";
        try {
            const result = await fetchExamQuestions({ examId, studentName });
            setQuestions(result.questions);
            if (result.exam?.examType === "PRACTICE") {
                setExamStarted(true);
                setExamReady(true);
                setMonitoringActive(false);
                setFullscreenExited(false);
                setCameraEnabled(false);
            }
            setExamConfig(result.exam);
            setAlreadyAttempted(result.exam?.examType !== "PRACTICE" ? result.alreadyAttempted : false);
            setTotalDuration(result.duration);
            if (!sessionRestored) { setTimeLeft(result.duration * 60); }
        } catch (error) {
            console.log(error);
            setQuestionsError(true);
            toast.error("Failed to load questions.");
        } { setQuestionsLoading(false); }
    }, [examId, sessionRestored]);

    useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

    useEffect(() => {
        if (examConfig?.examType === "PRACTICE" && questions.length > 0 && !examStarted) {
            setExamStarted(true);
            setExamReady(true);
            setMonitoringActive(false);
            setFullscreenExited(false);
            setCameraEnabled(false);

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }
    }, [examConfig, questions, examStarted]);

    useEffect(() => {
        if (sessionRestored) return;
        if (questionsLoading) return;
        if (examConfig?.examType === "PRACTICE") {
            setCheckingSession(false);
            return;
        }

        const restoreSession = async () => {
            try {
                const email = localStorage.getItem("email");
                if (!email) return;

                const session = await restoreActiveSession(email, Number(examId));
                if (!session) {
                    setCheckingSession(false);
                    return;
                }

                if (session.answersJson) {
                    setAnswers(JSON.parse(session.answersJson));
                }
                if (session.bookmarksJson) {
                    setBookmarkedQuestions(JSON.parse(session.bookmarksJson));
                }
                if (typeof session.timeLeft === "number") {
                    setTimeLeft(session.timeLeft);
                }
                if (typeof session.currentQuestionIndex === "number") {
                    setCurrentQuestionIndex(session.currentQuestionIndex);
                }
                if (proctoringEnabled && !document.fullscreenElement) {
                    setFullscreenExited(true);
                    setTimeout(() => {
                        toast.error("Please re-enter fullscreen mode");
                    }, 0);
                }
                setSessionRestored(true);
                if (session.timeLeft > 0) {
                    setTimeLeft(session.timeLeft);
                }
                if (proctoringEnabled) {
                    toast.success("Previous exam session restored");
                }
                setCheckingSession(false);
            } catch (err) {
                console.log("No active session found");
                setCheckingSession(false);
            }
        };

        restoreSession();
    }, [examId, questionsLoading]);

    const handleOptionSelect = useCallback((questionId, optionKey) => {
        if (submittedRef.current) return;
        const updated = {
            ...answersRef.current,
            [questionId]: optionKey
        };
        answersRef.current = updated;
        setAnswers(updated);
    }, []);

    const toggleBookmark = useCallback((questionId) => {
        setBookmarkedQuestions((prev) => {
            if (prev.includes(questionId)) {
                return prev.filter((id) => id !== questionId);
            }
            return [...prev, questionId];
        });
    }, []);

    const handleViewResults = useCallback(() => {
        navigate("/result", { state: resultData });
    }, [navigate, resultData]);

    useExamTimer({ examStarted, timeLeft, submitted, setTimeLeft, submitExam });
    const { handleViolation } = useViolationSystem({ submittedRef, violationsRef, violationTimelineRef, setViolationTimeline, setWarning, triggerFlashWarning, submitExam, questionsRef, examId, setCameraEnabled, proctoringEnabled });

    useCameraMonitoring({
        examStarted: proctoringEnabled ? examStarted : false,
        alreadyAttempted: proctoringEnabled ? alreadyAttempted : true,
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
    });

    useSecurityMonitoring({
        examStarted: proctoringEnabled ? examStarted : false,
        alreadyAttempted: proctoringEnabled ? alreadyAttempted : true,
        submitted,
        submittedRef,
        handleViolation,
        setFullscreenExited,
        setWarning
    });

    useExamPersistence({
        examId,
        examStarted,
        submitted,
        answers,
        bookmarkedQuestions,
        currentQuestionIndex,
        timeLeft,
        violations: violationsRef.current,
        violationTimeline: violationTimelineRef.current,
        setAnswers,
        setBookmarkedQuestions,
        setCurrentQuestionIndex,
        setTimeLeft,
        setViolations: (count) => {
            violationsRef.current = count;
        },
        setViolationTimeline: (timeline) => {
            violationTimelineRef.current = timeline;
            setViolationTimeline(timeline);
        }
    });

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
            if (faceIntervalRef.current) {
                clearInterval(faceIntervalRef.current);
                faceIntervalRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!examStarted || submitted) return;
        if (examConfig?.examType === "PRACTICE") return;

        const interval = setInterval(async () => {
            try {
                const email = localStorage.getItem("email");
                const name = localStorage.getItem("name");
                if (!email) return;

                await saveActiveSession({
                    studentEmail: email,
                    studentName: name,
                    examId: Number(examId),
                    examTitle: questionsRef.current[0]?.exam?.title || "",
                    timeLeft: timeLeftRef.current || 0,
                    currentQuestionIndex,
                    violations: violationsRef.current,
                    answersJson: JSON.stringify(answersRef.current),
                    bookmarksJson: JSON.stringify(bookmarkedQuestions)
                });
            } catch (err) {
                console.log("SESSION SYNC FAILED", err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [examStarted, submitted, examId, currentQuestionIndex, bookmarkedQuestions]);

    const startVerificationCapture = useCallback(async () => {
        if (!proctoringEnabled) return;
        try {
            if (!streamRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = streamRef.current;
                await videoRef.current.play();
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to access camera");
            return;
        }

        if (capturingPhoto) return;

        setCapturingPhoto(true);
        speak("Please look at the camera");
        let count = 3;
        setCaptureCountdown(count);

        captureIntervalRef.current = setInterval(() => {
            count--;
            if (count > 0) {
                setCaptureCountdown(count);
            } else {
                clearInterval(captureIntervalRef.current);
                setCaptureCountdown(null);
                setCaptureFlash(true);
                clearTimeout(captureFlashTimeoutRef.current);
                captureFlashTimeoutRef.current = setTimeout(() => {
                    setCaptureFlash(false);
                }, 250);

                const image = captureFaceSnapshot();
                if (image) {
                    setStartFaceImage(image);
                    toast.success("Verification photo captured");
                    speak("Photo captured successfully");
                } else {
                    toast.error("Failed to capture photo");
                }
                setCapturingPhoto(false);
            }
        }, 1000);
    }, [capturingPhoto, captureFaceSnapshot]);

    const reEnterFullscreen = async () => {
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            }
            setFullscreenExited(false);
        } catch (e) {
            console.log(e);
        }
    };

    const startExam = useCallback(async () => {
        if (startingExam) return;
        setStartingExam(true);
        console.log("START EXAM CLICKED");

        try {
            if (questions.length > 0 && questions[0]?.exam?.duration) {
                setTimeLeft(questions[0].exam.duration * 60);
            }

        localStorage.removeItem(
            `exam_started_${examId}`
        );

        const now = new Date();

        const localDateTime =
            now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0") + "T" +
            String(now.getHours()).padStart(2, "0") + ":" +
            String(now.getMinutes()).padStart(2, "0") + ":" +
            String(now.getSeconds()).padStart(2, "0");

        localStorage.setItem(
            `exam_started_${examId}`,
            localDateTime
        );

            setExamStarted(true);

            if (proctoringEnabled) {
                setExamReady(false);
                try {
                    const elem = document.documentElement;
                    if (elem.requestFullscreen) {
                        await elem.requestFullscreen();
                    }
                    setTimeout(() => {
                        setMonitoringActive(true);
                        setExamReady(true);
                    }, 1500);
                } catch (err) {
                    console.log(err);
                    toast.error("Fullscreen access required");
                }
            }

            const email = localStorage.getItem("email");
            const name = localStorage.getItem("name");

            if (email && proctoringEnabled) {
                try {
                    await saveActiveSession({
                        studentEmail: email,
                        studentName: name,
                        examId: Number(examId),
                        examTitle: questions[0]?.exam?.title || "",
                        timeLeft: questions[0]?.exam?.duration * 60 || 0,
                        currentQuestionIndex: 0,
                        violations: 0,
                        answersJson: JSON.stringify({}),
                        bookmarksJson: JSON.stringify([])
                    });
                } catch (err) {
                    console.log("INITIAL SESSION SAVE FAILED", err);
                }
            }
        } catch (e) {
            console.log("Fullscreen failed:", e);
        } finally {
            setStartingExam(false);
        }
    }, [startingExam, questions]);

    const displayTime = timeLeft !== null ? timeLeft : 0;
    const safeTime = typeof displayTime === "number" && !isNaN(displayTime) ? displayTime : 0;
    const minutes = Math.floor(safeTime / 60);
    const seconds = safeTime % 60;
    const answeredCount = Object.keys(answers).length;
    const currentQuestion = questions[currentQuestionIndex] || null;
    const totalDurationInSeconds = totalDuration * 60;
    const timerPercentage = totalDurationInSeconds > 0 ? (displayTime / totalDurationInSeconds) * 100 : 0;
    const optionLabels = ["A", "B", "C", "D"];
    const networkConfig = {
    good: {
        text: "Excellent",
        color: "text-green-400",
        glow: "shadow-green-500/40"
    },

    medium: {
        text: "Medium",
        color: "text-yellow-400",
        glow: "shadow-yellow-500/40"
    },

    poor: {
        text: "Poor",
        color: "text-red-400",
        glow: "shadow-red-500/40"
    }
    };
    const timerUrgency = safeTime < 30 ? "danger" : safeTime < 120 ? "critical" : safeTime < 300 ? "warning" : "normal";
    const tc = timerColors[timerUrgency];

    if (isMobileDevice()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 text-center">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Desktop Required</h1>
                    <p className="text-gray-300 text-lg">This exam can only be attended on a desktop or laptop device.</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen relative ${examStarted ? "select-none" : ""} ${flashWarning ? "bg-red-900" : "bg-[#0c0a1e]"} transition-colors duration-150`}
            onCopy={(e) => {
                if (examStarted && !submitted && !submittedRef.current) {
                    e.preventDefault();
                    handleViolation("Copy attempt detected");
                }
            }}
        >
            {captureCountdown && (
                <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center">
                    <div className="text-white text-9xl font-black animate-pulse">{captureCountdown}</div>
                </div>
            )}

            {captureFlash && (
                <div className="fixed inset-0 z-[99998] bg-white animate-pulse" />
            )}

            {/* Header */}
            <div className="exam-topbar">
                <div className="exam-topbar-inner">
                    <div className="exam-brand">
                        <div className="exam-brand-icon"><ShieldCheck className="w-4 h-4 text-white" /></div>
                        <div>
                            <p className="exam-brand-title">Smart Exam Portal</p>
                            <p className="exam-brand-subtitle">Examination in Progress</p>
                        </div>
                     </div>

                     {!alreadyAttempted && (
                        <>
                            <div className="flex items-center gap-3">
                                <Signal
                                    className={`w-5 h-5 ${networkConfig[networkStatus].color}`}
                                    title={networkConfig[networkStatus].text}
                                    style={{ filter: networkStatus === "good" ? "drop-shadow(0 0 6px #22c55e)" : networkStatus === "medium" ? "drop-shadow(0 0 6px #eab308)" : "drop-shadow(0 0 6px #ef4444)" }}
                                />
                            <div
                                className={`exam-timer-pill text-sm sm:text-base ${timerUrgency === 'danger' || timerUrgency === 'critical' ? ' exam-timer-critical' : timerUrgency === 'warning' ? ' exam-timer-warning' : ''}`}
                                style={{
                                    background: tc.bg,
                                    boxShadow: `0 0 18px ${tc.glow}, 0 2px 8px rgba(0,0,0,0.4)`,
                                    border: `1px solid ${tc.border}`,
                                    color: tc.text
                                }}
                            >
                                <Clock3 className="w-3.5 h-3.5 opacity-85 flex-shrink-0" />
                                <span className="exam-timer-digits">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                                {timerUrgency !== 'normal' && (
                                    <span className="exam-timer-label">{timerUrgency === 'danger' ? 'Final Seconds' : timerUrgency === 'critical' ? 'Critical' : 'Low'}</span>
                                )}
                            </div>

                        </div>
                        </>
                    )}
                </div>
            </div>

            {/* Timer bar */}
            <div className="w-full h-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                    className={`h-full transition-all duration-1000 ${timerUrgency === 'critical' ? ' exam-timerbar-pulse' : ''}`}
                    style={{ width: `${timerPercentage}%`, background: timerUrgency === 'critical' ? 'linear-gradient(90deg,#991b1b,#ef4444,#f87171)' : timerUrgency === 'warning' ? 'linear-gradient(90deg,#c2410c,#f97316,#fb923c)' : 'linear-gradient(90deg,#facc15,#eab308,#f59e0b)', boxShadow: timerUrgency === 'critical' ? '0 0 8px rgba(239,68,68,0.7)' : timerUrgency === 'warning' ? '0 0 8px rgba(249,115,22,0.6)' : '0 0 6px rgba(124,58,237,0.5)', borderRadius: '0 2px 2px 0', transition: 'width 1s linear, background 0.8s ease, box-shadow 0.8s ease' }}
                />
            </div>

            {/* Camera preview */}
            {proctoringEnabled && !alreadyAttempted && !submitted && (
                <div className="exam-camera-preview">
                    <div className={`exam-camera-card ${cameraEnabled ? "online" : "offline"}`}>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="exam-camera-video"/>
                        <div className={`exam-camera-footer ${cameraEnabled ? "online" : "offline"}`}>
                           <span className={`exam-camera-dot ${cameraEnabled ? "online" : "offline"}`} />
                           <span className={`exam-camera-status ${cameraEnabled ? "online" : "offline"}`}></span>
                        </div>
                    </div>
                </div>
            )}

            {proctoringEnabled && examReady && fullscreenExited && (
                <div className="exam-fullscreen-overlay">
                    <div className="exam-fullscreen-card">
                        <div className="exam-fullscreen-topline" />
                        <div className="exam-fullscreen-content">
                            <div className="exam-fullscreen-icon">
                                <TriangleAlert className="w-7 h-7 text-red-400" />
                            </div>
                            <h2 className="exam-fullscreen-title">Fullscreen Required</h2>
                            <p className="exam-fullscreen-text">You exited fullscreen mode. Please return to fullscreen to continue the exam.</p>
                            <button
                                onClick={reEnterFullscreen}
                                className="exam-fullscreen-btn">
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
                        <div className="exam-warning-banner w-full max-w-2xl" role="status" aria-live="polite">
                            <div className="exam-warning-banner-icon" aria-hidden="true">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="exam-warning-banner-kicker">Violation detected</p>
                                <p className="exam-warning-banner-text">{warning}</p>
                            </div>
                        </div>
                    </div>
                )}

                {questionsLoading && (
                    <PremiumLoader
                        title="Preparing Examination..."
                        subtitle={proctoringEnabled ? "Loading questions, verification system, and exam environment." : "Loading practice exam..."}
                        height="70vh"
                    />
                )}

                {!questionsLoading && examStarted && proctoringEnabled && !examReady && (
                    <PremiumLoader
                        title="Starting Secure Environment..."
                        subtitle="Initializing camera, fullscreen, and monitoring system."
                        height="70vh"
                    />
                )}

                {/* Already Attempted */}
                {!questionsLoading && alreadyAttempted && (
                    <div className="flex items-center justify-center py-20">
                        <div className="exam-status-card success">
                            <div className="exam-status-topline success" />
                            <div className="exam-status-content">
                                <div className="exam-status-icon success">
                                    <CheckCircle2 className="w-11 h-11 text-emerald-400" />
                                </div>
                                <h2 className="exam-status-title success">Exam Already Attempted</h2>
                                <p className="exam-status-text success mb-10">You have already completed this examination. Multiple attempts are not allowed.</p>
                                <button
                                    onClick={() => navigate("/student-dashboard")}
                                    className="premium-back-btn"
                                    style={{ background: 'linear-gradient(135deg,#059669,#10b981)', border: '1px solid rgba(110,231,183,0.35)', color: '#fff', boxShadow: '0 0 28px rgba(16,185,129,0.35)' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 42px rgba(16,185,129,0.45)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(16,185,129,0.35)'; }}
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
                        <div className="exam-status-card error">
                            <div className="exam-status-topline error" />
                            <div className="exam-status-content">
                                <div className="exam-status-icon error">
                                    <CircleAlert className="w-11 h-11 text-red-400" />
                                </div>
                                <h2 className="exam-status-title error">Failed to Load Questions</h2>
                                <p className="exam-status-text error mb-10">Something went wrong while loading the examination. Please try again.</p>
                                <button
                                    onClick={fetchQuestions}
                                    className="px-8 py-4 rounded-2xl font-bold transition-all duration-200"
                                    style={{ background: 'linear-gradient(135deg,#991b1b,#ef4444)', border: '1px solid rgba(248,113,113,0.35)', color: '#fff', boxShadow: '0 0 28px rgba(239,68,68,0.35)' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 42px rgba(239,68,68,0.45)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(239,68,68,0.35)'; }}
                                >
                                    <div className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /><span>Retry Loading</span></div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!questionsLoading && !questionsError && !alreadyAttempted && questions.length > 0 && !examStarted && proctoringEnabled && (
                    <ExamInstructions
                        totalDuration={totalDuration}
                        startFaceImage={startFaceImage}
                        setStartFaceImage={setStartFaceImage}
                        startFaceImageRef={startFaceImageRef}
                        startVerificationCapture={startVerificationCapture}
                        capturingPhoto={capturingPhoto}
                        startExam={startExam}
                    />
                )}

                {/* Main Exam */}
                {!questionsLoading && !questionsError && !alreadyAttempted && questions.length > 0 && examStarted && (!proctoringEnabled || examReady) && (
                    <>
                        {/* Progress bar */}
                        <div className="exam-progress-wrap">
                            <div className="exam-progress-header">
                                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                                <span>{answeredCount}/{questions.length} answered</span>
                            </div>
                            <div className="exam-progress-track">
                                <div className="exam-progress-fill"
                                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}
                                />
                            </div>
                        </div>

                        {/* Two-column layout: mini-map sidebar + question card */}
                        <div className="exam-main-grid">
                            <div className="exam-left-panel">
                            <QuestionPalette questions={questions} answers={answers} bookmarkedQuestions={bookmarkedQuestions} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} answeredCount={answeredCount} />
                            </div>
                            {/* ── Question Card (main content) ── */}
                            <div className="exam-right-panel">
                                {currentQuestion && (
                                    <QuestionCard currentQuestion={currentQuestion} currentQuestionIndex={currentQuestionIndex} questions={questions} answers={answers} handleOptionSelect={handleOptionSelect} optionLabels={optionLabels} bookmarkedQuestions={bookmarkedQuestions} toggleBookmark={toggleBookmark} setCurrentQuestionIndex={setCurrentQuestionIndex} setShowSubmitConfirm={setShowSubmitConfirm} />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <ConfirmModal
                isOpen={showSubmitConfirm}
                title="Submit Exam"
                message={answeredCount < questions.length ? `You still have ${questions.length - answeredCount} unanswered question${questions.length - answeredCount !== 1 ? "s" : ""}. Submit anyway?` : "Are you sure you want to submit?"}
                confirmLabel="Submit"
                confirmClass="premium-btn-primary"
                onConfirm={submitExam}
                onCancel={() => setShowSubmitConfirm(false)}
            />

            {/* ── SUBMISSION PROCESSING OVERLAY ── */}
            {submissionStage === "processing" && (
                <div className="submission-overlay">
                    <div className="submission-card">
                        <div className="submission-loader"></div>
                        <div className="submission-icon-glow"></div>
                        <h1 className="submission-title">Submitting Your Exam...</h1>
                        <p className="submission-subtitle">Please wait while we securely process your responses, face verification, and exam activity.</p>
                        <div className="submission-warning-box">
                            <div className="submission-warning-item">• Do not close the browser</div>
                            <div className="submission-warning-item">• Do not refresh the page</div>
                            <div className="submission-warning-item">• Do not disconnect internet</div>
                            <div className="submission-warning-item">• Uploading face verification securely</div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── SUCCESS OVERLAY ── */}
            {submissionStage === "success" && (
                <div className="submission-overlay">
                    <div className="submission-card success-card">
                        <div className="success-checkmark">
                            <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                        </div>
                        <h1 className="submission-title success-title">Exam Submitted Successfully</h1>
                        <p className="submission-subtitle">Thank you for attempting the examination.<br />Your responses have been securely recorded.</p>
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