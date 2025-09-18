import { Request, Response } from "express";
import { ProductService } from "./service";

const service = new ProductService();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await service.getAll();
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const product = await service.getById(id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = await service.create(req.body);
    res.status(201).json(newProduct);
  } catch (e) {
    res.status(400).json({ error: "Invalid data" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await service.update(id, req.body);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: "Invalid data" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await service.delete(id);
    res.json(deleted);
  } catch (e) {
    res.status(400).json({ error: "Invalid id" });
  }
};