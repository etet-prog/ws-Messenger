const title = document.querySelector("#title");
const messagesSection = document.querySelector("#messagesSection");
const textInput = document.querySelector("#text");
const leave = document.querySelector("#leave");
const send = document.querySelector("#send");
const socket = new WebSocket('ws://127.0.0.1:2021');

function meChatBubble(message) {
    const bubble = document.createElement("div");
    bubble.className = 'meChatBubble';
    bubble.textContent = message;
    messagesSection.appendChild(bubble);
    messagesSection.scrollTop = messagesSection.scrollHeight;
}

function otherChatBubble(message, username) {
    const bubble = document.createElement("div");
    bubble.className = "otherChatBubble";
    
    const newUsername = document.createElement("p");
    newUsername.className = "username";
    newUsername.textContent = username;
    
    const newMessage = document.createElement("div");
    newMessage.className = "messageLeft";
    newMessage.textContent = message;

    messagesSection.appendChild(newUsername);
    bubble.appendChild(newMessage);
    messagesSection.appendChild(bubble);
    messagesSection.scrollTop = messagesSection.scrollHeight;
}

function sendMessage() {
    if (textInput.value) {
        const newMsg = {msg: textInput.value.trim()};
        socket.send(JSON.stringify(newMsg));
        meChatBubble(newMsg.msg);
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
        otherChatBubble(parsed.msg, parsed.username);
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