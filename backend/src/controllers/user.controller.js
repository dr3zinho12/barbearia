import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const userController = {
  list: asyncHandler(async (req, res) => {
    const result = await userService.listClients(req.query);
    res.status(200).json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const client = await userService.getClientDetail(req.params.id);
    res.status(200).json(client);
  }),

  update: asyncHandler(async (req, res) => {
    const client = await userService.updateClient(req.params.id, req.body);
    res.status(200).json(client);
  }),

  listAdmins: asyncHandler(async (_req, res) => {
    const admins = await userService.listAdmins();
    res.status(200).json(admins);
  }),

  createAdmin: asyncHandler(async (req, res) => {
    const admin = await userService.createAdmin(req.body);
    res.status(201).json(admin);
  }),
};
