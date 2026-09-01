import { businessHoursService } from '../services/businessHours.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const businessHoursController = {
  get: asyncHandler(async (_req, res) => {
    const workingHours = await businessHoursService.getBusinessHours();
    res.status(200).json(workingHours);
  }),

  set: asyncHandler(async (req, res) => {
    const workingHours = await businessHoursService.setBusinessHours(req.body.workingHours);
    res.status(200).json(workingHours);
  }),

  listBlocked: asyncHandler(async (req, res) => {
    const blocked = await businessHoursService.listBlockedSchedules(req.query);
    res.status(200).json(blocked);
  }),

  createBlocked: asyncHandler(async (req, res) => {
    const blocked = await businessHoursService.createBlockedSchedule(req.body);
    res.status(201).json(blocked);
  }),

  removeBlocked: asyncHandler(async (req, res) => {
    await businessHoursService.removeBlockedSchedule(req.params.id);
    res.status(204).send();
  }),
};
