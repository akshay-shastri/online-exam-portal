import React from "react";

export default function PremiumCertificate({
    result,
    userName
}) {
    // Exact color palette matched from the certificate image
    const colors = {
        purpleDark: "#231145",
        purpleMedium: "#3d1d75",
        purpleLight: "#5a32a3",
        goldMain: "#c59d3f",
        goldLight: "#e9ca7a",
        textNavy: "#061a33",
        textPurple: "#4e2591",
        textMuted: "#5e6d82",
        bgCream: "#fcfaf2",
        bgWaves: "rgba(235, 225, 200, 0.25)"
    };

    return (
        <div
            id="premium-certificate"
            style={{
                backgroundImage: `
linear-gradient(rgba(255,255,255,0.03), rgba(255,255,255,0.03)),
repeating-linear-gradient(
0deg,
transparent,
transparent 2px,
rgba(0,0,0,0.01) 3px
)
`,
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                width: "1123px",
                height: "794px",
                backgroundColor: colors.bgCream,
                position: "relative",
                fontFamily: "'Georgia', 'Times New Roman', serif",
                boxSizing: "border-box",
                overflow: "hidden",
                userSelect: "none"
            }}
        >
            {/* BACKGROUND ELEGANT WAVE PATTERN WATERMARK */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12, pointerEvents: "none" }}>
                <path d="M-100,200 Q200,100 500,250 T1200,150" fill="none" stroke={colors.bgWaves} strokeWidth="1.5" />
                <path d="M-100,220 Q200,120 500,270 T1200,170" fill="none" stroke={colors.bgWaves} strokeWidth="1.5" />
                <path d="M-100,240 Q200,140 500,290 T1200,190" fill="none" stroke={colors.bgWaves} strokeWidth="1.5" />
                <path d="M0,600 Q300,450 700,550 T1300,400" fill="none" stroke={colors.bgWaves} strokeWidth="1" />
                <path d="M0,615 Q300,465 700,565 T1300,415" fill="none" stroke={colors.bgWaves} strokeWidth="1" />
            </svg>

            {/* ====== LUXURY PURPLE AND GOLD CORNER DRAPERIES ====== */}
            {/* Top Left Corner */}
            <svg width="340" height="240" style={{ position: "absolute", top: 0, left: 0, zIndex: 5 }}>
                {/* Thin outer gold accent lines */}
                <path d="M 0,38 Q 95,38 152,95 Q 210,152 210,240" fill="none" stroke={colors.goldMain} strokeWidth="1.5" />
                <path d="M 0,44 Q 90,44 144,98 Q 198,152 198,240" fill="none" stroke={colors.goldLight} strokeWidth="1" />
                {/* Main drapery shapes using smooth cubic and quadratic beziers */}
                <path d="M 0,0 L 260,0 C 190,40 130,90 80,180 C 40,120 0,60 0,0 Z" fill={colors.purpleMedium} />
                <path d="M 0,0 L 210,0 C 150,35 100,80 55,160 C 25,100 0,50 0,0 Z" fill={colors.purpleDark} />
                <path d="M 0,0 L 140,0 C 95,25 60,60 30,120 C 12,70 0,35 0,0 Z" fill={colors.purpleLight} />
                {/* Inner Sharp Frame Line */}
                <path d="M 12,12 L 280,12 C 220,45 155,105 105,210 L 12,90 Z" fill="none" stroke={colors.goldMain} strokeWidth="2" />
                {/* Left side border segment */}
                <path d="M 12,12 L 12,280" fill="none" stroke={colors.goldMain} strokeWidth="2" />
            </svg>

            {/* Top Right Corner */}
            <svg width="340" height="240" style={{ position: "absolute", top: 0, right: 0, zIndex: 5 }}>
                <path d="M 340,38 Q 245,38 188,95 Q 130,152 130,240" fill="none" stroke={colors.goldMain} strokeWidth="1.5" />
                <path d="M 340,44 Q 250,44 196,98 Q 142,152 142,240" fill="none" stroke={colors.goldLight} strokeWidth="1" />
                <path d="M 340,0 L 80,0 C 150,40 210,90 260,180 C 300,120 340,60 340,0 Z" fill={colors.purpleMedium} />
                <path d="M 340,0 L 130,0 C 190,35 240,80 285,160 C 315,100 340,50 340,0 Z" fill={colors.purpleDark} />
                <path d="M 340,0 L 200,0 C 245,25 280,60 310,120 C 328,70 340,35 340,0 Z" fill={colors.purpleLight} />
                <path d="M 328,12 L 60,12 C 120,45 185,105 235,210 L 328,90 Z" fill="none" stroke={colors.goldMain} strokeWidth="2" />
                <path d="M 328,12 L 328,280" fill="none" stroke={colors.goldMain} strokeWidth="2" />
            </svg>

            {/* Bottom Left Corner */}
            <svg width="240" height="240" style={{ position: "absolute", bottom: 0, left: 0, zIndex: 5 }}>
                <path d="M 0,228 L 180,228 C 130,200 90,150 0,100 Z" fill={colors.purpleMedium} />
                <path d="M 0,228 L 130,228 C 90,200 60,150 0,120 Z" fill={colors.purpleDark} />
                <path d="M 12,228 L 210,228 C 155,195 115,135 12,60 Z" fill="none" stroke={colors.goldMain} strokeWidth="2" />
                <path d="M 12,228 L 12,0" fill="none" stroke={colors.goldMain} strokeWidth="2" />
                {/* Ornamental flourish near corner */}
                <path d="M 12,228 Q 45,195 25,175" fill="none" stroke={colors.goldLight} strokeWidth="1.5" />
            </svg>

            {/* Bottom Right Corner */}
            <svg width="240" height="240" style={{ position: "absolute", bottom: 0, right: 0, zIndex: 5 }}>
                <path d="M 240,228 L 60,228 C 110,200 150,150 240,100 Z" fill={colors.purpleMedium} />
                <path d="M 240,228 L 110,228 C 150,200 180,150 240,120 Z" fill={colors.purpleDark} />
                <path d="M 228,228 L 30,228 C 85,195 125,135 228,60 Z" fill="none" stroke={colors.goldMain} strokeWidth="2" />
                <path d="M 228,228 L 228,0" fill="none" stroke={colors.goldMain} strokeWidth="2" />
                <path d="M 228,228 Q 195,195 215,175" fill="none" stroke={colors.goldLight} strokeWidth="1.5" />
            </svg>

            {/* CONTINUOUS INNER RUNNING GOLD BORDER PLATFORM */}
            <div style={{
                position: "absolute",
                top: "12px",
                bottom: "24px",
                left: "12px",
                right: "12px",
                border: `1px solid ${colors.goldMain}`,
                pointerEvents: "none",
                zIndex: 2
            }} />

            {/* ========================================= */}
            {/* CENTRAL CONTENT AREA           */}
            {/* ========================================= */}
            <div style={{
                position: "absolute",
                top: "58px",
                left: "0",
                right: "0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 10
            }}>
                
                {/* Top Laurel Wreath & Shield Emblem */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <svg width="100" height="75" viewBox="0 0 100 75">
                        {/* Laurel Leaves (Left Side) */}
                        <g fill={colors.goldMain}>
                            <path d="M 35,45 C 25,43 20,33 22,25 C 26,33 32,38 35,45 Z" />
                            <path d="M 30,32 C 18,32 15,22 19,15 C 22,22 26,27 30,32 Z" />
                            <path d="M 34,18 C 24,15 25,5 31,0 C 32,8 33,13 34,18 Z" />
                        </g>
                        {/* Laurel Leaves (Right Side) */}
                        <g fill={colors.goldMain} transform="translate(100,0) scale(-1,1)">
                            <path d="M 35,45 C 25,43 20,33 22,25 C 26,33 32,38 35,45 Z" />
                            <path d="M 30,32 C 18,32 15,22 19,15 C 22,22 26,27 30,32 Z" />
                            <path d="M 34,18 C 24,15 25,5 31,0 C 32,8 33,13 34,18 Z" />
                        </g>
                        {/* Central Crest Shield */}
                        <g transform="translate(36, 12)">
                            <polygon points="0,0 28,0 28,24 14,38 0,24" fill={colors.purpleMedium} stroke={colors.goldLight} strokeWidth="1.5" />
                            <circle cx="14" cy="16" r="9" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2,2" />
                            <polyline points="9,16 13,20 20,11" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                    </svg>
                </div>

                {/* Organization Branding */}
                <div style={{ 
                    marginTop: "2px", 
                    fontSize: "24px", 
                    fontWeight: "800", 
                    color: colors.textPurple, 
                    letterSpacing: "2.5px",
                    fontFamily: "'Cinzel', 'Times New Roman', serif"
                }}>
                    SMART EXAM PORTAL
                </div>
                
                {/* Subtitle with Triple Line Accent Framework */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div style={{ width: "45px", height: "1px", backgroundColor: colors.goldMain }} />
                        <div style={{ width: "30px", height: "1px", backgroundColor: colors.goldMain, margin: "0 auto" }} />
                    </div>
                    <div style={{ fontSize: "14px", color: colors.textMuted, fontWeight: "600", letterSpacing: "0.5px" }}>
                        Official Certificate of Achievement
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div style={{ width: "45px", height: "1px", backgroundColor: colors.goldMain }} />
                        <div style={{ width: "30px", height: "1px", backgroundColor: colors.goldMain, margin: "0 auto" }} />
                    </div>
                </div>

                {/* Massive Main Heading */}
                <div style={{ 
                    marginTop: "28px", 
                    fontSize: "66px", 
                    fontWeight: "800", 
                    color: colors.textNavy, 
                    letterSpacing: "5px",
                    fontFamily: "'Times New Roman', Times, serif",
                    textShadow: "0 2px 10px rgba(212,175,55,0.10)",
                }}>
                    CERTIFICATE
                </div>

                {/* Excellence Sub-header with extended flanking layout lines */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                    <div style={{ width: "130px", height: "1.5px", backgroundColor: colors.goldMain }} />
                    <div style={{ fontSize: "16px", color: colors.goldMain, letterSpacing: "5px", fontWeight: "700" }}>
                        OF EXCELLENCE
                    </div>
                    <div style={{ width: "130px", height: "1.5px", backgroundColor: colors.goldMain }} />
                </div>

                {/* Presentation Wording */}
                <div style={{ marginTop: "26px", fontSize: "17px", color: colors.textMuted, fontStyle: "italic" }}>
                    This certificate is proudly presented to
                </div>

                {/* Main Recipient Name Display */}
                <div style={{ 
                    letterSpacing: "1px",
                    marginTop: "5px", 
                    fontSize: "68px", 
                    color: colors.textPurple, 
                    fontFamily: "'Great Vibes', 'SecondaryCalligraphy', 'Brush Script MT', cursive",
                    fontWeight: "500",
                }}>
                    {userName}
                </div>
                
                {/* Ornate Diamond Horizontal Divider */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                    <div style={{ width: "240px", height: "1px", background: `linear-gradient(to left, ${colors.goldMain}, transparent)` }} />
                    <svg width="30" height="15" viewBox="0 0 30 15" style={{ margin: "0 4px" }}>
                        <path d="M 15,3 L 18,7.5 L 15,12 L 12,7.5 Z" fill="none" stroke={colors.goldMain} strokeWidth="1.5" />
                        <circle cx="6" cy="7.5" r="1.5" fill={colors.goldMain} />
                        <circle cx="24" cy="7.5" r="1.5" fill={colors.goldMain} />
                    </svg>
                    <div style={{ width: "240px", height: "1px", background: `linear-gradient(to right, ${colors.goldMain}, transparent)` }} />
                </div>

                {/* Achievement Criteria Text Block */}
                <div style={{ marginTop: "16px", fontSize: "18px",fontWeight: "700", color: colors.textNavy, textAlign: "center", lineHeight: "1.6" }}>
                    for successfully passing the <span style={{ color: colors.textPurple, fontWeight: "bold", fontStyle: "normal" }}>“{result.examTitle}”</span> examination <br/>
                    with an outstanding score of
                </div>

                {/* Score Segment flanked by Gold Stars */}
                <div style={{ marginTop: "12px", fontSize: "58px", color: colors.textPurple, fontWeight: "800", display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ color: colors.goldMain, fontSize: "20px" }}>★</span>
                    <span style={{ letterSpacing: "-1px" }}>{result.percentage}%</span>
                    <span style={{ color: colors.goldMain, fontSize: "20px" }}>★</span>
                </div>

                {/* Delicate Bottom Scroll Flourish */}
                <svg width="80" height="20" viewBox="0 0 80 20" style={{ marginTop: "5px", opacity: 0.8 }}>
                    <path d="M 10,10 Q 40,0 70,10" fill="none" stroke={colors.goldMain} strokeWidth="1.5" />
                    <circle cx="40" cy="5" r="2" fill={colors.goldMain} />
                </svg>
            </div>

            {/* ========================================= */}
            {/* BOTTOM FOOTER CONFIGURATIONS      */}
            {/* ========================================= */}


            {/* Issued Date Signature Line Block */}
            <div style={{ position: "absolute", bottom: "55px", left: "55px", zIndex: 10 }}>
                <div style={{ fontSize: "13px", color: colors.textMuted, fontFamily: "sans-serif" }}>
                    Issued on:{" "}<span style={{ fontWeight: "700", color: colors.textNavy }}> {new Date().toLocaleDateString()}</span>
                </div>
                <div style={{ width: "165px", height: "1px", backgroundColor: colors.goldMain, marginTop: "6px" }} />
            </div>

             {/* Left Side: Certified Rosette Seal */}
            <div style={{position: "absolute",
top: "65px",
right: "70px",
width: "120px",
height: "120px",
zIndex: 10,
transform: "scale(0.82)" }}>
                

                {/* Multi-pointed Rosette Badge Geometry */}
                <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
                    {[0, 15, 30, 45, 60, 75].map((angle, idx) => (
                        <div key={idx} style={{ 
                            position: "absolute", 
                            inset: "5px", 
                            backgroundColor: colors.goldMain, 
                            transform: `rotate(${angle}deg)`, 
                            borderRadius: "12px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                        }} />
                    ))}
                    {/* Golden Rippled Outer Edge Center Ring */}
                    <div style={{ position: "absolute", inset: "12px", backgroundColor: colors.goldLight, borderRadius: "50%" }} />
                    {/* Dark Purple Center Plate */}
                    <div style={{
                        position: "absolute", 
                        inset: "16px", 
                        backgroundColor: colors.purpleDark, 
                        borderRadius: "50%",
                        display: "flex", 
                        flexDirection: "column", 
                        justifyContent: "center", 
                        alignItems: "center",
                        border: `1.5px dashed ${colors.goldLight}`, 
                        boxSizing: "border-box"
                    }}>
                        <div style={{ fontSize: "7px", fontWeight: "700", color: colors.goldLight, letterSpacing: "1px" }}>ACHIEVEMENT</div>
                        
                        {/* Inner Checkmark Icon Assembly */}
                        <svg width="24" height="24" viewBox="0 0 24 24" style={{ margin: "1px 0" }}>
                            <circle cx="12" cy="12" r="10" fill="none" stroke={colors.goldLight} strokeWidth="1.5" />
                            <polyline points="8,12 11,15 17,9" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>

                        <div style={{ fontSize: "7px", fontWeight: "700", color: colors.goldLight, letterSpacing: "1px" }}>CERTIFIED</div>
                    </div>
                </div>
            </div>

            {/* Right Side: Authority Signature Block */}
            <div style={{ position: "absolute",
bottom: "42px",
right: "70px",
textAlign: "center",
zIndex: 10}}>
                <div style={{ 
                    fontFamily: "'Great Vibes', 'Brush Script MT', cursive", 
                    fontSize: "34px", 
                    color: colors.textPurple, 
                    marginBottom: "14px"
                }}>
                    Smart Portal
                </div>
                <div style={{ width: "160px", height: "1px", backgroundColor: colors.goldMain, margin: "0 auto" }} />
                <div style={{ fontSize: "13px", fontWeight: "600", color: colors.textNavy, marginTop: "6px" }}>Authorized Signature</div>
                <div style={{ fontSize: "11px", color: colors.textMuted, marginTop: "2px" }}>Smart Exam Portal</div>
            </div>

            {/* Bottom Center Base Ribbon / Tab Badge */}
            <div style={{
                position: "absolute",
                bottom: "12px", 
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: colors.purpleDark,
                padding: "9px 38px",
                borderRadius: "4px 4px 0 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: `1.5px solid ${colors.goldMain}`,
                borderBottom: "none",
                boxShadow: "0 6px 18px rgba(35,17,69,0.35)",
                zIndex: 10
            }}>
                <span style={{ color: colors.goldLight, fontSize: "11px" }}>★</span>
                <span style={{ color: "white", fontSize: "10px", letterSpacing: "1.5px", fontWeight: "700", fontFamily: "sans-serif" }}>
                    AI POWERED EXAMINATION PLATFORM
                </span>
                <span style={{ color: colors.goldLight, fontSize: "11px" }}>★</span>
            </div>

        </div>
    );
}