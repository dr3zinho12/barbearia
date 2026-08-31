import { Request, Response } from 'express';
import { businessHoursService } from '../services/businessHours.service';
import { asyncHandler } from '../utils/asyncHandler';

export const businessHoursController = {
  get: asyncHandler(async (_req: Request, res: Response) => {
    const workingHours = await businessHoursService.getBusinessHours();
    res.status(200).json(workingHours);
  }),

  set: asyncHandler(async (req: Request, res: Response) => {
    const workingHours = await businessHoursService.setBusinessHours(req.body.workingHours);
    res.status(200).json(workingHours);
  }),

  listBlocked: asyncHandler(async (req: Request, res: Response) => {
    const blocked = await businessHoursService.listBlockedSchedules(req.query as { barberId?: string; from?: string; to?: string });
    res.status(200).json(blocked);
  }),

  createBlocked: asyncHandler(async (req: Request, res: Response) => {
    const blocked = await businessHoursService.createBlockedSchedule(req.body);
    res.status(201).json(blocked);
  }),

  removeBlocked: asyncHandler(async (req: Request, res: Response) => {
    await businessHoursService.removeBlockedSchedule(req.params.id);
    res.status(204).send();
  }),
};
