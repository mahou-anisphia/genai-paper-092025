import { Request, Response } from "express";
import { CustomerService } from "./CustomerService";
import { ApiResponse } from "../shared/middleware";

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  createCustomer = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const customer = await this.customerService.createCustomer(req.body);
      res.status(201).json({
        success: true,
        data: customer,
        message: "Customer created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getAllCustomers = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const customers = await this.customerService.getAllCustomers();
      res.json({
        success: true,
        data: customers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getCustomerById = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.getCustomerById(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: "Customer not found",
        });
      }

      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  updateCustomer = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.updateCustomer(id, req.body);

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: "Customer not found",
        });
      }

      res.json({
        success: true,
        data: customer,
        message: "Customer updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  deleteCustomer = async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const deleted = await this.customerService.deleteCustomer(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Customer not found",
        });
      }

      res.json({
        success: true,
        message: "Customer deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}