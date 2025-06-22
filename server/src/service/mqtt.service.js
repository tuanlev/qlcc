const { getIo } = require("../config/socket");
const { addCheckin } = require("../repository/checkin.repository");

const { editEmployee, deleteEmployeeById, addEmployee } = require("../repository/employee.repository");
const { addDevice } = require("./device.service");
const { addShiftRecord } = require("./shiftrecord.service");
async function handleMessage(topic, message) {
    try {
        const messageString = message.toString();
        let eventData = JSON.parse(messageString);
        const { cmd } = eventData;
        addDevice(cmd.deviceId);
        if (!cmd) {
            console.error('Missing cmd in message:', eventData);
            return;
        }
        if (cmd === 'log') {
            const processedData = {

                device: eventData.deviceId,
                employee: eventData.employeeId,
                timestamp: new Date(eventData.timestamp),
                faceBase64: "data:image/jpeg;base64," + eventData.faceBase64,

            };
            const result = await addCheckin(processedData);
            console.log("mqtt.service.handleMessage.log.success")

            await addShiftRecord(result);
            return;
        }

        if (cmd === 'add_employee') {
            // Thêm hoặc cập nhật nhân viên
            const registrationData = {
                _id: eventData.employeeId,
                fullName: eventData.employeeName,
                device: eventData.deviceId,
                faceEmbedding: eventData.faceEmbedding,
                faceBase64: "data:image/jpeg;base64," + eventData.faceBase64,
                registrationDate: new Date(eventData.timestamp ? eventData.timestamp : Date.now),
            };
            // Kiểm tra nếu đã tồn tại thì cập nhật, chưa có thì thêm mới
            await addEmployee(registrationData);
            console.log("mqtt.service.handleMessage.addEmployee.success")
            return;
        }

        if (cmd === 'delete_employee') {
            // Xóa nhân viên
            await deleteEmployeeById(eventData.employeeId);

            console.log("mqtt.service.handleMessage.deleteEmployee.success")
            return;
        }
        if (cmd == 'edit_employee') {
            let editData = {
                _id: eventData.employeeId,
                fullName: eventData.employeeName,
                device: eventData.deviceId,
            };
            if (eventData.faceBase64) {
                editData.faceBase64 = "data:image/jpeg;base64, " + eventData.faceBase64;
            }
            if (eventData.faceEmbedding) {
                editData.faceEmbedding = eventData.faceEmbedding;
            }
            editEmployee(editData);
            console.log("mqtt.service.handleMessage.editEmployee.success")
            return;
        }
        console.error('Unknown cmd:', cmd);
    } catch (e) {
        console.error('mqtt.service.handleMessage.error', e.message);

    } finally {
        return;
    }
}

module.exports = { handleMessage }