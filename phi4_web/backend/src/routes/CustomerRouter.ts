import express from "express";
import CustomerController from "../controllers/CustomerController";

const router = express.Router();
router.use("/customers", CustomerController);

export default router;