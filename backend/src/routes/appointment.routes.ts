import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  availabilityQuerySchema,
  createAppointmentSchema,
  listAppointmentsQuerySchema,
  rescheduleAppointmentSchema,
  updateAppointmentStatusSchema,
} from '../validators/appointment.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.get('/availability', authenticate, validate({ query: availabilityQuerySchema }), appointmentController.availability);
router.get('/mine', authenticate, authorize('CLIENT'), appointmentController.listMine);

router.get('/', authenticate, authorize('ADMIN'), validate({ query: listAppointmentsQuerySchema }), appointmentController.listAll);
router.post('/', authenticate, authorize('CLIENT'), validate({ body: createAppointmentSchema }), appointmentController.create);

router.get('/:id', authenticate, validate({ params: idParamSchema }), appointmentController.getById);
router.put('/:id/cancel', authenticate, validate({ params: idParamSchema }), appointmentController.cancel);
router.put(
  '/:id/reschedule',
  authenticate,
  validate({ params: idParamSchema, body: rescheduleAppointmentSchema }),
  appointmentController.reschedule,
);
router.put(
  '/:id/status',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema, body: updateAppointmentStatusSchema }),
  appointmentController.updateStatus,
);

export default router;
