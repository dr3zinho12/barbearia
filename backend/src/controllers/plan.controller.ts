import { Request, Response } from 'express';
import { planService } from '../services/plan.service';
import { subscriptionService } from '../services/subscription.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const planController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const onlyActive = !req.user || req.user.role !== 'ADMIN';
    const plans = await planService.listAll(onlyActive);
    res.status(200).json(plans);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const plan = await planService.getById(req.params.id);
    res.status(200).json(plan);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const plan = await planService.create(req.body);
    res.status(201).json(plan);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const plan = await planService.update(req.params.id, req.body);
    res.status(200).json(plan);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await planService.remove(req.params.id);
    res.status(204).send();
  }),

  listSubscribers: asyncHandler(async (req: Request, res: Response) => {
    const subscribers = await planService.listSubscribers(req.params.id);
    res.status(200).json(subscribers);
  }),

  subscribe: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const subscription = await subscriptionService.subscribe(req.user.id, req.params.id);
    res.status(201).json(subscription);
  }),

  currentSubscription: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const subscription = await subscriptionService.getCurrentForClient(req.user.id);
    res.status(200).json(subscription);
  }),

  cancelSubscription: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const subscription = await subscriptionService.cancel(req.user.id);
    res.status(200).json(subscription);
  }),
};
