// alert("EXTENSION CS INJECTED");
// Parse the URL to get if there is a "?redir=" parameter

let theStorage = chrome.storage.local;

console.log("EXTENSION CS INJECTED");
let url = new URL(window.location.href);
let urlParams = new URLSearchParams(url.search);
let redir = urlParams.get('redir');
console.log("redir: " + redir)
if (redir) {
    theStorage.set({"refoc-redir": redir}).then(() => {
        console.log("refoc-redir set to " + redir);
    });
}
if (true) {
    // Register an event listener for the page to finish loading and then copy the auth token + go to redir + remove redir
    window.addEventListener('load', (event) => {
        console.log('page is loaded');
        setTimeout(() => {
            // Parse the dom to get the auth token and token
            let authTokenScript = document.querySelector("body > div > div > div > main > script:nth-child(2)").innerHTML;
            let authToken = /{\n(\t){5}return "[\w+=/]+";/g.exec(authTokenScript)
            // Remove the extra characters (\n\t\t\t\t\treturn ") and the last character (")
            authToken = authToken[0].substring(15, authToken[0].length - 2);
            // console.log("AuthToken: " + authToken);

            let tokenScript = document.querySelector("body > div > div > div > main > script:nth-child(3)").innerHTML;
            let token = /jwt=[\w+=/.-]+"/g.exec(tokenScript)
            // Remove the "jwt=" and the last "
            token = token[0].substring(4, token[0].length - 1);
            // console.log("Token: " + token);



            // __Module__.token __Module__.session_id
            // theStorage.set({"refoc-token": token}).then(() => {
            //     console.log("refoc-token set to " + token);
            // });
            // theStorage.set({"refoc-auth-token": authToken}).then(() => {
            //     console.log("refoc-auth-token set to " + authToken);
            // });
            // Send a message to the background script to refresh the end cookies
            chrome.runtime.sendMessage({type: "refreshCookies", token: token, authToken: authToken}, function (response) {
                console.log(response);
            });

            // If there is a redir parameter set, go to that page and remove the redir parameter
            theStorage.get("refoc-redir", function (result) {
                if (result["refoc-redir"]) {
                    theStorage.set({"refoc-redir": null}).then(() => {
                        console.log("refoc-redir set to null");
                    });
                    console.log("Redirecting to " + result["refoc-redir"]);
                    window.location = result["refoc-redir"] === "ref" ? "https://refocused.up.railway.app" : result["refoc-redir"];
                }
            });
        }, 100);
    });
}

