import status from "http-status";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const secretKey = process.env.SYSTEM_SECRET_KEY!;
    const whiteList = [
      "/api/attendances",
      "/api/attendances/add",
      "/api/auth/login",
      "/api/auth/signup",
      "/api/auth/refresh",
    ];

    if (
      whiteList.includes(req.path) ||
      (!whiteList.includes(req.path) && !req.path.includes("/api"))
    ) {
      return next();
    }

    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];

      if (token) {
        jwt.verify(token, secretKey, (err, verifiedToken) => {
          if (err) {
            return res
              .status(status.UNAUTHORIZED)
              .json({ message: "Access Denied!" });
          }
          res.locals.facultyId = (verifiedToken as jwt.JwtPayload).facultyId;
          next();
        });
      } else {
        return res.status(status.UNAUTHORIZED).json({ message: "Access Denied!" });
      }
    } else {
      return res.status(status.UNAUTHORIZED).json({ message: "Access Denied!" });
    }
  } catch (e) {
    throw new Error(String(e));
  }
};

export default authenticate;
