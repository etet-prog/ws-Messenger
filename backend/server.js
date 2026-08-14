const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const app = express();
const port = 5090;
const wss = new WebSocket.WebSocketServer({port: 2021});
const users = new Set();

app.use(express.static(path.join(__dirname, "../frontend/")));

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/chat.html"));
});

wss.on('connection', (socket) => {
    users.add(socket);
    socket.on("message", (data) => {
        try {
            const parsed = JSON.parse(data.toString());
            if (parsed.username && parsed.roomId) {
                socket['roomId'] = parsed.roomId; 
                socket['username'] = parsed.username;
                console.log(`${socket.username} connected to '${socket.roomId}' room`);
            }
            else if (parsed.msg){
                console.log(`(${socket.roomId}) ${socket.username}: ${parsed.msg}`);
                users.forEach(user => {
                    if (user !== socket && user.roomId === socket.roomId && user.readyState === WebSocket.OPEN) {
                        user.send(JSON.stringify({msg: parsed.msg, username: socket.username}));
                    } 
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    });

    socket.on('close', () => {
        console.log(`${socket.username} disconnected from '${socket.roomId}'`);
        users.delete(socket);
    });
});

app.listen(port, () => console.log(`> Server Started on ${port}`));