import { Request, Response, NextFunction } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  console.error("Error:", error);

  res.status(500).json({
    success: false,
    error: error.message || "Internal server error",
  });
};

export const validateRequest = (validationFn: (data: any) => string[]) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const errors = validationFn(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }

    next();
  };
};