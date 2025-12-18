import { Server as SocketServer } from 'socket.io';

let io;

export function initSocket(server) {
    io = new SocketServer(server);

    io.on('connection', (socket) => {
        console.log('User connected');
    });
}

export function emitProductUpdate(action, product) {
    io.emit('productUpdate', { action, product });
}

export { io };