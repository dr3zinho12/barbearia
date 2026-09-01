import { planService } from '../services/plan.service.js';
import { subscriptionService } from '../services/subscription.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const planController = {
  list: asyncHandler(async (req, res) => {
    const onlyActive = !req.user || req.user.role !== 'ADMIN';
    const plans = await planService.listAll(onlyActive);
    res.status(200).json(plans);
  }),

  getById: asyncHandler(async (req, res) => {
    const plan = await planService.getById(req.params.id);
    res.status(200).json(plan);
  }),

  create: asyncHandler(async (req, res) => {
    const plan = await planService.create(req.body);
    res.status(201).json(plan);
  }),

  update: asyncHandler(async (req, res) => {
    const plan = await planService.update(req.params.id, req.body);
    res.status(200).json(plan);
  }),

  remove: asyncHandler(async (req, res) => {
    await planService.remove(req.params.id);
    res.status(204).send();
  }),

  listSubscribers: asyncHandler(async (req, res) => {
    const subscribers = await planService.listSubscribers(req.params.id);
    res.status(200).json(subscribers);
  }),

  subscribe: asyncHandler(async (req, res) => {
    if (!req.user) throw AppError.unauthorized();
    const subscription = await subscriptionService.subscribe(req.user.id, req.params.id);
    res.status(201).json(subscription);
  }),

  currentSubscription: asyncHandler(async (req, res) => {
    if (!req.user) throw AppError.unauthorized();
    const subscription = await subscriptionService.getCurrentForClient(req.user.id);
    res.status(200).json(subscription);
  }),

  cancelSubscription: asyncHandler(async (req, res) => {
    if (!req.user) throw AppError.unauthorized();
    const subscription = await subscriptionService.cancel(req.user.id);
    res.status(200).json(subscription);
  }),
};
