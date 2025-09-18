import { Request, Response } from "express";
import { CustomerService } from "./service";

const service = new CustomerService();

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await service.getAll();
    res.json(customers);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const customer = await service.getById(id);
    if (!customer) return res.status(404).json({ error: "Not found" });
    res.json(customer);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const newCustomer = await service.create(req.body);
    res.status(201).json(newCustomer);
  } catch (e) {
    res.status(400).json({ error: "Invalid data" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await service.update(id, req.body);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: "Invalid data" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await service.delete(id);
    res.json(deleted);
  } catch (e) {
    res.status(400).json({ error: "Invalid id" });
  }
};