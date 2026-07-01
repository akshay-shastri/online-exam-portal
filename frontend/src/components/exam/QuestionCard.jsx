import { memo } from "react";

function QuestionCard({
    currentQuestion,
    currentQuestionIndex,
    questions,
    answers,
    handleOptionSelect,
    optionLabels,
    bookmarkedQuestions,
    toggleBookmark,
    setCurrentQuestionIndex,
    setShowSubmitConfirm
}) {
    return (
        <div className="question-card premium-hover-lift">
            <div className="question-card-top-line" />

            <div className="p-6 sm:p-8">
                {/* Top section */}
                <div className="flex items-start justify-between gap-4 mb-8">
                    <div>
                        <div className="question-badge mb-4">
                            Question {currentQuestionIndex + 1}
                        </div>

                        <h2 className="question-title text-xl sm:text-2xl font-bold">
                            {currentQuestion.questionText}
                        </h2>
                    </div>

                    <button
                        onClick={() => toggleBookmark(currentQuestion.id)}
                        className={`question-bookmark ${ bookmarkedQuestions.includes(currentQuestion.id) ? "active"  : "inactive"}`}  >
                        ★
                    </button>
                </div>

                {/* Options */}
                <div className="space-y-4">
                    {[
                        currentQuestion.optionA,
                        currentQuestion.optionB,
                        currentQuestion.optionC,
                        currentQuestion.optionD
                    ].map((option, index) => {
                        const optionKey = optionLabels[index];
                        const isSelected = answers[currentQuestion.id] === optionKey;

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(currentQuestion.id, optionKey)}
                               className={`question-option ${  isSelected ? "selected" : "" }`}  >
                                <div className="flex items-center gap-4">
                                    <div className="question-option-key" >
                                        {optionKey}
                                    </div>

                                    <span style={{ fontSize: '15px', lineHeight: '1.7' }}>
                                        {option}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Bottom navigation */}
                <div className="flex flex-wrap justify-between gap-4 mt-10">
                    <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={currentQuestionIndex === 0}
                        className={`question-nav-button ${currentQuestionIndex === 0 ? "disabled" : "secondary"}`}>
                        Previous
                    </button>

                    <div className="flex gap-3">
                        {currentQuestionIndex < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                                className="question-nav-button primary" >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowSubmitConfirm(true)}
                                className="question-nav-button success">
                                Submit Exam
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(QuestionCard);