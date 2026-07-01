export const playWarningSound = () => {

    try {

        const ctx =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();

        const gain = ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);

        gain.connect(ctx.destination);

        osc1.type = "sawtooth";
        osc2.type = "square";

        osc1.frequency.setValueAtTime(
            700,
            ctx.currentTime
        );

        osc2.frequency.setValueAtTime(
            900,
            ctx.currentTime
        );

        gain.gain.setValueAtTime(
            0.3,
            ctx.currentTime
        );

        osc1.start();
        osc2.start();

        osc1.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);

    } catch (e) {

        console.log(e);
    }
};