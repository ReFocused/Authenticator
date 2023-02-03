/**
 * @type {string}
 */
let targetUrl;
chrome.storage.local
    .get("targetUrl")
    .then((/** @type {{targetUrl: string}} */ { targetUrl: res }) => {
        targetUrl = res;
    }); // Can't use await here, so we have to use a promise

let url = new URL(window.location.href);
let urlParams = new URLSearchParams(url.search);
let redir = urlParams.get("redir");

if (redir) {
    chrome.storage.local.set({ redir });
}

const hideElems = document.createElement("style");
hideElems.innerHTML = `* {
    display: none !important;
}`;
document.documentElement.appendChild(hideElems);

// Register an event listener for the page to finish loading and then copy the auth token + go to redir + remove redir
document.addEventListener("DOMContentLoaded", async () => {
    /**
     * @type {{redir: string}}
     */
    let { redir } = await chrome.storage.local.get("redir");

    chrome.storage.local.set({ redir: null });

    if (!redir) {
        hideElems.remove();
    }

    let sessionId =
        /static get session_id\(\) {\n[\s]*return "([\w+=/]+)";/g.exec(
            document.body.innerHTML
        )[1];

    // We get the token from the mobile app because it gives us access to more Controllers
    let mobileHTML = await fetch(
        "https://brevardk12.focusschoolsoftware.com/focus/mobileApps/community/?expo=true"
    ).then((r) => r.text());
    let token = /__Module__\.token = "([\w+=/.-]+)"/g.exec(mobileHTML)[1];

    let loginToken = /"login_token":"([\w]*)"/g.exec(mobileHTML)[1];

    // Send a message to the background script to refresh the end cookies
    chrome.runtime.sendMessage({
        type: "refreshCookies",
        token,
        sessionId,
        loginToken
    });

    // If there is a redir parameter set, go to that page and remove the redir parameter
    if (redir) {
        let u = redir
            .replace("ref", targetUrl)
            // remove any more than one `/` in a row, except for the protocol
            .replace(/(?<!:)(\/{2,})/g, "/");

        window.location.href = u;
    }
});
