import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";

import errorHandler from "./middlewares/error-handler.js";
import authenticate from "./middlewares/authenticate.js";
import authRoutes from "./routes/auth.js";
import departmentRoutes from "./routes/departments.js";
import studentRoutes from "./routes/students.js";
import attendanceRoutes from "./routes/attendances.js";
import announcementRoutes from "./routes/announcements.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "..", "client", "dist")));
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(authenticate);

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api/announcements", announcementRoutes);

// for production frontend build
// build client first
app.get("/*index", (req, res) => {
  res.sendFile(path.join(process.cwd(), "..", "client", "dist", "index.html"));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
