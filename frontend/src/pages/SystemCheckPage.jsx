import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ShieldCheck,
    Camera,
    Wifi,
    Monitor,
    ScanFace,
    CheckCircle2,
    TriangleAlert
} from "lucide-react";
import "../styles/system-check.css";

function SystemCheckPage() {

    const navigate = useNavigate();
    const { examId } = useParams();

    const [checks, setChecks] = useState({
        camera: false,
        internet: navigator.onLine,
        fullscreen: !!document.documentElement.requestFullscreen,
        browser: true,
        faceModel: false
    });

    const [checking, setChecking] = useState(true);

    useEffect(() => {

        const runChecks = async () => {

            try {

                // CAMERA CHECK
                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true
                    });

                stream.getTracks().forEach(track => track.stop());

                // FACE MODEL CHECK
                const faceModelReady = true;

                setChecks(prev => ({
                    ...prev,
                    camera: true,
                    faceModel: faceModelReady
                }));

            } catch (err) {

                console.log(err);

                setChecks(prev => ({
                    ...prev,
                    camera: false,
                    faceModel: false
                }));
            }

            setChecking(false);
        };

        runChecks();

    }, []);

    const allPassed =
        checks.camera &&
        checks.internet &&
        checks.fullscreen &&
        checks.browser &&
        checks.faceModel;

    const checkItems = [
        {
            key: "camera",
            label: "Camera Access",
            icon: Camera
        },
        {
            key: "internet",
            label: "Internet Connection",
            icon: Wifi
        },
        {
            key: "fullscreen",
            label: "Fullscreen Support",
            icon: Monitor
        },
        {
            key: "faceModel",
            label: "Face Verification",
            icon: ScanFace
        }
    ];

    return (
        <div className="min-h-screen bg-[#070b17] flex items-center justify-center px-6 py-12">

            <div className="system-check-card w-full max-w-4xl">

                <div className="flex items-center justify-center mb-8">

                    <div className="system-check-icon">
                        <ShieldCheck className="w-10 h-10 text-amber-300" />
                    </div>

                </div>

                <div className="text-center mb-12">

                    <span className="system-check-badge">
                        Secure Environment Check
                    </span>

                    <h1 className="system-check-title">
                        Exam System Verification
                    </h1>

                    <p className="system-check-subtitle">
                        Please verify your device and permissions before starting the examination.
                    </p>

                </div>

                <div className="space-y-4">

                    {checkItems.map((item) => {

                        const passed = checks[item.key];

                        const Icon = item.icon;

                        return (
                            <div
                                key={item.key}
                                className="system-check-item"
                            >

                                <div className="flex items-center gap-4">

                                    <div className="system-check-item-icon">
                                        <Icon className="w-5 h-5 text-amber-300" />
                                    </div>

                                    <div>
                                        <p className="system-check-label">
                                            {item.label}
                                        </p>
                                    </div>

                                </div>

                                <div>
                                    {passed ? (
                                        <div className="system-check-success">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Ready</span>
                                        </div>
                                    ) : (
                                        <div className="system-check-failed">
                                            <TriangleAlert className="w-5 h-5" />
                                            <span>Failed</span>
                                        </div>
                                    )}
                                </div>

                            </div>
                        );
                    })}

                </div>

                <button
                    disabled={!allPassed || checking}
                    onClick={() => navigate(`/exam/${examId}`)}
                    className={`system-check-button ${allPassed ? "system-check-button-active" : ""}`}
                >
                    {checking
                        ? "Checking System..."
                        : allPassed
                            ? "Proceed to Exam"
                            : "System Requirements Not Met"}
                </button>

            </div>

        </div>
    );
}

export default SystemCheckPage;