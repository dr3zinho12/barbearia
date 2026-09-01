import { Router } from 'express';
import { serviceController } from '../controllers/service.controller.js';
import { authenticate, authorize, optionalAuthenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { idParamSchema } from '../validators/common.validator.js';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validator.js';

const router = Router();

router.get('/', optionalAuthenticate, serviceController.list);
router.get('/:id', validate({ params: idParamSchema }), serviceController.getById);

router.post('/', authenticate, authorize('ADMIN'), validate({ body: createServiceSchema }), serviceController.create);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema, body: updateServiceSchema }),
  serviceController.update,
);
router.delete('/:id', authenticate, authorize('ADMIN'), validate({ params: idParamSchema }), serviceController.remove);

export default router;
