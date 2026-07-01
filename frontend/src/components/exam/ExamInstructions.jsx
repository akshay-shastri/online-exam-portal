import toast from "react-hot-toast";
import { memo } from "react";
import {
    Timer,
    Camera,
    Monitor,
    ShieldAlert,
    Ban
} from "lucide-react";

function ExamInstructions({
    totalDuration,
    startFaceImage,
    setStartFaceImage,
    startFaceImageRef,
    startVerificationCapture,
    capturingPhoto,
    startExam
}) {
    return (
       <div className="exam-instructions-card">
            <div className="exam-instructions-top-line" />

             <div className="p-10">
                <div className="text-center mb-10">
                    <div className="exam-badge">
                        <span className="exam-badge-dot" />
                        Exam Ready
                    </div>

                    <h2 className="exam-instructions-title">
                        Exam Instructions
                    </h2>

                    <p className="exam-instructions-subtitle">
                        Please read all instructions carefully before starting.
                    </p>
                </div>

                <div className="space-y-3 mb-10">
                    {[
                        {
                            icon: <Timer className="w-5 h-5 text-amber-300" />,
                            label: 'Duration',
                            value: `${totalDuration} minutes`,
                        },
                        {
                            icon: <Camera className="w-5 h-5 text-amber-300" />,
                            label: 'Webcam access is required throughout the exam.'
                        },
                        {
                            icon: <Monitor className="w-5 h-5 text-amber-300" />,
                            label: 'Fullscreen mode will be enabled automatically.'
                        },
                        {
                            icon: <ShieldAlert className="w-5 h-5 text-amber-300" />,
                            label: 'Tab switching and fullscreen exit are monitored.'
                        },
                        {
                            icon: <Ban className="w-5 h-5 text-amber-300" />,
                            label: 'Multiple violations will auto-submit the exam.'
                        },
                    ].map((item, i) => (
                        <div key={i} className={`exam-instruction-item ${item.accent ? "accent" : "normal"}`}>
                           <div className="exam-instruction-icon">
                                {item.icon}
                            </div>

                            <span className="exam-instruction-text">
                                {item.label}
                                {item.value && (
                                    <span className="exam-instruction-value">
                                        {item.value}
                                    </span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    {!startFaceImage ? (
                        <button
                            onClick={startVerificationCapture}
                            disabled={capturingPhoto}
                            className={`exam-capture-btn ${ capturingPhoto ? "disabled" : "active" }`}>
                            Capture Verification Photo
                        </button>
                    ) : (
                        <div className="exam-photo-card">
                            <img
                                src={startFaceImage}
                                alt="Captured Face"
                                className="exam-photo-preview"/>

                            <button
                                onClick={() => {
                                    setStartFaceImage(null);
                                    startFaceImageRef.current = null;
                                    toast.success('Capture a new photo');
                                }}
                                className="exam-secondary-btn">
                                Recapture Photo
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        if (!startFaceImage) {
                            toast.error('Please capture verification photo first.');
                            return;
                        }
                        startExam();
                    }}
                    className={`exam-start-btn ${ startFaceImage ? "active" : "disabled" }`}>
                    Start Exam
                </button>
            </div>
        </div>
    );
}

export default memo(ExamInstructions);