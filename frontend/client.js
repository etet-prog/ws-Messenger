const textInput = document.querySelector(".text");
const leave = document.querySelector(".leave");
const send = document.querySelector(".send");
const socket = new WebSocket('ws://127.0.0.1:2021');

socket.onopen = () => {
    leave.addEventListener("click", () => {
        socket.close();
        window.location.href = "http://127.0.0.1:5090/landing";
    });
};
socket.onmessage = (msg) => {
    const parsed = JSON.parse(msg.data);
    if (parsed.msg) {
        console.log(`${parsed.username}: ${parsed.msg}`);
    }
    else if (parsed.username && parsed.roomId) { 
        console.log(`Username: ${parsed.username} | Room: ${parsed.roomId}`);
    }
};

send.addEventListener("click", () => {
    if (textInput.value) {
        socket.send(JSON.stringify({msg: textInput.value.trim()}));
        console.log(`You: ${textInput.value.trim()}`);
        textInput.value = "";   
    };
});
socket.onclose = () => {throw new Error("Connection Closed")};