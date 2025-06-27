const employeeController = require('../controller/employee.controller');

const employeeRouter = require('express').Router();
employeeRouter.get('/', employeeController.getEmployees);
employeeRouter.get('/:employeeId', employeeController.getEmployeeById);
// employeeRouter.post('/', employeeController.addEmployee);
// employeeRouter.patch('/:employeeId', employeeController.updateEmployeeById);
// employeeRouter.delete('/:employeeId', employeeController.deleteEmployeeById);
module.exports = employeeRouter;
