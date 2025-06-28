const checkinService = require("../service/checkin.service");

exports. getCheckins = async (req, res, next) => {
    if (req.authRole !== "admin") {
        res.status(404).json({
            message: "Unauthorized: You do not have permission to access this resource"
        });
        return;
    }
    const deviceId = (req.grantedAuthority) ? req.grantedAuthority : null;
    try {
        const checkins = await checkinService.getCheckins( deviceId );
        res.status(200).json({
            message: "success",
            data: checkins
        });
    } catch (e) {
        next(new Error("getCheckins.error: " + e.message));
    }
}