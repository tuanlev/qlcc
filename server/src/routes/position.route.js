const { getPositions, addPosition, deletePositionById, updatePositionById, getPositionById } = require("../controller/position.controller");

const positionRoute = require("express").Router();
positionRoute.get("/",getPositions);
positionRoute.post("/",addPosition)
positionRoute.get("/:positionId",getPositionById);
positionRoute.delete("/:positionId",deletePositionById);
positionRoute.patch("/:positionId",updatePositionById);
module.exports = positionRoute;