const input = document.getElementById("input");
const send = document.getElementById("send");
const socket = new WebSocket('ws://127.0.0.1:2021');

socket.onopen = () => console.log("Connected to the server");
socket.onmessage = (msg) => {
    const parsed = JSON.parse(msg.data);
    console.log(parsed.msg);
};

send.addEventListener("click", () => {
    if (input.value) {
        const newMessage = {msg: input.value.trim()};
        socket.send(JSON.stringify(newMessage));
        console.log(`You: ${input.value.trim()}`);
        input.value = "";   
    };
});

socket.onclose = () => console.log("[!] Server closed");