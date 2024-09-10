const express = require("express");
const { AuthController } = require("../../app/admin");
const { auth, unAuth } = require("../../middlewares/adminAuth/authMiddleware");

const router = express.Router();

// router.post("/signup", AuthController.signUp);
router.post("/signin", AuthController.signin);
router.post("/verify/phone-number", AuthController.verifyPhoneNumber);
router.post("/verify/otp", AuthController.verifyOTP);
router.get("/google", AuthController.googleAuth);
router.get("/callback", AuthController.googleRedirect);
router.get("/authenticator/generate", auth, AuthController.generateAuthenticator);
router.post("/authenticator/validate", auth, AuthController.validateOtp);
router.get("/logout", auth, unAuth, AuthController.logout);

module.exports = {
  baseUrl: "/auth",
  router,
};
  