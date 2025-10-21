import status from "http-status";
import jwt from "jsonwebtoken";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const secretKey = process.env.SYSTEM_SECRET_KEY;
    const whiteList = [
      "/api/attendances",
      "/api/attendances/add",
      "/api/auth/login",
      "/api/auth/signup",
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
              .status(status.FORBIDDEN)
              .json({ message: "Access Denied!" });
          }
          res.locals.userId = verifiedToken.userId;
          next();
        });
      } else {
        return res.status(status.FORBIDDEN).json({ message: "Access Denied!" });
      }
    } else {
      return res.status(status.FORBIDDEN).json({ message: "Access Denied!" });
    }
  } catch (e) {
    throw new Error(e);
  }
};

export default authenticate;
