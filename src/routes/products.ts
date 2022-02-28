import { Router } from "express";

import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();
//insert product
router.post("/add",[checkJwt, checkRole(["ADMIN"])] );

//delete product
router.delete("/delete/:id([0-9]+)",[checkJwt, checkRole(["ADMIN"])]);

//delete product
router.post("/edit",[checkJwt, checkRole(["ADMIN"])] );

//get product
router.get("/get",[checkJwt, checkRole(["ADMIN","CLIENT"])]);


//get all products
router.get("/getAll",[checkJwt, checkRole(["ADMIN","CLIENT"])] );




export default router;