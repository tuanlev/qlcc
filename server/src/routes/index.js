const departmentRoute = require("./derpartment.route");
const positionRoute = require("./position.route");
const shiftRoute = require("./shift.route");

const routes = require("express").Router();
routes.use("/shifts",shiftRoute);
routes.use("/departments",departmentRoute);
routes.use("/positions",positionRoute)
module.exports = routes;
