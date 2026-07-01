import { useEffect } from "react";

function useSecurityMonitoring({

    examStarted,

    alreadyAttempted,

    submitted,

    submittedRef,

    handleViolation,

    setFullscreenExited,

    setWarning
}) {

    // TAB SWITCH
    useEffect(() => {

        if (
            !examStarted ||
            alreadyAttempted ||
            submitted ||
            submittedRef.current
        ) {
            return;
        }

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

    }, [

        examStarted,

        alreadyAttempted,

        submitted,

        submittedRef,

        handleViolation
    ]);

    // FULLSCREEN
    useEffect(() => {

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

            setWarning(
                "Fullscreen exit detected"
            );

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

        submittedRef,

        handleViolation,

        setFullscreenExited
    ]);

    // DEVTOOLS + SHORTCUTS
    useEffect(() => {

        if (
            !examStarted ||
            alreadyAttempted ||
            submitted ||
            submittedRef.current
        ) {
            return;
        }

        const handleKeyDown = (e) => {

            const key =
                e.key.toLowerCase();

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

            clearInterval(
                detectDevTools
            );

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

        submittedRef,

        handleViolation
    ]);
}

export default useSecurityMonitoring;