import { Router } from 'express';
import { planController } from '../controllers/plan.controller';
import { authenticate, authorize, optionalAuthenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../validators/common.validator';
import { createPlanSchema, updatePlanSchema } from '../validators/plan.validator';

const router = Router();

router.get('/', optionalAuthenticate, planController.list);
router.get('/subscriptions/me', authenticate, authorize('CLIENT'), planController.currentSubscription);
router.delete('/subscriptions/me', authenticate, authorize('CLIENT'), planController.cancelSubscription);

router.get('/:id', validate({ params: idParamSchema }), planController.getById);
router.post('/', authenticate, authorize('ADMIN'), validate({ body: createPlanSchema }), planController.create);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema, body: updatePlanSchema }),
  planController.update,
);
router.delete('/:id', authenticate, authorize('ADMIN'), validate({ params: idParamSchema }), planController.remove);

router.get(
  '/:id/subscribers',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema }),
  planController.listSubscribers,
);

router.post(
  '/:id/subscribe',
  authenticate,
  authorize('CLIENT'),
  validate({ params: idParamSchema }),
  planController.subscribe,
);

export default router;
