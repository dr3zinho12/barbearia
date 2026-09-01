import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  availabilityQuerySchema,
  createAppointmentSchema,
  listAppointmentsQuerySchema,
  rescheduleAppointmentSchema,
  updateAppointmentStatusSchema,
} from '../validators/appointment.validator.js';
import { idParamSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/availability', authenticate, validate({ query: availabilityQuerySchema }), appointmentController.availability);
router.get('/mine', authenticate, authorize('CLIENT'), appointmentController.listMine);

router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'BARBER'),
  validate({ query: listAppointmentsQuerySchema }),
  appointmentController.listAll,
);
router.post('/', authenticate, authorize('CLIENT'), validate({ body: createAppointmentSchema }), appointmentController.create);

router.get('/:id', authenticate, validate({ params: idParamSchema }), appointmentController.getById);
router.put('/:id/cancel', authenticate, authorize('CLIENT', 'ADMIN'), validate({ params: idParamSchema }), appointmentController.cancel);
router.put(
  '/:id/reschedule',
  authenticate,
  authorize('CLIENT', 'ADMIN'),
  validate({ params: idParamSchema, body: rescheduleAppointmentSchema }),
  appointmentController.reschedule,
);
router.put(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'BARBER'),
  validate({ params: idParamSchema, body: updateAppointmentStatusSchema }),
  appointmentController.updateStatus,
);

export default router;
