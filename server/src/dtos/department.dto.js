exports.departmentDTO  =  ({_id,name}) => {
    return {
        departmentId:_id,
        nameDepartment:name,
    }
}
exports.departmentDTOtoDepartment = ({departmentId,nameDepartment}) =>{
    return {
        _id:departmentId,
        name:nameDepartment,
    }
}