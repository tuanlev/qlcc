const departmentRoute = require("./derpartment.route");
const positionRoute = require("./position.route");
const shiftRoute = require("./shift.route");

const routes = require("express").Router();
routes.use("/shifts",shiftRoute);
routes.use("/departments",departmentRoute);
routes.use("/positions",positionRoute)
routes.use("/auth", require("./auth.route"));
routes.use("/users", require("./user.route"));
routes.use("/devices", require("./device.route"));
routes.use("/employees", require("./employee.route"));
routes.use("/checkins", require("./checkin.route"));
module.exports = routes;
