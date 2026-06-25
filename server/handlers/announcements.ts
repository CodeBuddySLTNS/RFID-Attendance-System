import { Request, Response } from "express";
import { AnnouncementModel } from "../database/models/announcement.js";
import { CustomError } from "../lib/utils.js";
import status from "http-status";

const getAll = async (req: Request, res: Response) => {
  const facultyId = Number(res.locals.facultyId);
  const announcements = await AnnouncementModel.getAll(facultyId);
  res.json(announcements);
};

const getById = async (req: Request, res: Response) => {
  const facultyId = Number(res.locals.facultyId);
  const id = Number(req.params.id);
  const announcement = await AnnouncementModel.getById(id, facultyId);

  if (!announcement) {
    throw new CustomError("Announcement not found", status.NOT_FOUND);
  }

  res.json(announcement);
};

const create = async (req: Request, res: Response) => {
  const facultyId = Number(res.locals.facultyId);
  const { message } = req.body;

  if (!message) {
    throw new CustomError("message is required", status.BAD_REQUEST);
  }

  const announcement = await AnnouncementModel.create({ message, facultyId });
  res.status(status.CREATED).json(announcement);
};

const update = async (req: Request, res: Response) => {
  const facultyId = Number(res.locals.facultyId);
  const id = Number(req.params.id);
  const { message } = req.body;

  const result = await AnnouncementModel.update(id, facultyId, { message });

  if (result.count === 0) {
    throw new CustomError("Announcement not found", status.NOT_FOUND);
  }

  res.json({ message: "Announcement updated" });
};

const remove = async (req: Request, res: Response) => {
  const facultyId = Number(res.locals.facultyId);
  const id = Number(req.params.id);

  const result = await AnnouncementModel.remove(id, facultyId);

  if (result.count === 0) {
    throw new CustomError("Announcement not found", status.NOT_FOUND);
  }

  res.json({ message: "Announcement deleted" });
};

const getPublic = async (req: Request, res: Response) => {
  const announcements = await AnnouncementModel.getPublic();
  res.json(announcements);
};

export default { getPublic, getAll, getById, create, update, remove };
