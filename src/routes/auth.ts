import { Router } from "express";
import AuthController from "../controller/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route for Android&Flutter
router.post("/login", AuthController.login);
//Login route for Angular
router.post("/loginWeb", AuthController.loginWeb);

//New Account Flutter
router.post("/newaccount", AuthController.newAccount);

// Send Verification Code  Flutter
router.post("/sendCode", AuthController.sendRequestCode);

// Resend Verification Code  Flutter
router.post("/resendCode", AuthController.resendRequestCode);

// Check request code for new client 
router.post("/check", AuthController.checkRequestCode);


//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;