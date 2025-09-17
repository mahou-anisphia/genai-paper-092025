import { Request, Response } from "express";
import { ProductService } from "./ProductService";
import { ApiResponse } from "../shared/middleware";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        data: product,
        message: "Product created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getAllProducts = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getProductById = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  updateProduct = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const product = await this.productService.updateProduct(id, req.body);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      res.json({
        success: true,
        data: product,
        message: "Product updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  deleteProduct = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const deleted = await this.productService.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}