let theStorage = chrome.storage.local;
const EXPIRATION_SECONDS = 60 * 60 * 24; // 1 day
targetUrl = "https://refocused.up.railway.app/";
// targetUrl = "http://localhost:3000" // remember to change or add this to the manifest
theStorage.set({ refocused_target_url: targetUrl });
chrome.runtime.onMessage.addListener((msg, sender, res) => {
    console.log(msg, sender, res);
    if (msg.type === "refreshCookies") {
        let expiry = Math.floor(Date.now() / 1000) + EXPIRATION_SECONDS;
        chrome.cookies.set({
            url: targetUrl,
            name: "focus_session_id",
            value: msg.authToken,
            expirationDate: expiry
        });

        chrome.cookies.set({
            url: targetUrl,
            name: "focus_token",
            value: msg.token,
            expirationDate: expiry
        });

        chrome.cookies.get(
            {
                url: "https://brevardk12.focusschoolsoftware.com/focus",
                name: "PHPSESSID"
            },
            function (cookie) {
                console.log("Setting cookie: " + cookie.name);
                chrome.cookies.set({
                    url: targetUrl,
                    name: "focus_php_session_id",
                    value: cookie.value,
                    expirationDate: expiry
                });
            }
        );

        if (msg.mobileLoginToken) {
            chrome.cookies.set({
                url: targetUrl,
                name: "focus_login_token",
                value: msg.mobileLoginToken,
                expirationDate: expiry
            });
        }
    }
});
