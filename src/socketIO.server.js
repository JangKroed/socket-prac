import express from 'express';
import http from 'http';
import { instrument } from '@socket.io/admin-ui';
import { Server } from 'socket.io';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
        origin: ['https://admin.socket.io'],
        credentials: true, // 쿠키공유 여부
    },
});

instrument(wsServer, {
    auth: false,
});

function publicRooms() {
    const { sids, rooms } = wsServer.sockets.adapter;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) publicRooms.push(key);
    });
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on('connection', (socket) => {
    console.log(wsServer.sockets.adapter)
    socket['nickname'] = 'Anon';
    socket.onAny((event) => {
        // console.log(wsServer.sockets.adapter);
        console.log(`Socket Event:${event}`);
    });
    socket.on('enter_room', (roomName, done) => {
        socket.join(roomName);
        done();
        socket
            .to(roomName)
            .emit('welcome', socket.nickname, countRoom(roomName));
        wsServer.sockets.emit('room_change', publicRooms());
    });
    socket.on('disconnecting', () => {
        socket.rooms.forEach((room) =>
            socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1)
        );
    });
    socket.on('disconnect', () => {
        wsServer.sockets.emit('room_change', publicRooms());
    });
    socket.on('new_message', (msg, room, done) => {
        socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
});

httpServer.listen(3001, handleListen);
