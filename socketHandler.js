const socketIo = require('socket.io');

let io;

function initSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        transports: ['websocket'], 
    });

    io.on('connection', (socket) => {
        console.log('Cliente conectado');

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });
}

function emitSensorData(data) {
    if (io) {
        io.emit('sensorData', data);
        console.log('Mensaje enviado');
    } else {
        console.log('Websocket not initialized');
    }
}

module.exports = {
    initSocket,
    emitSensorData,
};
