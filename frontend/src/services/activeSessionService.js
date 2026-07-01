import API from "./api";

export const saveActiveSession =
    async (sessionData) => {

    const response =
        await API.post(

            "/active-sessions/save",

            sessionData
        );

    return response.data;
};

export const restoreActiveSession =
    async (email, examId) => {

    const response =
        await API.get(

            "/active-sessions/restore",

            {
                params: {
                    email,
                    examId
                }
            }
        );

    return response.data;
};

export const markSessionSubmitted =
    async (email, examId) => {

    await API.post(

        "/active-sessions/submit",

        null,

        {
            params: {
                email,
                examId
            }
        }
    );
};