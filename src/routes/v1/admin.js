const express = require("express");
const { AdminController } = require("../../app/admin");
const { auth } = require("../../middlewares/adminAuth/authMiddleware");

const router = express.Router();

router.post("/create", auth, AdminController.addAnAdmin);
router.patch("/update/:id", auth, AdminController.updatePermissionsForAdminById);
router.get("/all", AdminController.fetchAllAdmins);
router.get("/account/:id", AdminController.fetchAdminById);
router.post("/add/permission", auth, AdminController.addUserPermission);
router.get("/users/all", auth, AdminController.fetchAllUser);

module.exports = {
  baseUrl: "/admin",
  router,
};