let theStorage = chrome.storage.local;
targetUrl = "https://refocused.up.railway.app/"
// targetUrl = "https://example.com" // remember to change or add this to the manifest
theStorage.set({refocused_target_url: targetUrl})
chrome.runtime.onMessage.addListener((msg, sender, res) => {
    console.log(msg, sender, res);
    if (msg.type === "refreshCookies") {

        chrome.cookies.set({
            url: targetUrl,
            name: "focus_session_id",
            value: msg.authToken
        });

        chrome.cookies.set({
            url: targetUrl,
            name: "focus_token",
            value: msg.token
        });

        chrome.cookies.get({
            url: "https://brevardk12.focusschoolsoftware.com/focus",
            name: "PHPSESSID"
        }, function (cookie) {
            console.log("Setting cookie: " + cookie.name);
            chrome.cookies.set({
                url: targetUrl,
                name: "focus_php_session_id",
                value: cookie.value
            });

        });
    }
});