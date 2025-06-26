const Checkin = require("../models/checkin.model");
const { addEmployee } = require("./employee.repository");

exports.addCheckin = async (checkinData) => {
    try {
        const checkin = new Checkin(checkinData);
        const dataB = await checkin.save();
        const datac = await Checkin.findById(dataB._id)
          .populate({
            path: "employee",
            populate: [
              { path: "department" },
              { path: "position" },
              { path: "shift" }
            ]
          });
    } catch(e) {
        throw new Error("checkin.repository.error :"+e.message);
    }
}