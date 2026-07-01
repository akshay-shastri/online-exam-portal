import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/dashboard.css";
import MainResult from "../components/results/MainResult";
import PracticeResult from "../components/results/PracticeResult";
import MockResult from "../components/results/MockResult";
import {
    Trophy,
    Sparkles,
    BookOpen,
    BarChart3,
    Clock3
} from "lucide-react";

function ResultPage() {

    const location = useLocation();
    const navigate = useNavigate();

    const score = location.state?.score || 0;
    const totalQuestions = location.state?.totalQuestions || 0;
    const correctAnswers = location.state?.correctAnswers ?? score;
    const wrong = location.state?.wrongAnswers ?? Math.max(0, totalQuestions - correctAnswers);
    const percentage = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;
    const passed = percentage >= 40;
    // const circumference = 2 * Math.PI * 54;
    // const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const studentName = localStorage.getItem("name") || "Student";
    const examTitle = location.state?.examTitle || "Exam";
    const timeTaken = location.state?.timeTaken || "5 min";
    const violations = location.state?.violations || 0;
    const examType = location.state?.examType || "MAIN";

    // ── Animated ring ──
    const [animatedPct, setAnimatedPct] = useState(0);
    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            setTimeout(() => setAnimatedPct(parseFloat(percentage)), 120);
        });
        return () => cancelAnimationFrame(raf);
    }, [percentage]);

    const ringR          = 50;
    const ringCirc       = 2 * Math.PI * ringR;
    const safePct = Math.max(animatedPct, 1);
    const ringOffset = ringCirc - (safePct / 100) * ringCirc;

    // Performance label (requirement: 90+ Excellent, 75+ Very Good, 50+ Good, <50 Needs Improvement)
    let perfLabel, perfLabelColor;
    if      (percentage >= 90) {

    perfLabel = 'Excellent';

    perfLabelColor = '#86efac';

}
else if (percentage >= 75) {

    perfLabel = 'Very Good';

    perfLabelColor = '#67e8f9';

}
else if (percentage >= 50) {

    perfLabel = 'Good';

    perfLabelColor = '#fde68a';

}
else {

    perfLabel = 'Needs Improvement';

    perfLabelColor = '#fca5a5';
}

    let performanceTitle = "";
    let performanceMessage = "";
    let performanceLevel = "";
    let performanceGradient = "";

    const securityStatus =
        violations === 0 ? "Excellent"
        : violations === 1 ? "Minor Violations"
        : "High Risk";

    const securityColor =
        violations === 0 ? "rp-sec-green"
        : violations === 1 ? "rp-sec-gold"
        : "rp-sec-red";

    if (percentage >= 85) {
        performanceTitle = "Outstanding Performance";
        performanceMessage = "Exceptional work! You demonstrated excellent subject mastery and consistency throughout the exam.";
        performanceLevel = "Elite";
        performanceGradient = "from-emerald-400 to-emerald-600";
    } else if (percentage >= 70) {
        performanceTitle = "Great Job";
        performanceMessage = "Strong performance with impressive accuracy and consistency.";
        performanceLevel = "Advanced";
        performanceGradient = "from-cyan-400 to-blue-500";
    } else if (percentage >= 40) {
        performanceTitle = "Good Effort";
        performanceMessage = "You passed successfully. Continue practicing to further improve your performance.";
        performanceLevel = "Intermediate";
        performanceGradient = "from-rose-500 to-orange-500";
    } else {
        performanceTitle = "Needs Improvement";
        performanceMessage = "Review weak topics and try again with confidence.";
        performanceLevel = "Beginner";
        performanceGradient = "from-red-500 to-yellow-600";
    }

    const insightStats = [
        {
            label: "Accuracy",
            value: `${percentage}%`,
            icon: (
                <BarChart3 className="w-4 h-4" />
            ),
            color: "rp-stat-blue",
            bar: "rp-bar-blue",
            barWidth: parseFloat(percentage),
        },
        {
            label: "Time Taken",
            value: timeTaken,
            icon: <Clock3 className="w-4 h-4" />,
            color: "rp-stat-cyan",
            bar: "rp-bar-cyan",
            barWidth: 100,
        },
    ];

    const exportPDF = () => {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;
        const wrongAnswers = wrong;
        pdf.setFontSize(22);
        pdf.setTextColor(234, 179, 8);
        pdf.text("SMART EXAM PORTAL", centerX, 20, { align: "center" });
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Exam Performance Report", centerX, 32, { align: "center" });
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
            pdf.text(`${row[0]} :`, 25, y);
            pdf.setFont(undefined, "normal");
            pdf.text(`${row[1]}`, 85, y);
            y += 12;
        });
        y += 10;
        pdf.setDrawColor(230);
        pdf.rect(20, y, 170, 30);
        pdf.setFontSize(14);
        pdf.setTextColor(passed ? 22 : 220, passed ? 163 : 38, passed ? 74 : 38);
        pdf.text(
            passed ? "Congratulations! You passed the exam." : "You did not pass the exam.",
            centerX, y + 18, { align: "center" }
        );
        pdf.setFontSize(10);
        pdf.setTextColor(120);
        pdf.text(`Generated on ${new Date().toLocaleString()}`, centerX, 285, { align: "center" });
        pdf.save(`${examTitle}-report.pdf`);
    };

    const downloadCertificate = () => {
        const pdf = new jsPDF("landscape", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.setDrawColor(234, 179, 8);
        pdf.setLineWidth(2);
        pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
        pdf.setFontSize(30);
        pdf.setTextColor(234, 179, 8);
        pdf.text("CERTIFICATE OF ACHIEVEMENT", pageWidth / 2, 40, { align: "center" });
        pdf.setFontSize(16);
        pdf.setTextColor(80);
        pdf.text("This certificate is proudly presented to", pageWidth / 2, 65, { align: "center" });
        pdf.setFontSize(28);
        pdf.setTextColor(0);
        pdf.text(studentName, pageWidth / 2, 90, { align: "center" });
        pdf.setFontSize(16);
        pdf.setTextColor(80);
        pdf.text(`for successfully passing the "${examTitle}" examination`, pageWidth / 2, 115, { align: "center" });
        pdf.text(`with an excellent score of ${percentage}%`, pageWidth / 2, 130, { align: "center" });
        pdf.setFontSize(12);
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, 30, 175);
        pdf.text("Smart Exam Portal", pageWidth - 60, 175);
        pdf.line(pageWidth - 70, 165, pageWidth - 25, 165);
        pdf.save(`${studentName}-certificate.pdf`);
    };

   if (examType === "PRACTICE") {

    return (

            <PracticeResult
            percentage={percentage}
            correctAnswers={correctAnswers}
            wrong={wrong}
            totalQuestions={totalQuestions}
            navigate={navigate}
            examId={location.state?.examId}
        />
    );
}

if (examType === "MOCK") {

    return (

        <MockResult
            percentage={percentage}
            correctAnswers={correctAnswers}
            wrong={wrong}
            totalQuestions={totalQuestions}
            violations={violations}
            navigate={navigate}
        />
    );
}

return (

    <MainResult
        passed={passed}
        percentage={percentage}
        studentName={studentName}
        correctAnswers={correctAnswers}
        wrong={wrong}
        totalQuestions={totalQuestions}
        navigate={navigate}
        ringR={ringR}
        ringCirc={ringCirc}
        ringOffset={ringOffset}
        perfLabel={perfLabel}
        perfLabelColor={perfLabelColor}
        insightStats={insightStats}
        performanceGradient={performanceGradient}
        performanceTitle={performanceTitle}
        performanceMessage={performanceMessage}
        performanceLevel={performanceLevel}
        securityColor={securityColor}
        securityStatus={securityStatus}
        violations={violations}
    />
);
}

export default ResultPage;
