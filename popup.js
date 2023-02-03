(async () => {
    /**
     * @type {{targetUrl: string}}
     */
    const { targetUrl: url } = await chrome.storage.local.get("targetUrl");

    /**
     * @type {{name: string, value: string}[]}
     */
    let cookies = [
        await chrome.cookies.get({
            url,
            name: "focus_token"
        }),
        await chrome.cookies.get({
            url,
            name: "focus_session_id"
        }),
        await chrome.cookies.get({
            url,
            name: "focus_php_session_id"
        }),
        await chrome.cookies.get({
            url,
            name: "focus_login_token"
        })
    ];

    if (cookies.every((cookie) => cookie !== null)) {
        document.getElementById(
            "description"
        ).innerHTML = `Existing Auth Cookies found: <br>
            ${cookies
                .map(
                    (cookie) =>
                        `${cookie.name}: ${cookie.value.substring(0, 5)}...`
                )
                .join("<br>")}`;
        document.getElementById("loginButton").innerText = "Refresh Session";
    } else {
        document.getElementById("description").innerText =
            "No Cookies found, please login to Focus to authenticate.";
        document.getElementById("loginButton").innerText = "Log In";
    }

    let { prodUrl } = await chrome.storage.local.get("prodUrl");
    let { devUrl } = await chrome.storage.local.get("devUrl");

    document.getElementById("prodLabel").innerText = prodUrl;
    document.getElementById("localLabel").innerText = devUrl;
    // set the correct radio button to selected based on the current activeUrl
    document.getElementById("prod").checked = url === prodUrl;
    document.getElementById("local").checked = url === devUrl;

    document.getElementById("targetUrlSelector").addEventListener("change", () => {
        let newTargetUrl = prodUrl;
        if (document.getElementById("local").checked) newTargetUrl = devUrl;
        console.log("Setting new turl: " + newTargetUrl)
        chrome.storage.local.set({targetUrl: newTargetUrl});
    })
})();
