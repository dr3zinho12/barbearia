import { dashboardService } from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const dashboardController = {
  summary: asyncHandler(async (_req, res) => {
    const summary = await dashboardService.getSummary();
    res.status(200).json(summary);
  }),
};
