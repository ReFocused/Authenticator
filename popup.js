let theStorage = chrome.storage.local;
console.log(await theStorage.get("refocused_target_url"));
targetUrl = theStorage.get("refocused_target_url").then(async (targetUrl) => { //  tried to make this work with await but it didn't work
    targetUrl = targetUrl["refocused_target_url"];
    let endCookies = [];
    endCookies.push(await (chrome.cookies.get({
        url: targetUrl,
        name: "focus_token"
    })));
    endCookies.push(await (chrome.cookies.get({
        url: targetUrl,
        name: "focus_session_id"
    })))
    endCookies.push(await (chrome.cookies.get({
        url: targetUrl,
        name: "focus_php_session_id"
    })))
    console.log(endCookies);

    if (endCookies.every((cookie) => cookie !== null)) {
        document.getElementById("description").innerHTML = "Existing Auth Cookies found: <br> " +
            endCookies.map((cookie) => cookie.name + ": " + cookie.value.substring(0, 5) + "...").join("<br>")
        document.getElementById("loginButton").innerText = "Refresh Session"
    } else {
        document.getElementById("description").innerText = "No Cookies found, please login to Focus to authenticate."
        document.getElementById("loginButton").innerText = "Log In"
    }
});