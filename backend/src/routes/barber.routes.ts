import { Router } from 'express';
import { barberController } from '../controllers/barber.controller';
import { authenticate, authorize, optionalAuthenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createBarberSchema, setBarberWorkingHoursSchema, updateBarberSchema } from '../validators/barber.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.get('/', optionalAuthenticate, barberController.list);
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

export default router;
