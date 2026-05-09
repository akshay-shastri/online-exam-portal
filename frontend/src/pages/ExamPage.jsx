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
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [warning, setWarning] = useState("");
    const [flashWarning, setFlashWarning] = useState(false);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [examStarted, setExamStarted] = useState(false);
    const [fullscreenExited, setFullscreenExited] = useState(false);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const [startFaceImage, setStartFaceImage] = useState(null);
    const [endFaceImage,setEndFaceImage] = useState(null);
    const isMobile = window.innerWidth < 768;

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

    // ── submitExam uses refs so it never reads stale state ──

    const submitExam = useCallback(async () => {
        if (submittedRef.current) return;
        submittedRef.current = true;
        setSubmitted(true);
        setShowSubmitConfirm(false);
        setSubmitting(true);

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
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const endImage = captureFaceSnapshot();
        setEndFaceImage(endImage);
        endFaceImageRef.current = endImage;

        try {
            await API.post("/results", { studentName, email, examTitle, score: finalScore, totalQuestions, percentage, startFaceImage: startFaceImageRef.current, endFaceImage: endFaceImageRef.current });
        } catch (error) {
            console.log(error);
        }

        localStorage.removeItem(`exam_answers_${examId}`);

        localStorage.removeItem(`violations_${examId}`);

        // Stop camera stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
        }

        navigate("/result", {
            state: {
                score: finalScore,
                correctAnswers,
                wrongAnswers,
                totalQuestions,
                examTitle,
                timeTaken: qs[0]?.exam ? `${Math.floor((qs[0].exam.duration * 60 - (tl || 0)) / 60)} min`: "N/A",
                questions: qs,
                answers: ans,

                
                violations: violationsRef.current,
}
        });
    }, [examId, navigate]);

   // ── Violation handler — uses ref, never stale ──

const handleViolation = useCallback((reason) => {

    console.log("VIOLATION:", reason);

    if (submittedRef.current) return;

    if (violationsRef.current >= 3) return;

    violationsRef.current += 1;

    const count = violationsRef.current;

    triggerFlashWarning();

    playWarningSound();

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

        toast.error(
            "Exam auto-submitted due to multiple violations."
        );

        submitExam();
    }

}, [
    triggerFlashWarning,
    playWarningSound,
    submitExam,
    examId
]);


    // ── Timer ──

    useEffect(() => {
        if (timeLeft === null || submitted) return;
        if (timeLeft <= 0) { submitExam(); return; }
        const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, submitted, submitExam]);

    useEffect(() => {
        if (timeLeft === 60) toast.error("Only 1 minute remaining!");
    }, [timeLeft]);


  // ── Tab switch monitoring ──

  useEffect(() => {

    if (!examStarted) return;

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

    const handleFullscreenChange = () => {

        if (
            examStarted &&
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

}, [examStarted, handleViolation]);

// DEVTOOLS
useEffect(() => {

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

        if (e.ctrlKey && key === "c") {

            e.preventDefault();
            handleViolation("Copy shortcut detected");

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

}, [handleViolation]);

    // ── Camera startup + track monitoring ──

    useEffect(() => {
        if ( alreadyAttempted || submitted) return;

        let cancelled = false;

       const startCamera = async () => {

    try {

        await faceapi
            .nets
            .tinyFaceDetector
            .loadFromUri("/models");

        if (cancelled) return;

        const stream =
            await navigator
                .mediaDevices
                .getUserMedia({
                    video: true
                });

        if (cancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // Try to ensure playback before starting face detection.
            try { videoRef.current.play().catch(() => {}); } catch (e) {}

            if (videoRef.current.readyState < 2) {
                await new Promise((resolve) => {
                    videoRef.current.onloadedmetadata = () => resolve();
                });
            }
        }

        setCameraEnabled(true);

        // clear any existing interval before creating a new one
        if (faceIntervalRef.current) {
            clearInterval(faceIntervalRef.current);
            faceIntervalRef.current = null;
        }

        faceIntervalRef.current = setInterval(async () => {
            if (cancelled || !videoRef.current || submittedRef.current) return;
            if (videoRef.current.readyState < 2) return;

            try {
                const detections = await faceapi.detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                );

                console.log("Face detections:", detections);

                if (
    detections.length === 0) {

    handleViolation(
        "No face detected"
    );
} else if (detections.length > 1) {
                    handleViolation("Multiple faces detected");
                }
            } catch (err) {
                console.error("Face detection error:", err);
            }
        }, 2500);

                // Monitor each video track for disable/disconnect
                stream.getVideoTracks().forEach((track) => {
                    track.addEventListener("ended", () => {
                        setCameraEnabled(false);
                        triggerFlashWarning();
                        playWarningSound();
                        setWarning("Warning: Camera disconnected. Exam auto-submitted.");
                        toast.error("Camera disconnected. Exam auto-submitted.");
                        submitExam();
                    });

                    track.addEventListener("mute", () => {
                        setCameraEnabled(false);
                        triggerFlashWarning();
                        playWarningSound();
                        setWarning("Warning: Camera disabled. Exam auto-submitted.");
                        toast.error("Camera disabled. Exam auto-submitted.");
                        submitExam();
                    });
                });

            } catch (error) {
                if (cancelled) return;
                console.error("Camera/Object Detection Error:", error);
                setCameraEnabled(false);
                triggerFlashWarning();
                playWarningSound();
                setWarning("Warning: Camera access is required during exam.");
                toast.error("Camera access denied.");
            }
        };

        startCamera();

        return () => {
            cancelled = true;
            if (faceIntervalRef.current) {
                clearInterval(faceIntervalRef.current);
                faceIntervalRef.current = null;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
            }
        };
    }, [examStarted, triggerFlashWarning, playWarningSound, submitExam]);

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

    setTimeLeft(
        shuffled[0].exam.duration * 60
    );

} else {

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

    if (!videoRef.current)
        return null;

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        videoRef.current.videoWidth;

    canvas.height =
        videoRef.current.videoHeight;

    const ctx =
        canvas.getContext("2d");

    ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return canvas.toDataURL(
        "image/jpeg"
    );
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
    const totalDuration = questions.length > 0 && questions[0].exam
        ? questions[0].exam.duration * 60
        : 300;
    const timerPercentage = (displayTime / totalDuration) * 100;
    const optionLabels = ["A", "B", "C", "D"];


    if (isMobile) {

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
    className={`min-h-screen relative ${examStarted ? "select-none": "" } ${flashWarning ? "bg-red-200": "bg-[#f0f4ff] dark:bg-gray-950"} transition-colors duration-150`}

    onCopy={(e) => { if (examStarted) {e.preventDefault();
            handleViolation("Copy attempt detected");
        }
    }}>

            {/* Header */}
            <div className="sticky top-0 z-50 bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-blue-600">Smart Exam Portal</h1>
                        <p className="text-xs text-gray-400">Examination in Progress</p>
                    </div>
                    {!alreadyAttempted && (
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-xl font-bold shadow-md">
                            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                        </div>
                    )}
                </div>
            </div>

            {/* Timer bar */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div
                    className={`h-2 transition-all duration-1000 ${timerPercentage > 50 ? "bg-green-500" : timerPercentage > 20 ? "bg-yellow-400" : "bg-red-500 animate-pulse"}`}
                    style={{ width: `${timerPercentage}%` }}
                />
            </div>

            {/* Camera preview */}
            {cameraEnabled && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            className="w-52 h-40 object-cover"
                        />
                        <div className={`text-center text-xs font-bold py-1 ${cameraEnabled ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                            {cameraEnabled ? "Camera Active" : "Camera Off"}
                        </div>
                    </div>
                </div>
            )}

            {fullscreenExited && (

    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">

        <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-2xl">

            <h2 className="text-2xl font-bold text-red-600 mb-4">

                Fullscreen Required

            </h2>

            <p className="text-gray-600 mb-6">

                You exited fullscreen mode.
                Please return to fullscreen
                to continue the exam.

            </p>

            <button
                onClick={reEnterFullscreen}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
            >
                Return to Fullscreen
            </button>

        </div>

    </div>
)}

            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* Warning banner */}
                {warning && (
                    <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-2xl font-semibold shadow-sm">
                        {warning}
                    </div>
                )}

                {/* Loading */}
                {questionsLoading && (
                    <div className="text-center py-32">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Loading questions...</p>
                    </div>
                )}

                {/* Already Attempted */}
                {!questionsLoading && alreadyAttempted && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-sm">
                        <h2 className="text-2xl font-bold text-amber-500 mb-4">You already attempted this exam</h2>
                        <button
                            onClick={() => navigate("/student-dashboard")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}

                {/* Error */}
                {!questionsLoading && questionsError && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-sm">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Failed to load questions</h2>
                    </div>
                )}

                {/* Instructions */}
                {!questionsLoading && !questionsError && !alreadyAttempted && questions.length > 0 && !examStarted && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-10">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-blue-600 mb-3">Exam Instructions</h2>
                            <p className="text-gray-500">Please read all instructions carefully before starting the exam.</p>
                        </div>
                        <div className="space-y-4 text-gray-700 dark:text-gray-200">
                            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                                ⏱ Duration: <span className="font-bold ml-2">{Math.floor(displayTime / 60)} minutes</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">📷 Webcam access is required during exam.</div>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">🖥 Fullscreen mode will be enabled.</div>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">⚠ Tab switching and fullscreen exit are monitored.</div>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">🚫 Multiple violations may auto-submit the exam.</div>
                        </div>

                        <div className="mt-8">

    {!startFaceImage ? (

        <button
            onClick={() => {

                const image =
                    captureFaceSnapshot();

                if (image) {

                    setStartFaceImage(
                        image
                    );

                    toast.success(
                        "Verification photo captured"
                    );

                } else {

                    toast.error(
                        "Failed to capture photo"
                    );
                }
            }}
            className="w-full mb-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-2xl text-lg font-bold shadow-lg"
        >
            Capture Verification Photo
        </button>

    ) : (

        <div className="mb-8 flex flex-col items-center">

    <img
        src={startFaceImage}
        alt="Captured Face"
        className="w-44 h-36 object-cover rounded-2xl border-4 border-emerald-400 shadow-lg"
    />

    <p className="text-center text-sm text-emerald-600 font-semibold mt-4">
        Verification photo captured successfully
    </p>

    <button
        onClick={() => {

            setStartFaceImage(null);

            startFaceImageRef.current =
                null;

            toast.success(
                "Capture a new photo"
            );
        }}
        className="mt-5 px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-semibold transition-all duration-200"
    >
        Recapture Photo
    </button>

</div>

    )}

</div>
                        <button
                            onClick={() => {

    if (!startFaceImage) {

        toast.error(
            "Please capture verification photo first."
        );

        return;
    }

    startExam();
}}
                            className="w-full mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-2xl text-lg font-bold shadow-lg"
                        >
                            Start Exam
                        </button>
                    </div>
                )}

                {/* Main Exam */}
                {!questionsLoading && !questionsError && !alreadyAttempted && questions.length > 0 && examStarted && (
                <>

                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm font-semibold mb-2 text-gray-500">
                            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                            <span>{answeredCount}/{questions.length} answered</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                            <div
                                className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question Navigator */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {questions.map((q, index) => {
                            const answered = answers[q.id];
                            const active = currentQuestionIndex === index;
                            const bookmarked = bookmarkedQuestions.includes(q.id);
                            
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(index)}
className={`w-11 h-11 rounded-xl text-sm font-bold transition-all duration-200 ${
    active
        ? "bg-blue-600 text-white"
        : bookmarked
        ? "bg-yellow-400 text-black"
        : answered
        ? "bg-emerald-500 text-white"
        : "bg-white border border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
}`}                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Question Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                        <div className="p-8">

                            <div className="flex items-start gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center">
                                    {currentQuestionIndex + 1}
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
                                    {currentQuestion.questionText}
                                </h2>
                            </div>

                            <div className="flex justify-end mb-6">

    <button
        onClick={() =>
            toggleBookmark(currentQuestion.id)
        }
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            bookmarkedQuestions.includes(
                currentQuestion.id
            )
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-700 hover:bg-yellow-300"
        }`}
    >
        {bookmarkedQuestions.includes(
            currentQuestion.id
        )
            ? "★ Bookmarked"
            : "☆ Bookmark"}
    </button>

</div>

                            

                            <div className="space-y-4">
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
                                            className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${isSelected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 hover:border-blue-300 hover:bg-blue-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${isSelected ? "bg-blue-500 text-white" : "bg-white border"}`}>
                                                {optionLabels[i]}
                                            </div>
                                            <span className="font-medium">{option}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-10">
                                <button
                                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                                    disabled={currentQuestionIndex === 0}
                                    className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {currentQuestionIndex === questions.length - 1 ? (
                                    <button
                                        onClick={() => setShowSubmitConfirm(true)}
                                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-md"
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
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md"
                                    >
                                        Next
                                    </button>
                                )}
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
                confirmClass="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                onConfirm={submitExam}
                onCancel={() => setShowSubmitConfirm(false)}
            />

        </div>
    );
}

export default ExamPage;
