import status from "http-status";
import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
  errorCode?: string;
  body?: unknown;
}

const errorHandler = (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
  res.status(error.statusCode || status.INTERNAL_SERVER_ERROR).json({
    status: error.statusCode || status.INTERNAL_SERVER_ERROR,
    errorCode: error.errorCode,
    body: error.body,
    message: error.statusCode ? error.message : "Internal Server Error.",
  });
  console.log(error);
};

export default errorHandler;
