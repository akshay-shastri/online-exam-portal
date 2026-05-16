import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/dashboard.css";
import PremiumLoader from "../components/PremiumLoader";

function ReviewAnswersPage() {

    const { examId } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [reviewData, setReviewData] = useState(null);

    useEffect(() => {

        fetchReview();

    }, []);

    const fetchReview = async () => {

        try {

            const email = localStorage.getItem("email");

            const response = await API.get( `/results/review/${encodeURIComponent(email)}/${encodeURIComponent(examId)}`);

            setReviewData(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    if (loading) {

        return (

    <PremiumLoader
        title="Loading Answers..."
        subtitle="Preparing answer review and analysis."
        height="100vh"
    />

);
    }

   if (!reviewData) {

    return (

        <div className="premium-root min-h-screen flex items-center justify-center p-6">

            <div
                className="w-full max-w-xl rounded-3xl overflow-hidden text-center"
                style={{
                    background:
                        'linear-gradient(160deg,rgba(239,68,68,0.12) 0%,rgba(12,10,30,0.9) 100%)',
                    border:
                        '1px solid rgba(239,68,68,0.22)',
                    boxShadow:
                        '0 0 60px rgba(239,68,68,0.12)',
                    backdropFilter:'blur(20px)',
                }}
            >

                <div
                    className="h-1"
                    style={{
                        background:
                            'linear-gradient(90deg,#991b1b,#ef4444,#f87171)'
                    }}
                />

                <div className="p-10">

                    <div className="text-6xl mb-5">⚠</div>

                    <h2 className="text-3xl font-black text-white mb-3">
                        Failed to Load Answers
                    </h2>

                    <p className="text-red-200/70">
                        Something went wrong while loading review data.
                    </p>

                </div>

            </div>

        </div>
    );
}

    const questions = JSON.parse(reviewData.questionsJson || "[]");

    const answers = JSON.parse(reviewData.answersJson || "{}");
    const violations = JSON.parse(reviewData.violationTimelineJson || "[]");

    return (

        <div className="premium-root min-h-screen p-6">

            <div className="max-w-6xl mx-auto animate-fadeIn">

               <div
    className="flex justify-between items-center mb-10 rounded-3xl px-8 py-7"
    style={{
        background:
            'linear-gradient(160deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
        border:
            '1px solid rgba(168,85,247,0.14)',
        boxShadow:
            '0 20px 60px rgba(0,0,0,0.45)',
        backdropFilter:'blur(18px)',
    }}
>

                    <div>

                      <h1
    className="text-5xl font-black tracking-tight"
    style={{
        background:
            'linear-gradient(90deg,#ffffff,#c4b5fd)',
        WebkitBackgroundClip:'text',
        WebkitTextFillColor:'transparent',
    }}
>
    Answer Review
</h1>

                        <p className="text-gray-400 mt-2">{reviewData.examTitle}</p>

                    </div>

                    <button onClick={() => navigate("/student-dashboard")}className="premium-back-btn"
                    style={{
    background:
        'linear-gradient(135deg,#7c3aed,#a855f7)',
    boxShadow:
        '0 0 30px rgba(168,85,247,0.35)',
}}
                        >Back </button>

                </div>

                {violations.length > 0 && (

    <div className="mb-10 rounded-3xl p-7 overflow-hidden relative"

        style={{
    background:
        'linear-gradient(160deg,rgba(239,68,68,0.08) 0%,rgba(12,10,30,0.9) 100%)',
    border:
        '1px solid rgba(239,68,68,0.18)',
    boxShadow:
        '0 20px 60px rgba(0,0,0,0.45)',
    backdropFilter:'blur(18px)',
}}
>

        <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 text-xl">

                ⚠

            </div>

            <div>

                <h2 className="text-xl font-bold text-white">

                    Suspicious Activity Timeline

                </h2>

                <p className="text-gray-400 text-sm">

                    Violations detected during exam

                </p>

            </div>

        </div>

        <div className="space-y-3">

            {violations.map((v, i) => (

                <div
                    key={i}
                    className="flex items-center justify-between bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3"
                >

                    <span className="text-red-300 font-medium">

                        {v.reason}

                    </span>

                    <span className="text-gray-400 text-sm">

                        {v.time}

                    </span>

                </div>

            ))}

        </div>

    </div>
)}

                <div className="space-y-6">

                    {questions.map((q, index) => {

                        const selected = answers[q.id];

                        const correct = q.correctAnswer;

                        return (

                            <div
    key={q.id}
    className="rounded-3xl p-7 relative overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1"
    style={{
        background:
            'linear-gradient(160deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
        border:
            '1px solid rgba(168,85,247,0.12)',
        boxShadow:
            '0 20px 60px rgba(0,0,0,0.45)',
        backdropFilter:'blur(18px)',
    }}
>


                                <div
                                    style={{
                                        position:'absolute',
                                        inset:0,
                                        background:
                                            'radial-gradient(circle at top right, rgba(168,85,247,0.12), transparent 40%)',
                                        pointerEvents:'none',
                                    }}
                                />

                                <div
    className="absolute top-0 left-0 w-full h-[2px]"
    style={{
        background:
            'linear-gradient(90deg,#7c3aed,#a855f7,#06b6d4)',
    }}
/>

                               <div className="flex justify-between items-start mb-5">

                                <div className="flex gap-4">

                                    <div
    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
    style={{
        background:
            'linear-gradient(135deg,#7c3aed,#a855f7)',
        boxShadow:
            '0 0 25px rgba(168,85,247,0.45)',
    }}
>
    {index + 1}
</div>

                                    <h2 className="text-white text-2xl font-bold tracking-tight leading-relaxed"> {q.questionText} </h2>

                                     </div>

                                <div className={`px-4 py-2 rounded-xl text-sm font-bold ${ !answers[q.id]  ? "bg-gray-500/20 text-gray-300 border border-gray-500/30" : answers[q.id] === q.correctAnswer ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>

                                    { answers[q.id] ? ( answers[q.id] === q.correctAnswer ? `+${q.exam?.positiveMarks || 1} / ${q.exam?.positiveMarks || 1}`: `-${q.exam?.negativeMarks || 0} / ${q.exam?.positiveMarks || 1}` ) : `0 / ${q.exam?.positiveMarks || 1}`}

                                </div>

                            </div>

                                <div className="space-y-3">

                                    {[
                                        q.optionA,
                                        q.optionB,
                                        q.optionC,
                                        q.optionD
                                    ].map((option, i) => {

                                        const optionKey = ["A", "B", "C", "D"][i];

                                        const isCorrect = optionKey === correct;

                                        const isSelected = optionKey === selected;

                                        return (

                                            <div
                                                key={i}
                                              className={`p-5 rounded-2xl border flex justify-between items-center transition-all duration-200 hover:scale-[1.01]
                                                
                                                ${
                                                    isCorrect
                                                        ? "border-green-500 bg-green-500/10"
                                                        : isSelected
                                                        ? "border-red-500 bg-red-500/10"
                                                        : "border-white/10 bg-white/[0.02]"
                                                }`}

                                                style={{ backdropFilter:'blur(12px)',}} onMouseEnter={(e)=>{  e.currentTarget.style.transform='translateY(-2px)';}} onMouseLeave={(e)=>{ e.currentTarget.style.transform='translateY(0)'; }}  >

                                                <div className="flex items-center gap-4">

                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                                                    
                                                    ${
                                                        isCorrect
                                                            ? "bg-green-500 text-white"
                                                            : isSelected
                                                            ? "bg-red-500 text-white"
                                                            : "bg-gray-700 text-gray-300"
                                                    }`}>

                                                        {optionKey}

                                                    </div>

                                                    <span className="text-gray-200">

                                                        {option}

                                                    </span>

                                                </div>

                                                <div>

                                                    {isCorrect && (

                                                        <span className="text-green-400 font-semibold">

                                                            Correct Answer

                                                        </span>
                                                    )}

                                                    {!isCorrect &&
                                                        isSelected && (

                                                        <span className="text-red-400 font-semibold">

                                                            Your Answer

                                                        </span>
                                                    )}

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

        </div>
    );
}

export default ReviewAnswersPage;