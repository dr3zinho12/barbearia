import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  }),

  me: asyncHandler(async (req, res) => {
    if (!req.user) throw AppError.unauthorized();
    const user = await authService.getById(req.user.id);
    res.status(200).json(user);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    if (!req.user) throw AppError.unauthorized();
    const user = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json(user);
  }),

  changePassword: asyncHandler(async (req, res) => {
    if (!req.user) throw AppError.unauthorized();
    await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    res.status(200).json({ message: 'Senha alterada com sucesso' });
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json(result);
  }),

  resetPassword: asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    res.status(200).json({ message: 'Senha redefinida com sucesso' });
  }),
};
