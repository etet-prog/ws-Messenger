const title = document.querySelector("#title");
const messageSection = document.querySelector("#message-section");
const textInput = document.querySelector("#text");
const leave = document.querySelector("#leave-button");
const send = document.querySelector("#send-button");
const socket = new WebSocket('ws://127.0.0.1:2021');

function rightChatBubble(message) {
    const bubble = document.createElement("div");
    bubble.className = "chatBubble"
    bubble.classList.add("right-chatBubble");

    bubble.textContent = message;
    messageSection.appendChild(bubble);
    messageSection.scrollTop = messageSection.scrollHeight;
}

function leftChatBubble(message, username) {
    const bubble = document.createElement("div");
    bubble.className = "chatBubble";
    bubble.classList.add("left-chatBubble");

    const newUsername = document.createElement("p");
    newUsername.className = "username";
    newUsername.textContent = username;
    
    const newMessage = document.createElement("div");
    newMessage.className = "messageLeft";
    newMessage.textContent = message;

    messageSection.appendChild(newUsername);
    bubble.appendChild(newMessage);
    messageSection.appendChild(bubble);
    messageSection.scrollTop = messageSection.scrollHeight;
}

function sendMessage() {
    if (textInput.value) {
        const newMsg = {msg: textInput.value.trim()};
        socket.send(JSON.stringify(newMsg));
        rightChatBubble(newMsg.msg);
        textInput.value = "";   
    };
}

socket.onopen = () => {
    leave.addEventListener("click", () => {
        socket.close();
    });
};
socket.onmessage = (msg) => {
    const parsed = JSON.parse(msg.data);
    if (parsed.msg) {
        leftChatBubble(parsed.msg, parsed.username);
    }
    else if (parsed.username && parsed.roomId) { 
        console.log(`Username: ${parsed.username} | Room: ${parsed.roomId}`);
        title.textContent = `WsChat | ${parsed.roomId}`; 
    }
};

send.addEventListener("click", () => {
    sendMessage();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});
socket.onclose = () => {throw new Error("Connection Closed")};