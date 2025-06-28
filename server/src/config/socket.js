const { Server } = require("socket.io")
let io;
function initialize(server) {
    io = new Server(server, {
        cors: {
            origin: ["https://admin.socket.io"],
            methods: ["GET", "POST"]
        }
    });
    
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}

function getIo() {
    if (!io) throw new Error("IO doesn't init");
    else
        return io;
}
module.exports = { initialize, getIo };