const departmentRoute = require("./derpartment.route");
const shiftRoute = require("./shift.route");

const routes = require("express").Router();
routes.use("/shifts",shiftRoute);
routes.use("/departments",departmentRoute);
module.exports = routes;
