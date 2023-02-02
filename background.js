const EXPIRATION_SECONDS = 60 * 60 * 24; // 1 day
targetUrl = "https://refocused.up.railway.app/";
// targetUrl = "http://localhost:3000" // remember to change or add this to the manifest
chrome.storage.local.set({ targetUrl });

chrome.runtime.onMessage.addListener(
    /**
     * @param {{type: string, sessionId: string, token: string, loginToken: string}} msg
     * @param {any} sender
     * @param {function(any): void} sendResponse
     */ ({ type, sessionId, token, loginToken }, sender, sendResponse) => {
        console.log(type, sessionId, token, loginToken);
        if (type === "refreshCookies") {
            (async () => {
                let expiry = Math.floor(Date.now() / 1000) + EXPIRATION_SECONDS;

                chrome.cookies.set({
                    url: targetUrl,
                    name: "focus_login_token",
                    value: loginToken,
                    expirationDate: expiry
                });

                chrome.cookies.set({
                    url: targetUrl,
                    name: "focus_session_id",
                    value: sessionId,
                    expirationDate: expiry
                });

                chrome.cookies.set({
                    url: targetUrl,
                    name: "focus_token",
                    value: token,
                    expirationDate: expiry
                });

                /**
                 * @type {{name: string}}
                 */
                let { value } = await chrome.cookies.get({
                    url: "https://brevardk12.focusschoolsoftware.com/focus",
                    name: "PHPSESSID"
                });
                chrome.cookies.set({
                    url: targetUrl,
                    name: "focus_php_session_id",
                    value,
                    expirationDate: expiry
                });
            })();
        }
        sendResponse("done");
    }
);
