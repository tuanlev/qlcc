const Checkin = require("../models/checkin.model");
const Department = require("../models/department.model");
const Employee = require("../models/employee.model");
const Shift = require("../models/Shift.model");
const ShiftRecord = require("../models/shiftrecord.model");
const { dateCompare, shiftHoursToDates } = require("../utils/dateHandle");
const { getDepartments } = require("./department.service");


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


/**
 * Tìm kiếm ShiftRecords với các bộ lọc tùy chọn
 * @param {Object} filters
 * @param {String} [filters.date] - định dạng YYYY-MM-DD
 * @param {String} [filters.departmentId]
 * @param {String} [filters.keyword] - tìm theo employeeId hoặc fullName
 * @param {String} [filters.deviceId]
 */
exports.getShiftRecordsWithFilters = async ({ date, departmentId, keyword, deviceId }) =>{
  const matchConditions = [];

  // Tạo range ngày nếu có
  if (date) {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    matchConditions.push({ createdAt: { $gte: start, $lte: end } });
  }

  const pipeline = [
    ...(matchConditions.length ? [{ $match: { $and: matchConditions } }] : []),

    // Join employee
    {
      $lookup: {
        from: 'employees',
        localField: 'employee',
        foreignField: '_id',
        as: 'employee'
      }
    },
    { $unwind: '$employee' },

    // Join department
    {
      $lookup: {
        from: 'departments',
        localField: 'employee.department',
        foreignField: '_id',
        as: 'employee.department'
      }
    },
    { $unwind: { path: '$employee.department', preserveNullAndEmptyArrays: true } },

    // Join checkIn
    {
      $lookup: {
        from: 'checkins',
        localField: 'checkIn',
        foreignField: '_id',
        as: 'checkIn'
      }
    },
    { $unwind: { path: '$checkIn', preserveNullAndEmptyArrays: true } },

    // Join checkOut
    {
      $lookup: {
        from: 'checkins',
        localField: 'checkOut',
        foreignField: '_id',
        as: 'checkOut'
      }
    },
    { $unwind: { path: '$checkOut', preserveNullAndEmptyArrays: true } },

    // Match theo employee.device, department, keyword
    {
      $match: {
        ...(departmentId && {
          'employee.department._id': new mongoose.Types.ObjectId(departmentId)
        }),
        ...(deviceId && {
          'employee.device': deviceId
        }),
        ...(keyword && {
          $or: [
            { 'employee._id': { $regex: keyword, $options: 'i' } },
            { 'employee.fullName': { $regex: keyword, $options: 'i' } }
          ]
        })
      }
    },

    // Project kết quả
    {
      $project: {
        employeeId: '$employee._id',
        employeeName: '$employee.fullName',
        departmentName: '$employee.department.name',
        deviceId: '$employee.device',
        checkInTime: '$checkIn.timestamp',
        checkOutTime: '$checkOut.timestamp',
        checkInStatus: 1,
        checkOutStatus: 1,
        createdAt: 1
      }
    }
  ];

  return await ShiftRecord.aggregate(pipeline);
}
