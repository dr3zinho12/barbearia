import { Router } from 'express';
import adminRoutes from './admin.routes';
import appointmentRoutes from './appointment.routes';
import authRoutes from './auth.routes';
import barberRoutes from './barber.routes';
import businessHoursRoutes from './businessHours.routes';
import planRoutes from './plan.routes';
import serviceRoutes from './service.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/barbers', barberRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/plans', planRoutes);
router.use('/business-hours', businessHoursRoutes);
router.use('/admin', adminRoutes);

export default router;
