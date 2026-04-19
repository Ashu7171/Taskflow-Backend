// routes/employeeProfileRoutes.js
const express = require("express");
const {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  deleteEmployee,
} = require("../controllers/employeeProfileController");

const router = express.Router();

router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.post("/", addEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;