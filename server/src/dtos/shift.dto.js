exports.shiftDTO  =  ({_id,name,checkInHour,checkOutHour}) => {
    return {
        shiftId:_id,
        nameShift,
        checkInHour,
        checkOutHour
    }
}
exports.shiftDTOtoShift = ({shiftId,nameShift,checkInHour,checkOutHour}) =>{
    return {
        _id:shiftId,
        name:nameShift,
        checkInHour,
        checkOutHour
    }
}