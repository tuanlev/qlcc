const { Server } = require("socket.io")
let io;
function initialize(app) {
    io = new Server(require("http").createServer(app), {
        cors: {
            origin: "*",
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
module.exports = {initialize, getIo};