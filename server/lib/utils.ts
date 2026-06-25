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

export const generateToken = (payload: object, expiration?: number): string => {
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

export const sendSMS = async (options: {
  toNumber: string;
  messageBody: string;
  senderName?: string;
  fromNumber?: string;
}) => {
  const url = process.env.SMS_API_URL!;
  const apiKey = process.env.SMS_API_KEY!;
  const senderName = options.senderName || process.env.SMS_SENDER_NAME!;
  const fromNumber = options.fromNumber || process.env.SMS_FROM_NUMBER!;

  // send post request to the sms gateway
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      SenderName: senderName,
      ToNumber: options.toNumber,
      MessageBody: options.messageBody,
      FromNumber: fromNumber,
    }),
  });

  if (!response.ok) {
    throw new Error(`sms request failed with status ${response.status}`);
  }

  return response.json();
};
