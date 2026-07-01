function ExamSection({ title, exams, renderExamCard }) {
    if (!exams.length) {
        return null;
    }

    return (
        <div className="mb-16 lg:mb-20">
            {/* Section Header */}
            {/* Added py-5 and px-6 to give the absolute child layers room to breathe */}
            <div className="section-heading premium-surface py-5 px-6 items-center flex justify-between">
                <div className="section-heading-left">
                    <h2 className="section-heading-title">
                        {title}
                    </h2>
                    <p className="section-heading-sub">
                        Explore available exams and continue your assessment journey.
                    </p>
                </div>

                <div className="section-count">
                    {exams.length} Exams
                </div>
            </div>

            {/* Exam Grid */}
            <div className="exam-grid gap-6 xl:gap-8">
                {exams.map(renderExamCard)}
            </div>
        </div>
    );
}

export default ExamSection;