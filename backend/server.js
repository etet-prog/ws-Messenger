const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const app = express();
const wss = new WebSocket.WebSocketServer({port: 2021});
const PORT = 5090;
const CLIENT_DATA = new Array();
const SOCKETS = new Set();

app.use(express.static(path.join(__dirname, "../frontend/")));
app.use(express.urlencoded());

app.get('/landing', (req, res) => {
    if (req.url !== '/landing') {
        res.redirect('/landing');
    }
    else {
        res.sendFile(path.join(__dirname, "../frontend/landing.html"));
    }
});

app.post('/submit', (req, res) => {
    const data = req.body;
    if (data.username && data.roomId) {
        res.redirect(`/rooms?user=${data.username}&room=${data.roomId}`);
    }
    else {
        res.status(400).redirect('/landing');
    }
});

app.get('/rooms', (req, res) => {
    const {user, room} = req.query;
    if (user && room) {
        res.sendFile(path.join(__dirname, "../frontend/socket.html"));
        const newClient = {
            username: user,
            roomId: room,
        }
        CLIENT_DATA.push(newClient);
    }
    else {
        res.status(400).redirect('/landing');
    }
});

wss.on('connection', (socket) => {
    SOCKETS.add(socket);
    const lastClient = CLIENT_DATA[CLIENT_DATA.length - 1];
    socket['username'] = lastClient.username;
    socket['roomId'] = lastClient.roomId;
    console.log(`${socket.username} connected to '${socket.roomId}' room`);
    socket.send(JSON.stringify({username: socket.username, roomId: socket.roomId}));

    socket.on("message", (data) => {
        try {
            const parsedData = JSON.parse(data.toString());
            if (parsedData.msg) {
                if (socket.username && socket.roomId) {
                    SOCKETS.forEach(client => {
                        if (client !== socket && client.roomId === socket.roomId && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({msg: parsedData.msg, username: socket.username}));
                        } 
                    });
                    console.log(`(${socket.roomId}) ${socket.username}: ${parsedData.msg}`);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    });

    socket.on('close', () => {
        console.log(`${socket.username} disconnected from '${socket.roomId}'`);
        SOCKETS.delete(socket);
    });
});

app.listen(PORT, () => console.log(`> Server Started At ${PORT}`));