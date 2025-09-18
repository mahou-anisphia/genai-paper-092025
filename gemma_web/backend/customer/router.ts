import express from "express";
import customerController from "./controller";

const router = express.Router();

router.use("/", customerController);

export default router;