import { appointmentService } from '../services/appointment.service.js';
import { barberService } from '../services/barber.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const appointmentController = {
  availability: asyncHandler(async (req, res) => {
    const { barberId, serviceId, date } = req.query;
    const slots = await appointmentService.getAvailability(barberId, serviceId, date);
    res.status(200).json(slots);
  }),

  create: asyncHandler(async (req, res) => {
    if (!req.user) throw AppError.unauthorized();
    const appointment = await appointmentService.create(req.user.id, req.body);
    res.status(201).json(appointment);
  }),

  listMine: asyncHandler(async (req, res) => {
    if (!req.user) throw AppError.unauthorized();
    const appointments = await appointmentService.listMine(req.user.id);
    res.status(200).json(appointments);
  }),

  listAll: asyncHandler(async (req, res) => {
    const query = req.query;

    if (req.user?.role === 'BARBER') {
      const barber = await barberService.getByUserId(req.user.id);
      query.barberId = barber.id;
    }

    const result = await appointmentService.listAll(query);
    res.status(200).json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const appointment = await appointmentService.getById(req.params.id);
    res.status(200).json(appointment);
  }),

  cancel: asyncHandler(async (req, res) => {
    if (!req.user) throw AppError.unauthorized();
    const appointment = await appointmentService.cancel(req.params.id, req.user);
    res.status(200).json(appointment);
  }),

  reschedule: asyncHandler(async (req, res) => {
    if (!req.user) throw AppError.unauthorized();
    const appointment = await appointmentService.reschedule(
      req.params.id,
      req.user,
      req.body.date,
      req.body.startTime,
    );
    res.status(200).json(appointment);
  }),

  updateStatus: asyncHandler(async (req, res) => {
    if (!req.user) throw AppError.unauthorized();

    let barberId;
    if (req.user.role === 'BARBER') {
      const barber = await barberService.getByUserId(req.user.id);
      barberId = barber.id;
    }

    const appointment = await appointmentService.updateStatus(req.params.id, req.body.status, {
      role: req.user.role,
      barberId,
    });
    res.status(200).json(appointment);
  }),
};
