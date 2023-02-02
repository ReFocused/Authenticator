(async () => {
    const url = chrome.storage.local.get("targetUrl");

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

    console.log(cookies);

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
})();
