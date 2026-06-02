import { Response } from "express";

export const created = (res: Response) => {
  return res.status(201).json({
    success: true,
  });
};
