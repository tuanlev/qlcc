require("dotenv").config()
const express = require("express");
const cors = require("cors");
const { errorHandling } = require("./middlewares/errorHandling.middleware");
const { getEmployees } = require("./controller/employee.controller");
const shiftRoute = require("./routes/shift.route");
const routes = require("./routes");
const app = express();
const server = require("http").createServer(app);
// khởi tạo socket
require("./config/socket").initialize(server);
require("./config/db")();
require("./config/mqtt").connect(server);
app.use(express.json())
app.use(cors())
app.use(routes)
app.use(errorHandling)
server.listen(process.env.PORT || 3000, () => {
    console.log("server run on port: " + process.env.PORT || 3000)
})
