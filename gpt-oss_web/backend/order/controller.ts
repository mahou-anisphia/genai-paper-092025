import { Request, Response } from "express";
import { OrderService } from "./service";
import { Prisma } from "@prisma/client";

const service = new OrderService();

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await service.getAll();
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const order = await service.getById(id);
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = await service.create(req.body);
    res.status(201).json(newOrder);
  } catch (e) {
    res.status(400).json({ error: "Invalid data" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await service.update(id, req.body);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: "Invalid data" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await service.delete(id);
    res.json(deleted);
  } catch (e) {
    res.status(400).json({ error: "Invalid id" });
  }
};