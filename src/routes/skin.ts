import { Router } from "express";
import SkinController from "../controller/SkinController";
import { Skin } from "../entities/Skin";

import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();
//insert skin
router.post(
  "/addOrEdit",
  [checkJwt, checkRole(["CLIENT"])],
  SkinController.addOrEdit
);

//delete skin
router.delete(
  "/delete/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN", "CLIENT"])],
  SkinController.delete
);

//get skin
router.get("/get", [checkJwt, checkRole(["CLIENT"])], SkinController.get);

//get all skins
router.get("/getAll", [checkJwt, checkRole(["ADMIN"])], SkinController.getAll);

export default router;
