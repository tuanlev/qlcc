const { shiftRecordDTO } = require("../dtos/shiftRecord.dto");
const Checkin = require("../models/checkin.model");
const Department = require("../models/department.model");
const Employee = require("../models/employee.model");
const Shift = require("../models/shift.model");
const ShiftRecord = require("../models/shiftrecord.model");
const { dateCompare, shiftHoursToDates } = require("../utils/dateHandle");
const { getDepartments } = require("./department.service");


exports.addShiftRecord = async (newCheckin) => {
  try {
    const now = new Date();

const y = now.getFullYear();
const m = now.getMonth(); // 0-11
const d = now.getDate();

const start = new Date(y, m, d, 0, 0, 0, 0);
const end   = new Date(y, m, d, 23, 59, 59, 999);

console.log(start.toISOString()); // 00:00 UTC
console.log(end.toISOString());   // 23:59 UTC

    let shiftRecordExist = await ShiftRecord.findOne({
      employee: (newCheckin.employee?.employeeId) ? newCheckin.employee.employeeId : null,
      createdAt: {
        $gte: start,
        $lt: end
      }
    }).populate({
      path: "employee",
      populate: {
        path: "shift",
      }
    }).populate("shift");
    if (!shiftRecordExist) {
      const checkinRecordSave = new ShiftRecord();
      if (!newCheckin.employee) throw new Error("addShiftRecord: employee not found");
      checkinRecordSave.employee = (newCheckin.employee?.employeeId) ? newCheckin.employee.employeeId : null;
      checkinRecordSave.checkIn = newCheckin.checkinId;
      checkinRecordSave.shift = (newCheckin.employee?.shift?.shiftId) ? newCheckin.employee?.shift.shiftId : null;
      if (checkinRecordSave.shift) {
        const { checkInDate } = shiftHoursToDates(checkinRecordSave.newCheckin.employee?.shift, newCheckin.timestamp)
        checkinRecordSave.checkInStatus = (newCheckin.timestamp.getTime() <= checkInDate.getTime()) ? "on-time" : "late";
      }
      else
        checkinRecordSave.checkInStatus = "Unassigned";
      console.log(await checkinRecordSave.save())
    }
    else {
      // Nếu đã có bản ghi, cập nhật checkin
      let checkinRecordSave = {};
      checkinRecordSave.checkOut = newCheckin.checkinId;
      if (shiftRecordExist.shift) {
        const { checkOutDate } = shiftHoursToDates(shiftRecordExist.shift, newCheckin.timestamp)

        checkinRecordSave.checkOutStatus = (newCheckin.timestamp.getTime() >= checkOutDate.getTime()) ? "on-time" : "erly-leave";
      }
      else
        checkinRecordSave.checkOutStatus = "Unassigned";
      console.log(await ShiftRecord.findByIdAndUpdate(shiftRecordExist._id, checkinRecordSave, { new: true }));

    }


  } catch (e) {
    throw new Error("shiftrecord.service.error: " + e.message)
  }
}



exports.getShiftRecordsWithFilters = async ({ day, month, year, deviceId }) => {
  if (!deviceId) return {};



  try {

 const now = new Date();

  let y, m, d;
  let start, end;

  if (year && month && day) {
    // Có đủ 3: tìm trong ngày
    y = year;
    m = month-1; // month: 1-12
    start = new Date(y, m , day, 0, 0, 0, 0);
    end   = new Date(y, m , day, 23, 59, 59, 999);
  } else if (year && month) {
    // Có year + month: tìm trong tháng
    y = year;
    m = month-1;
    start = new Date(y, m , 1, 0, 0, 0, 0);
    const lastDay = new Date(y, m, 0).getDate();
    end = new Date(y, m, lastDay, 23, 59, 59, 999);
  } else if (year) {
    // Chỉ có year: tìm trong năm
    y = year;
    start = new Date(y, 0, 1, 0, 0, 0, 0);
    end   = new Date(y, 11, 31, 23, 59, 59, 999);
  } else {
    // Không có year: tìm trong hôm nay (UTC)
    y = now.getFullYear();
    m = now.getMonth();
    d = now.getDate();
    start = new Date(y, m, d, 0, 0, 0, 0);
    end   = new Date(y, m, d, 23, 59, 59, 999);
  }
    const employees = await Employee.find({ device: deviceId }).select('_id');
    const shiftRecords = await ShiftRecord.find({
      employee: { $in: employees.map(e => e._id) },
      createdAt: { $gte: start, $lt: end }
    })
      .populate({
        path: "employee",
        populate: ["shift", "department", "device", {
          path: "position",
          populate: ["department"]
        }]
      }).populate("shift").populate("checkIn")
      .populate("checkOut").sort({ createdAt: -1 });

    const dataReturn = shiftRecords.map(r => shiftRecordDTO(r));
    return dataReturn;


  }
  catch (e) {
    throw new Error("getShiftRecordsWithFiltersByDay.error: " + e.message);
  }
}
