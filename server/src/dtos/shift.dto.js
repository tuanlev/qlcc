exports.shiftDTO  =  ({_id,name,checkInHour,checkOutHour}) => {
    return {
        shiftId:_id,
        name,
        checkInHour,
        checkOutHour
    }
}