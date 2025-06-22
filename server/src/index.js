require("dotenv").config()
const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
// khởi tạo socket
require("./config/socket").initialize(server);
require("./config/db")();
require("./config/mqtt").connect(server);
app.use(express.json())
app.use(cors())
app.use(async (req, res) => {
    try {
        const { date, departmentId, keyword, deviceId } = req.query;

        const result = await getShiftRecordsWithFilters({
            date,
            departmentId,
            keyword,
            deviceId,
        });

        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error('Lỗi khi lấy shift records:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi truy vấn dữ liệu chấm công.',
            error: error.message
        });
    }
}
)
server.listen(process.env.PORT || 3000, () => {
    console.log("server run on port: " + process.env.PORT || 3000)
})
