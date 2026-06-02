import { Response } from "express";

export const noContent = (res: Response): Response => {
  return res.sendStatus(204);
};
