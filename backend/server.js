const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const app = express();

const PORT = 5090;
const wss = new WebSocket.WebSocketServer({port: 2021});
const users = new Set();

app.use(express.static(path.join(__dirname, "../frontend/")));

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/chat.html"));
});

wss.on('connection', (socket) => {
    console.log("New user connected");
    users.add(socket);

    socket.on("message", (data) => {
        const parsed = JSON.parse(data.toString());
        users.forEach(user => {
            if (user !== socket && user.readyState === WebSocket.OPEN) user.send(JSON.stringify(parsed)); 
        });
    });

    socket.on('close', () => console.log("Client disconnected!"));
});

app.listen(PORT, () => console.log(`> Server Started on ${PORT}`));