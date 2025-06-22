const mqtt = require('mqtt');
const { parse } = require('date-fns');
const {handleMessage} = require("../service/mqtt.service")
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
function handleError(error) {
    console.error('MQTT Client Error:', error);
}

function disconnect() {
    if (client) {
        client.end();
    }
}


module.exports = {connect}