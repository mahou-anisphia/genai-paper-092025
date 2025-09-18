import express from "express";
import { CustomerService } from "../modules/Customer";

const router = express.Router();
const customerService = new CustomerService();

router.get("/", async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Additional routes for CRUD operations

export default router;