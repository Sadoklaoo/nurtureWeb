import { Router, Request, Response } from "express";
import auth from "./auth";
import products from "./products";
import ingredients from "./ingredients";
import allergy from "./allergy";
import category from "./category";
import history from "./history";
import notifications from "./notifications";
import skin from "./skin";
import users from "./user";



const routes = Router();

routes.use("/allergy", allergy);
routes.use("/auth", auth);
routes.use("/category", category);
routes.use("/history", history);
routes.use("/ingredients", ingredients);
routes.use("/notifications", notifications);
routes.use("/products", products);
routes.use("/skin", skin);
routes.use("/users", users);






export default routes;