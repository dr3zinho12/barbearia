import { Router } from 'express';
import { businessHoursController } from '../controllers/businessHours.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createBlockedScheduleSchema, setBusinessHoursSchema } from '../validators/businessHours.validator.js';
import { idParamSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/', businessHoursController.get);
router.put('/', authenticate, authorize('ADMIN'), validate({ body: setBusinessHoursSchema }), businessHoursController.set);

router.get('/blocked', authenticate, authorize('ADMIN'), businessHoursController.listBlocked);
router.post(
  '/blocked',
  authenticate,
  authorize('ADMIN'),
  validate({ body: createBlockedScheduleSchema }),
  businessHoursController.createBlocked,
);
router.delete(
  '/blocked/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema }),
  businessHoursController.removeBlocked,
);

export default router;
