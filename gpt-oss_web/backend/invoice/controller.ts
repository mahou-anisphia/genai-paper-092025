import { Request, Response } from "express";
import { InvoiceService } from "./service";

const service = new InvoiceService();

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await service.getAll();
    res.json(invoices);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const invoice = await service.getById(id);
    if (!invoice) return res.status(404).json({ error: "Not found" });
    res.json(invoice);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const newInvoice = await service.create(req.body);
    res.status(201).json(newInvoice);
  } catch (e) {
    res.status(400).json({ error: "Invalid data" });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await service.update(id, req.body);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: "Invalid data" });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await service.delete(id);
    res.json(deleted);
  } catch (e) {
    res.status(400).json({ error: "Invalid id" });
  }
};