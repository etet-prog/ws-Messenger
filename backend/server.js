const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 5090;
const wss = new WebSocket.WebSocketServer({port: 2021});

const clientData = new Array();
const clients = new Set();

app.use(express.static(path.join(__dirname, "../frontend/")));
app.use(express.json());

app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/landing.html"));
});

app.post('/landing', (req, res) => {
    const data = req.body;
    if (data.username && data.roomId) {
        res.redirect('/rooms');
        clientData.push({username: data.username, roomId: data.roomId});
    }
});

app.get('/rooms', (req, res) => {
    console.log('/rooms');
});

function writeToJson(path, data) {
    if (fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
    }
}

wss.on('connection', (socket) => {
    clients.add(socket);
    const lastClient = clientData[clientData.length - 1];
    socket['username'] = lastClient.username;
    socket['roomId'] = lastClient.roomId;
    console.log(`${socket.username} connected to '${socket.roomId}' room`);
    socket.send(JSON.stringify({username: socket.username, roomId: socket.roomId}));

    socket.on("message", (data) => {
        try {
            const parsedData = JSON.parse(data.toString());
            if (parsedData.msg) {
                if (socket.username && socket.roomId) {
                    clients.forEach(client => {
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
        clients.delete(socket);
    });
});

app.listen(port, () => console.log(`> Server Started on ${port}`));