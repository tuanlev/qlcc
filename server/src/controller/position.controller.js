const positionService = require("../service/position.service");
exports.getPositions = async (req, res, next) => {
    try {
        const data = await positionService.getPositions(req.query);
        if (data == [] || !data) throw new Error("no data found");
        res.status(200).json({
            message: "success",
            data: data

        })
    } catch (e) {
        next(new Error("position.controller.getPosition.error :" + e.message))
    }
}
exports.updatePositionById = async (req, res, next) => {
    try {
        const {positionId} = req.params;
        const data =await  positionService.updatePositionById(positionId, req.body)
        if (data == [] || !data) throw new Error("no data found");
        res.status(200).json({
            message: "success",
            data: data

        })
    } catch (e) {
        next(new Error("position.controller.updatePosition.error :" + e.message))
    }
}
exports.getPositionById = async (req, res, next) => {
    try {
        const {positionId} = req.params;
        const data =await  positionService.getPositionById(positionId);
        if (data == [] || !data) throw new Error("no data found");
        res.status(200).json({
            message: "success",
            data: data

        })
    } catch (e) {
        next(new Error("position.controller.getPositionById.error :" + e.message))
    }
}
exports.deletePositionById = async (req, res, next) => {
    try {
        const {positionId} = req.params;
        await positionService.deletePositionById(positionId)
        res.status(200).json({
            message: "success",
        })
    } catch (e) {
        next(new Error("position.controller.deletePositionById.error :" + e.message))
    }
}
exports.addPosition = async (req, res, next) => {
    try {
        const data =await  positionService.addPosition(req.body);
        if (data == [] || !data) throw new Error("no data found");

        res.status(200).json({
            message: "success",
            data: data
        })
    } catch (e) {
        next(new Error("position.controller.addPosition.error :" + e.message))
    }
}