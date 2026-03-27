export const loadRazorpayScript = () => {
    if (typeof window === "undefined") {
        return Promise.resolve(false);
    }

    if (window.Razorpay) {
        return Promise.resolve(true);
    }

    return new Promise<boolean>((resolve) => {
        const existingScript = document.getElementById("razorpay-checkout");
        if (existingScript) {
            const onLoad = () => {
                existingScript.removeEventListener("load", onLoad);
                existingScript.removeEventListener("error", onError);
                resolve(true);
            };
            const onError = () => {
                existingScript.removeEventListener("load", onLoad);
                existingScript.removeEventListener("error", onError);
                resolve(false);
            };
            existingScript.addEventListener("load", onLoad);
            existingScript.addEventListener("error", onError);
            return;
        }

        const script = document.createElement("script");
        script.id = "razorpay-checkout";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};
