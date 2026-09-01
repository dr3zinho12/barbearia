import { serviceService } from '../services/service.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const serviceController = {
  list: asyncHandler(async (req, res) => {
    const onlyActive = !req.user || req.user.role !== 'ADMIN';
    const services = await serviceService.listAll(onlyActive);
    res.status(200).json(services);
  }),

  getById: asyncHandler(async (req, res) => {
    const service = await serviceService.getById(req.params.id);
    res.status(200).json(service);
  }),

  create: asyncHandler(async (req, res) => {
    const service = await serviceService.create(req.body);
    res.status(201).json(service);
  }),

  update: asyncHandler(async (req, res) => {
    const service = await serviceService.update(req.params.id, req.body);
    res.status(200).json(service);
  }),

  remove: asyncHandler(async (req, res) => {
    await serviceService.remove(req.params.id);
    res.status(204).send();
  }),
};
