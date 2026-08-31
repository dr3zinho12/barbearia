export type Role = 'CLIENT' | 'ADMIN';

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';

export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkingHour {
  id: string;
  barberId: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  closed: boolean;
}

export interface Barber {
  id: string;
  name: string;
  description: string;
  photoUrl: string | null;
  specialties: string[];
  active: boolean;
  workingHours?: WorkingHour[];
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string | number;
  duration: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  client?: User;
  barber?: Barber;
  service?: Service;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string | number;
  benefits: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  clientId: string;
  planId: string;
  startDate: string;
  endDate: string | null;
  status: SubscriptionStatus;
  plan?: Plan;
  client?: User;
}

export interface BlockedSchedule {
  id: string;
  barberId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  reason: string | null;
  barber?: Barber | null;
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

export interface DashboardSummary {
  totalClients: number;
  totalBarbers: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  cancellationsThisWeek: number;
  activeSubscriptions: number;
  estimatedRevenue: number;
  nextAppointments: Appointment[];
  topServices: { service?: Service; count: number }[];
}

export interface ClientDetail extends User {
  appointments: Appointment[];
  subscription: Subscription | null;
}

export interface ApiError {
  message: string;
  errors?: { path: string; message: string }[];
}
