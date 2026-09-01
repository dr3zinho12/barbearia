import { Router } from 'express';
import adminRoutes from './admin.routes.js';
import appointmentRoutes from './appointment.routes.js';
import authRoutes from './auth.routes.js';
import barberRoutes from './barber.routes.js';
import businessHoursRoutes from './businessHours.routes.js';
import planRoutes from './plan.routes.js';
import serviceRoutes from './service.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/barbers', barberRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/plans', planRoutes);
router.use('/business-hours', businessHoursRoutes);
router.use('/admin', adminRoutes);

export default router;
