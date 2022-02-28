import { Router } from "express";
import AllergyController from "../controller/AllergyController";

import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();
//insert allergie
router.post("/add",[checkJwt, checkRole(["CLIENT"])], AllergyController.add );

//insert allergie
router.post("/addAdmin",[checkJwt, checkRole(["ADMIN"])], AllergyController.addAdmin );

//delete allergie
router.delete("/delete",[checkJwt, checkRole(["CLIENT"])], AllergyController.delete  );

//edit allergie
router.post("/edit",[checkJwt, checkRole(["ADMIN"])] , AllergyController.editAdmin );

//get my allergies
router.post("/getMyAllergies",[checkJwt, checkRole(["CLIENT"])], AllergyController.getMyAllergies);

//get all allergie
router.get("/getAll",[checkJwt, checkRole(["ADMIN"])],AllergyController.getAll );




export default router;