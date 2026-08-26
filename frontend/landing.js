const usernameInput = document.querySelector("#usernameInput");
const roomInput = document.querySelector("#roomInput");
const button = document.querySelector(".button");

button.addEventListener("click", () => {
    if (!usernameInput.value || !roomInput.value) {
        console.log('NULL username or roomId');
    }
});