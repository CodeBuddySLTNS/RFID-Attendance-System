import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";

import errorHandler from "./middlewares/error-handler.js";
import departmentRoutes from "./routes/departments.js";
import studentRoutes from "./routes/students.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
