import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ListUsersQueryInput } from '../validators/user.validator';

export const userController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.listClients(req.query as unknown as ListUsersQueryInput);
    res.status(200).json(result);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const client = await userService.getClientDetail(req.params.id);
    res.status(200).json(client);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const client = await userService.updateClient(req.params.id, req.body);
    res.status(200).json(client);
  }),
};
