import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const user = await authService.getById(req.user.id);
    res.status(200).json(user);
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const user = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json(user);
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    res.status(200).json({ message: 'Senha alterada com sucesso' });
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json(result);
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    res.status(200).json({ message: 'Senha redefinida com sucesso' });
  }),
};
