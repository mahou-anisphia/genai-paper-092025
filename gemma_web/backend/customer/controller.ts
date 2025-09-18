import express, { Request, Response } from "express";
import { getAllCustomers } from "./service";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const customers = await getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

export default router;