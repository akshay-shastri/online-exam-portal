import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ResultPage() {

    const location = useLocation();

    const navigate = useNavigate();

    const score = location.state?.score || 0;

    const totalQuestions = location.state?.totalQuestions || 0;

    const correctAnswers = location.state?.correctAnswers ?? score;

    const wrong = location.state?.wrongAnswers ?? Math.max(0, totalQuestions - correctAnswers);

    const percentage = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;



    const passed = percentage >= 40;

    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const studentName = localStorage.getItem("name") || "Student";

    const examTitle = location.state?.examTitle || "Exam";

    const timeTaken = location.state?.timeTaken || "5 min";

    const reviewQuestions = location.state?.questions || [];

    const reviewAnswers = location.state?.answers || {};

    const violations = location.state?.violations || 0;

    const [showReview, setShowReview] = useState(false);
    let performanceTitle = "";
    let performanceMessage = "";
    let performanceLevel = "";
    let performanceGradient = "";

    const securityStatus =
    violations === 0
        ? "Excellent"
        : violations === 1
        ? "Minor Violations"
        : "High Risk";

    const securityColor =
        violations === 0
            ? "text-emerald-600"
            : violations === 1
            ? "text-amber-500"
            : "text-red-500";

   
    if (percentage >= 85) {

    performanceTitle =
        "Outstanding Performance 🚀";

    performanceMessage =
        "Exceptional work! You demonstrated excellent subject mastery and consistency throughout the exam.";

    performanceLevel = "Elite";

    performanceGradient =
        "from-emerald-500 to-green-600";

} else if (percentage >= 70) {

    performanceTitle =
        "Great Job 👏";

    performanceMessage =
        "Strong performance with impressive accuracy and consistency.";

    performanceLevel = "Advanced";

    performanceGradient =
        "from-blue-500 to-indigo-600";

} else if (percentage >= 40) {

    performanceTitle =
        "Good Effort 👍";

    performanceMessage =
        "You passed successfully. Continue practicing to further improve your performance.";

    performanceLevel = "Intermediate";

    performanceGradient =
        "from-amber-400 to-orange-500";

} else {

    performanceTitle =
        "Needs Improvement 📚";

    performanceMessage =
        "Review weak topics and try again with confidence.";

    performanceLevel = "Beginner";

    performanceGradient =
        "from-red-500 to-pink-600";
}
    const insightStats = [

    {
        label: "Accuracy",
        value: `${percentage}%`,
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
            </svg>
        ),
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        bar: "bg-gradient-to-r from-blue-400 to-indigo-500",
        barWidth: parseFloat(percentage),
    },

    {
        label: "Time Taken",
        value: timeTaken,
        icon: "⏱",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-100",
        bar: "bg-gradient-to-r from-indigo-400 to-purple-500",
        barWidth: 100,
    },

];

    const exportPDF = () => {

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();

    const centerX = pageWidth / 2;

    const wrongAnswers = wrong;

    pdf.setFontSize(22);
    pdf.setTextColor(37, 99, 235);

    pdf.text(
        "SMART EXAM PORTAL",
        centerX,
        20,
        { align: "center" }
    );

    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);

    pdf.text(
        "Exam Performance Report",
        centerX,
        32,
        { align: "center" }
    );

    pdf.setDrawColor(220);
    pdf.line(20, 38, 190, 38);

    pdf.setFontSize(12);

    let y = 55;

    const rows = [
        ["Student Name", studentName],
        ["Exam Title", examTitle],
        ["Score", `${score}`],
        ["Correct Answers", `${correctAnswers}`],
        ["Wrong Answers", `${wrongAnswers}`],
        ["Percentage", `${percentage}%`],
        ["Accuracy", `${percentage}%`],
        ["Result", passed ? "PASSED" : "FAILED"],
        ["Time Taken", timeTaken]
    ];

    rows.forEach((row) => {

        pdf.setFont(undefined, "bold");

        pdf.text(
            `${row[0]} :`,
            25,
            y
        );

        pdf.setFont(undefined, "normal");

        pdf.text(
            `${row[1]}`,
            85,
            y
        );

        y += 12;
    });

    y += 10;

    pdf.setDrawColor(230);

    pdf.rect(20, y, 170, 30);

    pdf.setFontSize(14);

    pdf.setTextColor(
        passed ? 22 : 220,
        passed ? 163 : 38,
        passed ? 74 : 38
    );

    pdf.text(
        passed
            ? "Congratulations! You passed the exam."
            : "You did not pass the exam.",
        centerX,
        y + 18,
        { align: "center" }
    );

    pdf.setFontSize(10);

    pdf.setTextColor(120);

    pdf.text(
        `Generated on ${new Date().toLocaleString()}`,
        centerX,
        285,
        { align: "center" }
    );

    pdf.save(
        `${examTitle}-report.pdf`
    );
};

const downloadCertificate = () => {

    const pdf =
        new jsPDF("landscape", "mm", "a4");

    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();

    pdf.setDrawColor(37, 99, 235);
    pdf.setLineWidth(2);

    pdf.rect(
        10,
        10,
        pageWidth - 20,
        pageHeight - 20
    );

    pdf.setFontSize(30);

    pdf.setTextColor(37, 99, 235);

    pdf.text(
        "CERTIFICATE OF ACHIEVEMENT",
        pageWidth / 2,
        40,
        { align: "center" }
    );

    pdf.setFontSize(16);

    pdf.setTextColor(80);

    pdf.text(
        "This certificate is proudly presented to",
        pageWidth / 2,
        65,
        { align: "center" }
    );

    pdf.setFontSize(28);

    pdf.setTextColor(0);

    pdf.text(
        studentName,
        pageWidth / 2,
        90,
        { align: "center" }
    );

    pdf.setFontSize(16);

    pdf.setTextColor(80);

    pdf.text(
        `for successfully passing the "${examTitle}" examination`,
        pageWidth / 2,
        115,
        { align: "center" }
    );

    pdf.text(
        `with an excellent score of ${percentage}%`,
        pageWidth / 2,
        130,
        { align: "center" }
    );

    pdf.setFontSize(12);

    pdf.text(
        `Date: ${new Date().toLocaleDateString()}`,
        30,
        175
    );

    pdf.text(
        "Smart Exam Portal",
        pageWidth - 60,
        175
    );

    pdf.line(
        pageWidth - 70,
        165,
        pageWidth - 25,
        165
    );

    pdf.save(
        `${studentName}-certificate.pdf`
    );
};

   

    return (

        <div className={`min-h-screen px-4 py-10 relative overflow-hidden ${passed ? "bg-[#f0f7ff]" : "bg-[#fff4f4]"} dark:bg-gray-950` }>

            {/* Background blobs */}
            <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${passed ? "bg-blue-300" : "bg-red-200"}`} />
            <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 pointer-events-none ${passed ? "bg-indigo-300" : "bg-orange-200"}`} />

            {/* Portal branding */}
            <div className="flex items-center justify-center gap-2.5 mb-10 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                    Smart Exam Portal
                </span>
            </div>

            {/* 2-column layout */}
            <div id="result-report" className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* ── LEFT: Result Card ── */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700">

                    <div className={`h-2 w-full ${passed ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gradient-to-r from-red-400 to-rose-500"}`} />

                    <div className={`px-8 pt-8 pb-6 text-center ${passed ? "bg-gradient-to-b from-blue-50 to-white" : "bg-gradient-to-b from-red-50 to-white"} dark:bg-gray-800` }>
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${passed ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-500"}`}>
                            <span>{passed ? "✦" : "✕"}</span>
                            Exam Result
                        </div>
                       <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight">
    {passed ? "Congratulations!" : "Better Luck Next Time"}
</h1>

<p className="text-sm font-semibold text-blue-600 mt-2">
    {studentName}
</p>

<p className="text-sm text-gray-400 mt-1.5 dark:text-gray-300">
    {passed
        ? "You have successfully passed the exam."
        : "You did not meet the passing criteria."
    }
</p>
                    </div>

                    <div className="flex flex-col items-center px-8 py-6">


{/* Score Ring */}
<div className="relative w-52 h-52 mb-8 flex items-center justify-center">

    <svg
        className="w-full h-full -rotate-90 drop-shadow-[0_0_18px_rgba(59,130,246,0.20)]"
        viewBox="0 0 120 120"
    >

        <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={passed ? "#e0e7ff" : "#fee2e2"}
            strokeWidth="10"
        />

        <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={passed ? "url(#passGrad)" : "url(#failGrad)"}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 50}
            strokeDashoffset={
                2 * Math.PI * 50 -
                (percentage / 100) *
                (2 * Math.PI * 50)
            }
            style={{
                transition:
                    "stroke-dashoffset 1s ease"
            }}
        />

        <defs>

            <linearGradient
                id="passGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
            >
                <stop
                    offset="0%"
                    stopColor="#3b82f6"
                />

                <stop
                    offset="100%"
                    stopColor="#6366f1"
                />
            </linearGradient>

            <linearGradient
                id="failGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
            >
                <stop
                    offset="0%"
                    stopColor="#f87171"
                />

                <stop
                    offset="100%"
                    stopColor="#fb7185"
                />
            </linearGradient>

        </defs>

    </svg>

    <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-[-4px]">

        <span
            className={`text-4xl font-extrabold tracking-tight ${
                passed
                    ? "text-blue-600"
                    : "text-red-500"
            }`}
        >
            {percentage}%
        </span>

        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
            Final Percentage
        </span>

    </div>

</div>
                        {/* Mini stats */}
                        <div className="w-full grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-gray-50 rounded-2xl px-3 py-4 text-center border border-gray-100 dark:bg-gray-700 dark:border-gray-700">
                                <p className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">{correctAnswers}</p>
                                <p className="text-xs text-gray-400 font-medium mt-0.5 dark:text-gray-300">Correct</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl px-3 py-4 text-center border border-gray-100 dark:bg-gray-700 dark:border-gray-700">
                                <p className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">{wrong}</p>
                                <p className="text-xs text-gray-400 font-medium mt-0.5 dark:text-gray-300">Wrong</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl px-3 py-4 text-center border border-gray-100 dark:bg-gray-700 dark:border-gray-700">
                                <p className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">{totalQuestions}</p>
                                <p className="text-xs text-gray-400 font-medium mt-0.5 dark:text-gray-300">Total</p>
                            </div>
                        </div>

                        {/* Pass / Fail Status */}

<div
    className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl mb-6 transition-all duration-300 ${
        passed
            ? "bg-gradient-to-r from-blue-500 to-indigo-600"
            : "bg-gradient-to-r from-red-400 to-rose-500"
    }`}
>

    <span className="text-lg">
        {passed ? "✓" : "✕"}
    </span>

    <span className="text-white text-lg font-bold uppercase tracking-[0.2em]">
        {passed ? "Passed" : "Failed"}
    </span>

</div>

                        <button
    onClick={exportPDF}
    className="w-full mb-3 bg-white border border-blue-100 hover:bg-blue-50 text-blue-600 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
>
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 16v-8m0 8l-3-3m3 3l3-3M4 20h16"
        />
    </svg>

    Download PDF Report
</button>

{passed && (
    <button
        onClick={downloadCertificate}
        className="w-full mb-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
    >
        🏆 Download Certificate
    </button>
)}

                      {/* CTA */}
<button
    onClick={() => navigate("/student-dashboard")}
    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-blue-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
>
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
    </svg>

    Back to Dashboard
</button>

<button
    onClick={() =>
        setShowReview(!showReview)
    }
    className="w-full mt-3 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200"
>
    {showReview
        ? "Hide Answer Review"
        : "Review Answers"}
</button>

                    </div>

                </div>

                {/* ── RIGHT: Exam Insights ── */}
                <div className="flex flex-col gap-6 h-full">

                    {/* Insights header card */}
                    <div className={`rounded-3xl px-8 py-6 shadow-xl relative overflow-hidden ${passed ? "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 shadow-blue-200" : "bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 shadow-red-200"}`}>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
                        <div className="relative z-10">
                            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${passed ? "text-blue-100" : "text-red-100"}`}>Performance Summary</p>
                            <h2 className="text-2xl font-extrabold text-white leading-tight mb-1">
                                Exam Insights
                            </h2>
                            <p className={`text-sm font-medium ${passed ? "text-blue-100" : "text-red-100"}`}>
                                {passed
                                    ? "Great performance! Review your results below."
                                    : "Analyze your results and prepare better next time."}
                            </p>
                        </div>
                    </div>

                    {/* Stat cards with progress bars */}
                    <div className="grid grid-cols-2 gap-4">
                        {insightStats.map((stat) => (
                            <div key={stat.label} className={`bg-white rounded-2xl border ${stat.border} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                        {stat.icon}
                                    </div>
                                    <span className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</span>
                                </div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-1.5 rounded-full ${stat.bar} transition-all duration-700`}
                                        style={{ width: `${stat.barWidth}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Smart Performance Card */}

<div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 overflow-hidden relative flex flex-col justify-between flex-1">

    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${performanceGradient}`} />

    <div className="flex items-start justify-between gap-4 mb-5">

        <div>

            <h3 className="text-xl font-extrabold text-gray-800 mb-2">
                {performanceTitle}
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed">
                {performanceMessage}
            </p>

        </div>

        <div
            className={`px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${performanceGradient} shadow-md whitespace-nowrap`}
        >
            {performanceLevel}
        </div>

    </div>

    <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-5">

    <div className="flex items-center justify-between mb-4">

        <h4 className="text-sm font-extrabold uppercase tracking-wider text-gray-700">
            AI Proctoring Summary
        </h4>

        <span
            className={`text-sm font-bold ${securityColor}`}
        >
            {securityStatus}
        </span>

    </div>

    <div className="grid grid-cols-2 gap-4">

        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">

            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
                Violations
            </p>

            <p className="text-2xl font-extrabold text-gray-800">
                {violations}
            </p>

        </div>

        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">

            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
                Face Status
            </p>

            <p className="text-sm font-bold text-emerald-600">
                Verified
            </p>

        </div>

    </div>

</div>

    

    <div className="grid grid-cols-1 pt-6">

       <div className="rounded-2xl bg-gray-50 border border-gray-100 min-h-[96px] px-5 py-4 flex flex-col items-center justify-center text-center">

    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-2">
        Exam Status
    </p>

    <p
        className={`text-2xl font-extrabold tracking-wide ${
            passed
                ? "text-emerald-600"
                : "text-red-500"
        }`}
    >
        {passed ? "PASSED" : "FAILED"}
    </p>

</div>

    </div>

</div>







                    {/* Passing criteria note */}
                    <div className="flex items-center gap-2 px-5 py-3 bg-white/70 rounded-2xl border border-gray-100 shadow-sm">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-gray-400 font-medium">Passing criteria: 40% and above</p>
                    </div>

                </div>

            </div>

            {showReview && (

<div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 mt-8 max-w-5xl mx-auto">
    <div className="flex items-center justify-between mb-6">

        <h3 className="text-2xl font-extrabold text-gray-800">
            Answer Review
        </h3>

        <div className="text-sm font-semibold text-blue-600">
            {reviewQuestions.length} Questions
        </div>

    </div>

    <div className="space-y-6">

        {reviewQuestions.map((q, index) => {

            const selected =
                reviewAnswers[q.id];

            const correct =
                q.correctAnswer;

            return (

                <div
                    key={q.id}
                    className="border border-gray-100 rounded-2xl p-5"
                >

                    <div className="flex items-start gap-4 mb-5">

                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                            {index + 1}
                        </div>

                        <h4 className="font-bold text-gray-800 leading-relaxed">
                            {q.questionText}
                        </h4>

                    </div>

                    <div className="space-y-3">

                        {[
                            q.optionA,
                            q.optionB,
                            q.optionC,
                            q.optionD
                        ].map((option, i) => {

                            const optionKey =
                                ["A", "B", "C", "D"][i];

                            const isCorrect =
                                optionKey === correct;

                            const isSelected =
                                optionKey === selected;

                            return (

                                <div
                                    key={i}
                                    className={`p-4 rounded-xl border-2 ${
                                        isCorrect
                                            ? "border-emerald-400 bg-emerald-50"
                                            : isSelected
                                            ? "border-red-400 bg-red-50"
                                            : "border-gray-100 bg-gray-50"
                                    }`}
                                >

                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-3">

                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
                                                isCorrect
                                                    ? "bg-emerald-500 text-white"
                                                    : isSelected
                                                    ? "bg-red-500 text-white"
                                                    : "bg-white border"
                                            }`}>
                                                {optionKey}
                                            </div>

                                            <span className="font-medium text-gray-700">
                                                {option}
                                            </span>

                                        </div>

                                        <div className="text-sm font-bold">

                                            {isCorrect && (
                                                <span className="text-emerald-600">
                                                    Correct
                                                </span>
                                            )}

                                            {!isCorrect &&
                                                isSelected && (
                                                <span className="text-red-500">
                                                    Your Answer
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>
            );
        })}

    </div>

</div>
            )}

        </div>
    );
}

export default ResultPage;
