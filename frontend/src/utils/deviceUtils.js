export const isMobileDevice = () => {

    const userAgent =
        navigator.userAgent.toLowerCase();

    const mobileKeywords = [
        "android",
        "iphone",
        "ipad",
        "ipod",
        "mobile",
        "opera mini",
        "iemobile"
    ];

    const isMobileUA =
        mobileKeywords.some((keyword) =>
            userAgent.includes(keyword)
        );

    const hasTouch =
        navigator.maxTouchPoints > 1;

    const smallScreen =
        window.innerWidth <= 1024;

    return (
        isMobileUA ||
        (hasTouch && smallScreen)
    );
};