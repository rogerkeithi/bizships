import { Response } from "express";

export const ok = (res: Response, data?: unknown) => {
  return res.status(200).json({
    success: true,
    data,
  });
};
