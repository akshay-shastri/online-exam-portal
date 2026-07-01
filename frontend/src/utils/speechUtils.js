export const speak = (message) => {
    try {
        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(message);

        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;
        speech.lang = "en-US";

        window.speechSynthesis.speak(speech);

    } catch (e) {
        console.log(e);
    }
};