const Checkin = require("../models/checkin.model");
const Employee = require("../models/employee.model");
const Shift = require("../models/Shift.model");
const ShiftRecord = require("../models/shiftrecord.model");
const { dateCompare, shiftHoursToDates } = require("../utils/dateHandle");


exports.addShiftRecord = async (newCheckin) => {
    try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);
        let checkinExist = await ShiftRecord.findOne({
            employee: newCheckin.employee,
            createdAt: {
                $gte: start,
                $lt: end
            }
        }).populate({
            path: "employee",
            populate: {
                path: "shift",
            }
        })
        console.log(checkinExist)
        if (!checkinExist) {
            const employee = await Employee.findById(newCheckin.employee).populate({
                path: "shift"
            });
            if (!employee || !employee.shift) throw new Error("Employee doesn't have shift or employee doesnt exist");
            const newShiftRecord = {};
            newShiftRecord.employee = newCheckin.employee;
            const { checkInDate, checkOutDate } = shiftHoursToDates(employee.shift, newCheckin.timestamp)

            if (dateCompare(checkInDate, newCheckin.timestamp)) {
                newShiftRecord.checkIn = newCheckin._id;
                newShiftRecord.checkInStatus = (newCheckin.timestamp.getTime() <= checkInDate.getTime()) ? "on-time" : "late";
            }
            else if (dateCompare(checkOutDate, newCheckin.timestamp)) {
                newShiftRecord.checkOut = newCheckin._id;
                newShiftRecord.checkOutStatus = (newCheckin.timestamp.getTime() <= checkInDate.getTime()) ? "early-leave" : "on-time";

            }
            else throw new Error("addShiftRecord");
            const newIntance = new ShiftRecord(newShiftRecord);
            return await newIntance.save();
        }
        else {
            const employee = await Employee.findById(newCheckin.employee).populate({
                path: "shift"
            });
            if (!employee || !employee.shift) throw new Error("Employee doesn't have shift or employee doesnt exist");
            const { checkInDate, checkOutDate } = shiftHoursToDates(employee.shift, newCheckin.timestamp)

            if (dateCompare(checkInDate, newCheckin.timestamp) && checkinExist.checkIn) throw new Error("addShiftRecord check both 1");
            if (dateCompare(checkOutDate, newCheckin.timestamp) && checkinExist.checkOut) throw new Error("addShiftRecord check both 2");
            if (dateCompare(checkInDate, newCheckin.timestamp)) {
                checkinExist.checkIn = newCheckin._id;
                checkinExist.checkInStatus = (newCheckin.timestamp.getTime() <= checkInDate.getTime()) ? "on-time" : "late";
            }
            else if (dateCompare(checkOutDate, newCheckin.timestamp)) {
                checkinExist.checkOut = newCheckin._id;
                checkinExist.checkInStatus = (newCheckin.timestamp.getTime() <= checkInDate.getTime()) ? "early-leave" : "on-time";

            } else throw new Error("addShiftRecord when exist");
            return await checkinExist.save();
        }


    } catch (e) {
        throw new Error("shiftrecord.service.error: " + e.message)
    }
}



