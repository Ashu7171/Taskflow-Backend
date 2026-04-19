// controllers/employeeProfileController.js
const Employee = require("../models/Employee");

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      designation,
      department,
      employeeId,
      dateOfJoining,
      employmentType,
      phone,
      address,
    } = req.body;

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    if (employeeId) {
      const existingId = await Employee.findOne({ employeeId });
      if (existingId) {
        return res
          .status(400)
          .json({ success: false, message: "Employee ID already in use" });
      }
    }

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      designation,
      department,
      employeeId,
      dateOfJoining,
      employmentType,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: `${employee.firstName} ${employee.lastName} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  deleteEmployee,
};