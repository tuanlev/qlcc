const mqtt = require('mqtt');
const { parse } = require('date-fns');
const { add_employee,delete_employee } = require('./employee.service');
let io;
let client;
const config = {
    mqtt: {
        url: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
        topic: process.env.MQTT_TOPIC || '#',
        keepalive: 3600 // 1 hour in seconds
    },
    server: {
        port: process.env.MQTT_PORT || 8883
    }
}


function connect() {
    const options = {
        keepalive: config.mqtt.keepalive,
        ...(process.env.MQTT_USERNAME && process.env.MQTT_PASSWORD && {
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD
        })
    };

    client = mqtt.connect(config.mqtt.url, options);

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        subscribe();
    });

    client.on('message', (topic, message) => {
        handleMessage(topic, message)
    });
    client.on('error', (error) => handleError(error));
}

function subscribe() {
    client.subscribe(config.mqtt.topic, (err) => {
        if (err) {
            console.error('MQTT subscription error:', err);
        } else {
            console.log('Subscribed to MQTT topic:', config.mqtt.topic);
        }
    });
}

async function handleMessage(topic, message) {
    try {
        const messageString = message.toString();
        let eventData = JSON.parse(messageString);
        const { cmd } = eventData;

        if (!cmd) {
            console.error('Missing cmd in message:', eventData);
            return;
        }
        if (cmd === 'log') {
            const processedData = {
                data: {
                    deviceId: eventData.deviceId,
                    employeeId: eventData.employeeId,
                    employeeName: eventData.employeeName,
                    timestamp: eventData.timestamp,
                    faceBase64: "data:image/jpeg;base64," + eventData.faceBase64,
                }
            };
            console.log("log :" + processedData)
            return;
        }

        if (cmd === 'add_employee') {
            // Thêm hoặc cập nhật nhân viên
            const registrationData = {
                _id: eventData.employeeId,
                fullName: eventData.employeeName,
                deviceId: eventData.deviceId,
                faceEmbedding: eventData.faceEmbedding,
                faceBase64: "data:image/jpeg;base64," + eventData.faceBase64,
                registrationDate: new Date(eventData.timestamp?eventData.timestamp:Date.now),
            };
            // Kiểm tra nếu đã tồn tại thì cập nhật, chưa có thì thêm mới
            await add_employee(registrationData);
            console.log("mqtt.service.handleMessage.add_employee.success")
            return;
        }

        if (cmd === 'delete_employee') {
            // Xóa nhân viên
            await delete_employee(eventData.employeeId);

            console.log("mqtt.service.handleMessage.delete_employee.success")
            return;
        }
        if (cmd == 'edit_employee') {
            let editData = {
                employeeId: eventData.employeeId,
                employeeName: eventData.employeeName,
                deviceId: eventData.deviceId,
                timestamp: eventData.timestamp,
            };
            if (eventData.faceBase64) {
                editData.faceBase64 = "data:image/jpeg;base64, " + eventData.faceBase64;
            }
            if (eventData.faceEmbedding) {
                editData.faceEmbedding = eventData.faceEmbedding;
            }
            console.log("edit_employee :" + editData); 
        }
        console.error('Unknown cmd:', cmd);
    } catch (error) {
        console.error('MQTT Service - Error processing message (parsing or initial processing):', error);
    }
}

function handleError(error) {
    console.error('MQTT Client Error:', error);
}

function disconnect() {
    if (client) {
        client.end();
    }
}


module.exports = {connect}