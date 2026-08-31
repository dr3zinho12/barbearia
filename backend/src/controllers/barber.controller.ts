import { Request, Response } from 'express';
import { barberService } from '../services/barber.service';
import { asyncHandler } from '../utils/asyncHandler';

export const barberController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const onlyActive = !req.user || req.user.role !== 'ADMIN';
    const barbers = await barberService.listAll(onlyActive);
    res.status(200).json(barbers);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const barber = await barberService.getById(req.params.id);
    res.status(200).json(barber);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const barber = await barberService.create(req.body);
    res.status(201).json(barber);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const barber = await barberService.update(req.params.id, req.body);
    res.status(200).json(barber);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await barberService.remove(req.params.id);
    res.status(204).send();
  }),

  setWorkingHours: asyncHandler(async (req: Request, res: Response) => {
    const workingHours = await barberService.setWorkingHours(req.params.id, req.body.workingHours);
    res.status(200).json(workingHours);
  }),
};
