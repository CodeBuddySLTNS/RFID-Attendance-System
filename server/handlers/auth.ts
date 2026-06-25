import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { generateToken, CustomError } from "../lib/utils.js";
import status from "http-status";

const signup = async (req: Request, res: Response) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    throw new CustomError("Missing required fields", status.BAD_REQUEST);
  }

  const existingFaculty = await prisma.faculty.findUnique({
    where: { username },
  });

  if (existingFaculty) {
    throw new CustomError("Username already exists!", status.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const faculty = await prisma.faculty.create({
    data: {
      name,
      username,
      password: hashedPassword,
    },
  });

  const accessToken = generateToken(
    { facultyId: faculty.id, username: faculty.username },
    15 * 60,
  );
  const refreshToken = generateToken(
    { facultyId: faculty.id, username: faculty.username },
    7 * 24 * 60 * 60,
  );

  res.status(status.CREATED).json({
    message: "Faculty registered successfully",
    token: accessToken,
    refreshToken,
    faculty: {
      id: faculty.id,
      name: faculty.name,
      username: faculty.username,
    },
  });
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomError("Missing required fields", status.BAD_REQUEST);
  }

  const faculty = await prisma.faculty.findUnique({
    where: { username },
  });

  if (!faculty) {
    throw new CustomError("Invalid credentials", status.UNAUTHORIZED);
  }

  const isPasswordValid = await bcrypt.compare(password, faculty.password);

  if (!isPasswordValid) {
    throw new CustomError("Invalid credentials", status.UNAUTHORIZED);
  }

  const accessToken = generateToken(
    { facultyId: faculty.id, username: faculty.username },
    15 * 60,
  );
  const refreshToken = generateToken(
    { facultyId: faculty.id, username: faculty.username },
    7 * 24 * 60 * 60,
  );

  res.json({
    message: "Login successful",
    token: accessToken,
    refreshToken,
    faculty: {
      id: faculty.id,
      name: faculty.name,
      username: faculty.username,
    },
  });
};

const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new CustomError("Missing refresh token", status.BAD_REQUEST);
  }

  const secretKey = process.env.SYSTEM_SECRET_KEY!;

  try {
    const verified = jwt.verify(refreshToken, secretKey) as jwt.JwtPayload;

    const faculty = await prisma.faculty.findUnique({
      where: { id: verified.facultyId },
    });

    if (!faculty) {
      throw new CustomError("Invalid token owner", status.UNAUTHORIZED);
    }

    const newAccessToken = generateToken(
      { facultyId: faculty.id, username: faculty.username },
      1 * 60,
    );

    res.json({
      token: newAccessToken,
    });
  } catch (err) {
    throw new CustomError("Invalid refresh token", status.UNAUTHORIZED);
  }
};

export default { signup, login, refresh };
