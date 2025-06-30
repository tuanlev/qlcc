const { CustomError } = require("../../error/customError");
const { departmentDTO } = require("../dtos/department.dto");
const { positionDTO, positionDTOQueryToPosition } = require("../dtos/position.dto");
const Position = require("../models/position.model");

exports.getPositions = async ({ departmentId, keyword, }) => {
    try {
        let query = {};
        if (departmentId) {
            query.department = departmentId;
        }
        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } }
            ];
        }
        return (await Position.find(query).populate("department")).map(r => positionDTO(r));
    } catch (e) { 
        throw new Error("getPosition.error: "+ e.message);d
    }
}
exports.addPosition = async (position) => {
     try {
       let positon = positionDTOQueryToPosition(position);
       let positionLastest =await (new Position(positon)).save();
       let result =  positionDTO(await Position.findById(positionLastest._id).populate("department"));
       return result;
    } catch (e) { 
        throw new Error("addPosition.error: "+ e.message);d
    }
}
exports.deletePositionById = async (positionId) => {
    try {
       if (!await Position.findByIdAndDelete(positionId)) throw new CustomError("Position not found or delete failed",404);
       return;
    } catch (e) { 
        if (e instanceof CustomError) {
            throw e; // Re-throw custom errors
        }
        throw new Error("deletePositionById.error: "+ e.message);d
    }
}
exports.getPositionById =async (positionId) => {
    try {
       return positionDTO(await Position.findById(positionId).populate("department"));
    } catch (e) { 
        throw new Error("getPositionById.error: "+ e.message);d
    }
}
exports.updatePositionById = async (positionId,position) => {
    try {
       position = positionDTOQueryToPosition(position);
       return positionDTO(await Position.findByIdAndUpdate(positionId,position,{new:true}).populate("department"));

    } catch (e) { 
        throw new Error("updatePositionById.error: "+ e.message);d
    }
}
