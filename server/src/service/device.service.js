const Device = require("../models/device.model")

exports.addDevice = async (id) => {
    try {
     const device = new Device({_id:id});
        await device.save();
    } catch(e) {
        console.log("device.service.adddevice.error:" +e.message)
    }
    
}
