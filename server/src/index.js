require("dotenv").config()
const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
// khởi tạo socket
require("./config/socket").initialize(server);
require("./config/db")();
require("./config/mqtt").connect(server);
app.use(express.json())
app.use(cors())
server.listen(process.env.PORT||3000,()=>{
    console.log("server run on port: " +process.env.PORT||3000)
})