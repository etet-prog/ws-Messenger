const usernameInput = document.querySelector(".username");
const roomInput = document.querySelector(".roomId");
const button = document.querySelector(".button");

async function sendData() {
    const res = await fetch("http://127.0.0.1:5090/landing", {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: usernameInput.value.trim(),
            roomId: roomInput.value.trim()
        })
    });
};

button.addEventListener("click", () => {
    if (usernameInput.value && roomInput.value) {
        sendData();
    }
});