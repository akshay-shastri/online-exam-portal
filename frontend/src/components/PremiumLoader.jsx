import React from "react";

function PremiumLoader({

    title = "Loading...",
    subtitle = "Please wait while we prepare everything.",
    height = "60vh"

}) {

    return (

        <div
            className="flex items-center justify-center px-6"
            style={{
                minHeight: height
            }}
        >

            <div
                className="w-full max-w-2xl rounded-3xl overflow-hidden"
                style={{
                    background:
                        "linear-gradient(160deg,rgba(109,40,217,0.12) 0%,rgba(12,10,30,0.88) 100%)",

                    border:
                        "1px solid rgba(168,85,247,0.22)",

                    boxShadow:
                        "0 0 60px rgba(124,58,237,0.15), 0 24px 64px rgba(0,0,0,0.5)",

                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)"
                }}
            >

                {/* Top Glow Line */}
                <div
                    className="h-1"
                    style={{
                        background:
                            "linear-gradient(90deg,#7c3aed,#a855f7,#06b6d4)"
                    }}
                />

                <div className="p-10 relative">

                    {/* Spinner */}
                    <div className="flex justify-center mb-8">

                        <div
                            className="w-16 h-16 rounded-2xl animate-spin"
                            style={{
                                border:
                                    "3px solid rgba(168,85,247,0.15)",

                                borderTop:
                                    "3px solid #a855f7",

                                boxShadow:
                                    "0 0 28px rgba(124,58,237,0.35)"
                            }}
                        />

                    </div>

                    <div
    className="absolute top-20 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full animate-pulse"
    style={{
        background:
            "radial-gradient(circle,rgba(168,85,247,0.18),transparent 70%)",
        filter: "blur(12px)"
    }}
/>

                    {/* Skeleton Lines */}
                    <div className="space-y-4">

                        {[1, 2, 3].map((i) => (

                            <div
                                key={i}
                                className="rounded-2xl overflow-hidden"
                                style={{
                                    background:
                                        "rgba(255,255,255,0.04)",

                                    border:
                                        "1px solid rgba(255,255,255,0.06)",

                                    padding: "18px"
                                }}
                            >

                                <div
                                   className="rounded-xl premium-loader-shimmer"
                                    style={{
                                        height: "18px",

                                        width:
                                            i === 2
                                                ? "75%"
                                                : "100%",

                                        background:
                                            "linear-gradient(90deg,rgba(124,58,237,0.08),rgba(168,85,247,0.18),rgba(124,58,237,0.08))"
                                    }}
                                />

                            </div>

                        ))}

                    </div>

                    {/* Text */}
                    <div className="text-center mt-8">

                        <h2
                            className="text-2xl font-black mb-3"
                            style={{
                                background:
                                    "linear-gradient(90deg,#f3e8ff,#c4b5fd)",

                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}
                        >
                            {title}
                        </h2>

                        <p
    style={{
        color:
            "rgba(196,181,253,0.7)",

        letterSpacing: "0.3px"
    }}
>
    {subtitle}
</p>

<p
    className="text-xs mt-4 tracking-wide animate-pulse"
    style={{
        color: "rgba(168,85,247,0.65)"
    }}
>
    Secure AI-powered examination system
</p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default PremiumLoader;