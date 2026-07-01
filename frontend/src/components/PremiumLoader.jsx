import React from "react";

function PremiumLoader({
    title = "Loading...",
    subtitle = "Please wait while we prepare everything.",
    height = "60vh"
}) {
    return (
        <div
            className="flex items-center justify-center px-6"
            style={{ minHeight: height }}
        >
            <div
                className="w-full max-w-2xl rounded-3xl overflow-hidden premium-hover-lift"
                style={{
                    background: "linear-gradient(145deg, rgba(8,14,28,0.96) 0%, rgba(10,16,32,0.98) 55%, rgba(18,12,4,0.96) 100%)",
                    border: "1px solid rgba(255,216,107,0.14)",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.65), 0 0 60px rgba(255,216,107,0.10)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)"
                }}
            >
                {/* Top Glow Line */}
                <div
                    className="h-1"
                    style={{ background: "linear-gradient(90deg,#facc15,#f59e0b,#fde68a)" }}
                />

                <div className="p-10 relative">
                    {/* Spinner */}
                    <div className="flex justify-center mb-8">
                        <div
                            className="w-16 h-16 rounded-2xl animate-spin"
                            style={{
                                border: "3px solid rgba(255,216,107,0.10)",
                                borderTop: "3px solid #facc15",
                            }}
                        />
                    </div>

                    <div
                        className="absolute top-20 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full animate-pulse"
                        style={{
                            background: "radial-gradient(circle,rgba(255,216,107,0.16),transparent 70%)",
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
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    padding: "18px"
                                }}
                            >
                                <div
                                    className="rounded-xl premium-loader-shimmer"
                                    style={{
                                        height: "18px",
                                        width: i === 2 ? "75%" : "100%",
                                        background: "linear-gradient(90deg,rgba(255,216,107,0.05),rgba(250,204,21,0.16),rgba(255,216,107,0.05))"
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
                                background: "linear-gradient(90deg,#fff7cc,#facc15,#fde68a)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}
                        >
                            {title}
                        </h2>

                        <p
                            style={{
                                color: "rgba(255,248,220,0.72)",
                                letterSpacing: "0.3px"
                            }}
                        >
                            {subtitle}
                        </p>

                        <p
                            className="text-xs mt-4 tracking-wide animate-pulse"
                            style={{ color: "rgba(255,216,107,0.65)" }}
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