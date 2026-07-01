import API from "./api";

export const fetchExamQuestions =
    async ({

        examId,

        studentName

    }) => {

        const response =
            await API.get(
                `/questions/${examId}`
            );

        const data =
            response.data;

        const shuffled = [...data];

        for (
            let i = shuffled.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [shuffled[i], shuffled[j]] = [
                shuffled[j],
                shuffled[i]
            ];
        }

        let alreadyAttempted =
            false;

        if (
            shuffled.length > 0 &&
            shuffled[0].exam
        ) {

            const examTitle =
                shuffled[0].exam.title;

            const checkRes =
                await API.get(
                    `/results/check/${encodeURIComponent(
                        studentName
                    )}/${encodeURIComponent(
                        examTitle
                    )}`
                );

            alreadyAttempted =
                checkRes.data.attempted;
        }

        return {

            questions:
                shuffled,

            exam: shuffled[0]?.exam || null,

            alreadyAttempted,

            duration:
                shuffled.length > 0 &&
                shuffled[0].exam?.duration
                    ? shuffled[0].exam.duration
                    : 5
        };
    };