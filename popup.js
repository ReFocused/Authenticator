let endCookies = [];
endCookies.push(await (chrome.cookies.get({
    url: "https://refocused.up.railway.app/",
    name: "refoc-token"
})));
endCookies.push(await (chrome.cookies.get({
    url: "https://refocused.up.railway.app/",
    name: "refoc-auth-token"
})))
endCookies.push(await (chrome.cookies.get({
    url: "https://refocused.up.railway.app/",
    name: "refoc-PHPSESSID"
})))
console.log(endCookies);

function truncate(s, n) {
    if (s.length < n) return s;
    return s.substring(0, n);
}

if (endCookies.every((cookie) => cookie !== null)){
    document.getElementById("description").innerHTML = "Existing Auth Cookies found: <br> " +
        endCookies.map((cookie) => cookie.name + ": " + truncate(cookie.value, 5) + "...").join("<br>")
    document.getElementById("loginButton").innerText = "Refresh Session"
}
else {
    document.getElementById("description").innerText = "No Cookies found, please login to Focus to authenticate."
    document.getElementById("loginButton").innerText = "Log In"
}