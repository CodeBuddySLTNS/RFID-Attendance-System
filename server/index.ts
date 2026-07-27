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

import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.set("io", io);

// track clients in register mode (add student page open)
let registerModeClients = 0;
app.set("registerMode", () => registerModeClients > 0);

io.on("connection", (socket) => {
  console.log("socket client connected:", socket.id);

  socket.on("enter_register_mode", () => {
    registerModeClients++;
    console.log("register mode on, clients:", registerModeClients);
  });

  socket.on("exit_register_mode", () => {
    registerModeClients = Math.max(0, registerModeClients - 1);
    console.log("register mode off, clients:", registerModeClients);
  });

  socket.on("disconnect", () => {
    // safety: if client disconnects without exiting, handled by the page emitting exit on unmount
  });
});

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

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
