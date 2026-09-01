import { Request, Response } from 'express';
import { barberService } from '../services/barber.service';
import { businessHoursService } from '../services/businessHours.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

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

  grantLogin: asyncHandler(async (req: Request, res: Response) => {
    const barber = await barberService.grantLogin(req.params.id, req.body);
    res.status(201).json(barber);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const barber = await barberService.getByUserId(req.user.id);
    res.status(200).json(barber);
  }),

  updateMe: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const barber = await barberService.updateOwnProfile(req.user.id, req.body);
    res.status(200).json(barber);
  }),

  myBreaks: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const barber = await barberService.getByUserId(req.user.id);
    const breaks = await businessHoursService.listBlockedSchedules({ barberId: barber.id });
    res.status(200).json(breaks);
  }),

  createMyBreak: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const barber = await barberService.getByUserId(req.user.id);
    const breakEntry = await businessHoursService.createBlockedSchedule({ ...req.body, barberId: barber.id });
    res.status(201).json(breakEntry);
  }),

  updateMyWorkingHours: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const barber = await barberService.getByUserId(req.user.id);
    const workingHours = await barberService.setWorkingHours(barber.id, req.body.workingHours);
    res.status(200).json(workingHours);
  }),

  removeMyBreak: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const barber = await barberService.getByUserId(req.user.id);
    const breakEntry = await businessHoursService.getBlockedScheduleById(req.params.id);

    if (breakEntry.barberId !== barber.id) {
      throw AppError.forbidden('Você só pode remover bloqueios da sua própria agenda');
    }

    await businessHoursService.removeBlockedSchedule(req.params.id);
    res.status(204).send();
  }),
};
