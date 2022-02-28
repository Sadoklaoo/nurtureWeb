import { Router } from "express";
import HistoryController from "../controller/HistoryController";

import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();
//insert history
router.post("/add",[checkJwt, checkRole(["CLIENT"])], HistoryController.add );

//delete history
router.delete("/delete/:id([0-9]+)",[checkJwt, checkRole(["CLIENT"])] , HistoryController.delete );

//get all historys
router.get("/getAll",[checkJwt, checkRole(["CLIENT"])],HistoryController.getAll );




export default router;