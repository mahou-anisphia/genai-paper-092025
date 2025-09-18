import { Request, Response } from "express";
import { PaymentService } from "./service";

const service = new PaymentService();

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await service.getAll();
    res.json(payments);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payment = await service.getById(id);
    if (!payment) return res.status(404).json({ error: "Not found" });
    res.json(payment);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch payment" });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const newPayment = await service.create(req.body);
    res.status(201).json(newPayment);
  } catch (e) {
    res.status(400).json({ error: "Invalid data" });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await service.update(id, req.body);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: "Invalid data" });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await service.delete(id);
    res.json(deleted);
  } catch (e) {
    res.status(400).json({ error: "Invalid id" });
  }
};