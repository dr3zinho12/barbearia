import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { userController } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { idParamSchema } from '../validators/common.validator.js';
import { adminUpdateUserSchema, createAdminSchema, listUsersQuerySchema } from '../validators/user.validator.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', dashboardController.summary);

router.get('/admins', userController.listAdmins);
router.post('/admins', validate({ body: createAdminSchema }), userController.createAdmin);

router.get('/users', validate({ query: listUsersQuerySchema }), userController.list);
router.get('/users/:id', validate({ params: idParamSchema }), userController.getById);
router.put('/users/:id', validate({ params: idParamSchema, body: adminUpdateUserSchema }), userController.update);

export default router;
