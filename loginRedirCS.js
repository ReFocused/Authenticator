let url = new URL(window.location.href);
let urlParams = new URLSearchParams(url.search);
let redir = urlParams.get("redir");

if (redir) {
    chrome.storage.local.set({ redir });
    window.location.replace(
        "https://brevardk12.focusschoolsoftware.com/focus/Modules.php"
    );
}
