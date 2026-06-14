import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const tryCatch =
  (handler: (req: Request, res: Response) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };

export const generateToken = (
  payload: object,
  expiration?: number
): string => {
  const defaultExpiration = 12 * 60 * 60;
  const secretKey = process.env.SYSTEM_SECRET_KEY!;
  return jsonwebtoken.sign(payload, secretKey, {
    expiresIn: expiration || defaultExpiration,
  });
};

export class CustomError extends Error {
  statusCode: number;
  body: unknown;

  constructor(message: string, statusCode: number, body?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.body = body || null;
  }
}
