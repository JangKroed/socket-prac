import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
// import WebSocket from 'ws';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);
// const wss = new WebSocket.Server({ server });

// const sockets = [];

// wss.on('connection', (socket) => {
//     sockets.push(socket);
//     socket.nickname = 'Anon';
//     console.log('Connected to Browser ✅');
//     socket.on('close', () => console.log('Disconnected from the Browser ❌'));
//     socket.on('message', (msg) => {
//         const message = JSON.parse(msg.toString());
//         // const handler = {
//         //     new_message: sockets.forEach((aSocket) =>
//         //         aSocket.send(`${socket.nickname}: ${message.payload}`)
//         //     ),
//         //     nickname: socket.nickname = message.payload,
//         // };
//         // handler[message.type]
//         switch (message.type) {
//             case 'new_message':
//                 sockets.forEach((aSocket) =>
//                     aSocket.send(`${socket.nickname}: ${message.payload}`)
//                 );
//             case 'nickname':
//                 socket.nickname = message.payload;
//         }
//     });
// });

httpServer.listen(3000, handleListen);

// {
//     type:"message",
//     payload:"hello everyone!"
// }

// {
//     type:"nickname",
//     payload:"nico"
// }
