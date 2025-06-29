const shiftRecordService = require("../service/shiftrecord.service");
exports. getShiftRecords = async (req, res, next) => {
  if (req.authRole !== "admin") {
    res.status(401).json({
      message: "Unauthorized: You do not have permission to access this resource"
    });
    return;
  }
  try {
    const shiftRecords = await shiftRecordService.getShiftRecordsWithFilters({...req.query,deviceId:req.grantedAuthority});
    res.status(200).json({
      data: shiftRecords,
      message: "success"
    });
  } catch (e) {
    next(e);
  }
}