import express from "express";
import customerController from "./customer.controller";

const router = express.Router();

router.use("/customers", customerController);

export default router;