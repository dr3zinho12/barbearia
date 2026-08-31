import { Request, Response } from 'express';
import { serviceService } from '../services/service.service';
import { asyncHandler } from '../utils/asyncHandler';

export const serviceController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const onlyActive = !req.user || req.user.role !== 'ADMIN';
    const services = await serviceService.listAll(onlyActive);
    res.status(200).json(services);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceService.getById(req.params.id);
    res.status(200).json(service);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceService.create(req.body);
    res.status(201).json(service);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceService.update(req.params.id, req.body);
    res.status(200).json(service);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await serviceService.remove(req.params.id);
    res.status(204).send();
  }),
};
