let theStorage = chrome.storage.local;
// Create an event listener for the .deactivate and .activate buttons
// and call the appropriate function when they are clicked

let deactivateButton = document.querySelector('.deactivate');
let activateButton = document.querySelector('.activate');

deactivateButton.addEventListener('click', deactivate);
activateButton.addEventListener('click', activate);

function deactivate() {
    localStorage.setItem('activated', 'false');
    // Remove all cookies from the target url ("https://refocused.up.railway.app/")
    // TODO: FIX THIS
    chrome.cookies.getAll({url: "https://refocused.up.railway.app/"}, function (cookies) {
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            chrome.cookies.remove({url: "https://refocused.up.railway.app/", name: cookie.name});
            console.log("Removed cookie: " + cookie.name);
        }
    });
    updateActiveButton()

}

async function activate() {
    localStorage.setItem('activated', 'true');

    updateActiveButton()
}

function updateActiveButton() {
    // Set correct button to hidden and the other to visible
    if (localStorage.getItem('activated') === 'true') {
        deactivateButton.style.display = 'block';
        activateButton.style.display = 'none';
        document.getElementById("headingActiveLabel").innerText = "active";
    }
    else {
        deactivateButton.style.display = 'none';
        activateButton.style.display = 'block';
        document.getElementById("headingActiveLabel").innerText = "not active";
    }
}
updateActiveButton()