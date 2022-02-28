import { Router } from "express";

import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

// Notification //
//Get all Notification ( FOR ADMIN )
router.get("/all",[checkJwt]);
//get Notifications by client PhoneNumber
router.post("/getByClient",[checkJwt] );
//Delete Notification
router.delete("/delete/:id([0-9]+)",[checkJwt, checkRole(["ADMIN","CLIENT"])]);



export default router;