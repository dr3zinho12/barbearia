import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { userController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../validators/common.validator';
import { adminUpdateUserSchema, listUsersQuerySchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', dashboardController.summary);

router.get('/users', validate({ query: listUsersQuerySchema }), userController.list);
router.get('/users/:id', validate({ params: idParamSchema }), userController.getById);
router.put('/users/:id', validate({ params: idParamSchema, body: adminUpdateUserSchema }), userController.update);

export default router;
