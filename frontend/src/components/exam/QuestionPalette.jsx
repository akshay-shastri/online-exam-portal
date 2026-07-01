import { memo } from "react";
import { Bookmark } from "lucide-react";

function QuestionPalette({
    questions,
    answers,
    bookmarkedQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answeredCount
}) {

    const renderButton = (q, index, mobile = false) => {
        const answered = !!answers[q.id];
        const active = currentQuestionIndex === index;
        const bookmarked = bookmarkedQuestions.includes(q.id);

        return (
            <button key={q.id} onClick={() => setCurrentQuestionIndex(index)} title={`Question ${index + 1}`} className={`palette-btn ${active ? "active" : bookmarked ? "bookmarked" : answered ? "answered" : "unanswered"}`}>
                {bookmarked && !active ? "★" : index + 1}
          </button>
        );
    };

    return (
        <>
            {/* Desktop */}
           <div className="hidden lg:flex flex-col gap-0 flex-shrink-0">
                <div className="question-palette">
                    <div className="question-palette-header">
                        <span
                           className="question-palette-title">
                            Questions
                        </span>

                        <span
                            className="question-palette-counter">
                            {answeredCount}/{questions.length}
                        </span>
                    </div>

                   <div  className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }} >
                        <div className="question-palette-grid">
                            {questions.map((q, index) => renderButton(q, index))}
                        </div>
                    </div>

                    <div className="question-palette-footer">
                        {[
                            {
                                color: 'linear-gradient(135deg,#facc15,#eab308)',
                                label: 'Current'
                            },
                            {
                                color: 'rgba(34,197,94,0.5)',
                                label: 'Answered'
                            },
                            {
                                color: 'rgba(234,179,8,0.4)',
                                label: 'Bookmarked'
                            },
                            {
                                color: 'rgba(255,255,255,0.08)',
                                label: 'Unattempted'
                            },
                        ].map(({ color, label }) => (
                            <div key={label} className="question-palette-legend">
                                <div  className="question-palette-dot"  style={{ background: color }}/>
                                <span>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile */}
           <div className="question-palette-mobile lg:hidden mb-5">
                <div
                    className="flex gap-2"
                    style={{ minWidth: 'max-content' }}
                >
                    {questions.map((q, index) => renderButton(q, index, true))}
                </div>
            </div>
        </>
    );
}

export default memo(QuestionPalette);