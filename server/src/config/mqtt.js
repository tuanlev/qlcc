const config = {
  mqtt: {
    url: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
    topic: process.env.MQTT_TOPIC || '#',
    keepalive: 3600 // 1 hour in seconds
  },
  server: {
    port: process.env.MQTT_PORT || 8883
  }
}; 