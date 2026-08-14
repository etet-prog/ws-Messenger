const parent = document.querySelector("#parent");
const usernameInput = document.querySelector(".username");
const roomInput = document.querySelector(".room");
const join = document.querySelector(".join");
const input = document.querySelector(".input");
const send = document.querySelector(".send");

join.addEventListener("click", () => {
    const socket = new WebSocket('ws://127.0.0.1:2021');

    socket.onopen = () => {
        console.log("Connected to the Server");
        socket.send(JSON.stringify({
            roomId: roomInput.value.trim() || "Public",
            username: usernameInput.value.trim() || "Anonymous"
        }));
    };
    socket.onmessage = (msg) => {
        const parsed = JSON.parse(msg.data);
        console.log(`${parsed.username}: ${parsed.msg}`);
    };

    send.addEventListener("click", () => {
        if (input.value) {
            socket.send(JSON.stringify({msg: input.value.trim()}));
            console.log(`You: ${input.value.trim()}`);
            input.value = "";   
        };
    });
    socket.onclose = () => {throw new Error("Server Closed")};
})