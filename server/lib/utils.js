import jsonwebtoken from "jsonwebtoken";

export const tryCatch = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

export const generateToken = (payload, expiration) => {
  const defaultExpiration = 12 * 60 * 60;
  const secretKey = process.env.SYSTEM_SECRET_KEY;
  return jsonwebtoken.sign(payload, secretKey, {
    expiresIn: expiration || defaultExpiration,
  });
};

export class CustomError extends Error {
  constructor(message, statusCode, body) {
    super(message);
    this.statusCode = statusCode;
    this.body = body || null;
  }
}
