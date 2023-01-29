// On install
// chrome.runtime.onInstalled.addListener(function() {
//     Set the default state to activated
// localStorage.setItem('activated', 'true');
// })
// noinspection JSDeprecatedSymbols
let theStorage = chrome.storage.local;
chrome.runtime.onMessage.addListener((msg, sender, res) => {
    console.log(msg, sender, res);
    if (msg.type === "refreshCookies") {

        chrome.cookies.set({
            url: "https://refocused.up.railway.app/",
            name: "refoc-auth-token",
            value: msg.authToken
        });
        console.log("Set cookie: refoc-auth-token");

        chrome.cookies.set({
            url: "https://refocused.up.railway.app/",
            name: "refoc-token",
            value: msg.token
        });
        console.log("Set cookie: refoc-token");

        // Get the PHPSESSHID from cookies
        chrome.cookies.get({
            url: "https://brevardk12.focusschoolsoftware.com/focus",
            name: "PHPSESSID"
        }, function (cookie) {
            // Set the cookies to the target url ("https://refocused.up.railway.app/")
            console.log("Setting cookie: " + cookie.name);
            chrome.cookies.set({
                url: "https://refocused.up.railway.app/",
                name: "refoc-" + cookie.name,
                value: cookie.value
            });

        });
    }
});