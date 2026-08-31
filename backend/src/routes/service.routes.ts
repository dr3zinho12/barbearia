import { Router } from 'express';
import { serviceController } from '../controllers/service.controller';
import { authenticate, authorize, optionalAuthenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../validators/common.validator';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validator';

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
