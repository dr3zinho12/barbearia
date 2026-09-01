import { Router } from 'express';
import { barberController } from '../controllers/barber.controller.js';
import { authenticate, authorize, optionalAuthenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createBarberSchema,
  grantBarberLoginSchema,
  setBarberWorkingHoursSchema,
  updateBarberSchema,
  updateOwnBarberSchema,
} from '../validators/barber.validator.js';
import { createBlockedScheduleSchema } from '../validators/businessHours.validator.js';
import { idParamSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/', optionalAuthenticate, barberController.list);

router.get('/me', authenticate, authorize('BARBER'), barberController.me);
router.put('/me', authenticate, authorize('BARBER'), validate({ body: updateOwnBarberSchema }), barberController.updateMe);
router.get('/me/breaks', authenticate, authorize('BARBER'), barberController.myBreaks);
router.post(
  '/me/breaks',
  authenticate,
  authorize('BARBER'),
  validate({ body: createBlockedScheduleSchema }),
  barberController.createMyBreak,
);
router.delete(
  '/me/breaks/:id',
  authenticate,
  authorize('BARBER'),
  validate({ params: idParamSchema }),
  barberController.removeMyBreak,
);
router.put(
  '/me/working-hours',
  authenticate,
  authorize('BARBER'),
  validate({ body: setBarberWorkingHoursSchema }),
  barberController.updateMyWorkingHours,
);

router.get('/:id', validate({ params: idParamSchema }), barberController.getById);

router.post('/', authenticate, authorize('ADMIN'), validate({ body: createBarberSchema }), barberController.create);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema, body: updateBarberSchema }),
  barberController.update,
);
router.delete('/:id', authenticate, authorize('ADMIN'), validate({ params: idParamSchema }), barberController.remove);

router.put(
  '/:id/working-hours',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema, body: setBarberWorkingHoursSchema }),
  barberController.setWorkingHours,
);

router.post(
  '/:id/login',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema, body: grantBarberLoginSchema }),
  barberController.grantLogin,
);

export default router;
