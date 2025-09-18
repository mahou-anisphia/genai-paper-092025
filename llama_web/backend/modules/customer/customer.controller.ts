import express, { Request, Response } from "express";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "./customer.service";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const customers = await getCustomers();
  res.json(customers);
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const customer = await getCustomer(id);
  res.json(customer);
});

router.post("/", async (req: Request, res: Response) => {
  const data = req.body;
  const customer = await createCustomer(data);
  res.json(customer);
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const customer = await updateCustomer(id, data);
  res.json(customer);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  await deleteCustomer(id);
  res.json({ message: "Customer deleted successfully" });
});

export default router;