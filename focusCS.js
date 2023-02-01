let theStorage = chrome.storage.local;
targetUrl = "";
const USE_MOBILE_TOKEN = true;
theStorage.get("refocused_target_url").then((result) => {
    targetUrl = result.refocused_target_url;
}); // Can't use await here, so we have to use a promise

console.log("EXTENSION CS INJECTED");
let url = new URL(window.location.href);
let urlParams = new URLSearchParams(url.search);
let redir = urlParams.get('redir');

if (redir) {
    theStorage.set({"refoc-redir": redir})
}

// Register an event listener for the page to finish loading and then copy the auth token + go to redir + remove redir
window.addEventListener('load', () => {
    setTimeout(async () => {
        // Parse the dom to get the auth token and token
        let authTokenScript = document.querySelector("body > div > div > div > main > script:nth-child(2)").innerHTML;
        let authToken = /{\n(\t){5}return "[\w+=/]+";/g.exec(authTokenScript)
        authToken = authToken[0].substring(15, authToken[0].length - 2); // Remove the extra characters (\n\t\t\t\t\treturn ") and the last character (")

        let tokenScript = document.querySelector("body > div > div > div > main > script:nth-child(3)").innerHTML;
        let token = /jwt=[\w+=/.-]+"/g.exec(tokenScript)
        token = token[0].substring(4, token[0].length - 1); // Remove the "jwt=" and the last "

        let mobileLoginToken = null;
        if (USE_MOBILE_TOKEN) {
            let mobileHTML = await fetch("https://brevardk12.focusschoolsoftware.com/focus/mobileApps/community/")
            let mobileHTMLText = await mobileHTML.text();
            let mobileToken = /__Module__\.token = "[\w+=/.-]+/g.exec(mobileHTMLText)[0].substring(20);
            if (mobileToken && mobileToken.length > 10) {
                token = mobileToken;
            }

            mobileLoginToken = /"login_token":"[\w]*/g.exec(mobileHTMLText)[0].substring(15);
        }

        // Send a message to the background script to refresh the end cookies
        chrome.runtime.sendMessage({type: "refreshCookies", token: token, authToken: authToken, mobileLoginToken: mobileLoginToken}, function (response) {
            console.log(response);
        });

        // If there is a redir parameter set, go to that page and remove the redir parameter
        theStorage.get("refoc-redir", function (result) {
            if (result["refoc-redir"]) {
                theStorage.set({"refoc-redir": null}).then(() => {
                    console.log("refoc-redir set to null");
                });

                window.location = result["refoc-redir"] === "ref" ? targetUrl : result["refoc-redir"];
            }
        });
    }, 100);
});


