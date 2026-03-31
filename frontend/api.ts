export type CrowdLevel = 'low' | 'medium' | 'high';
export type FemaleSafety = 'safe' | 'moderate' | 'unsafe';
export type TicketStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Bus {
  number: string;
  route_name: string;
  from_terminal_id: string;
  to_terminal_id: string;
  current_stop_id: string;
  arrival_minutes: number;
  crowd_level: CrowdLevel;
  crowd_percentage: number;
  seats_available: number;
  female_safety: FemaleSafety;
  passenger_count: number;
  capacity: number;
  current_location: string;
  stops_away: number;
  fare: number;
}

export interface BusPrediction {
  time: string;
  crowd_level: CrowdLevel;
  crowd_percentage: number;
  seats: number;
}

export interface SeatLayoutItem {
  id: string;
  row: number;
  number: number;
  is_available: boolean;
  type: 'window' | 'aisle';
}

export interface Ticket {
  id: string;
  mobile: string;
  bus_number: string;
  route_name: string;
  seats: number[];
  amount: number;
  payment_method: string;
  date: string;
  status: TicketStatus;
}

export interface Stop {
  id: string;
  name: string;
  code: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface Terminal {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  type: 'major' | 'city' | 'district';
  facilities: string[];
  platforms: number;
}

export interface PopularRoute {
  id: string;
  from_city: string;
  to_city: string;
  distance: number;
  duration_hours: number;
  frequency: string;
  popular: boolean;
}

export interface AnalyticsOverview {
  average_crowd_percentage: number;
  busiest_bus: Bus;
  least_crowded_bus: Bus;
  peak_hours: Array<{ hour: string; crowd_percentage: number }>;
  weekly_trend: Array<{ day: string; crowd_percentage: number }>;
  best_travel_window: string;
}

export interface DashboardSummary {
  app_name: string;
  active_buses: number;
  tracked_terminals: number;
  tracked_stops: number;
  total_bookings: number;
  low_crowd_alerts: number;
  open_sos_alerts: number;
}

export interface BootstrapData {
  app: {
    name: string;
    version: string;
    time: string;
  };
  buses: Bus[];
  stops: Stop[];
  terminals: Terminal[];
  popular_routes: PopularRoute[];
  analytics: AnalyticsOverview;
}

export interface AuthUser {
  id: string;
  mobile: string;
  name: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

const API_BASE_URL =
  (globalThis as { __SMARTBUS_API_BASE__?: string }).__SMARTBUS_API_BASE__ ||
  'http://127.0.0.1:8000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (typeof data?.detail === 'string') {
        message = data.detail;
      }
    } catch {
      // Ignore JSON parsing failures and keep the fallback message.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  baseUrl: API_BASE_URL,

  getBootstrap() {
    return request<BootstrapData>('/app/bootstrap');
  },

  sendOtp(mobile: string) {
    return request<{ message: string; mobile: string; otp_demo: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  },

  verifyOtp(mobile: string, otp: string) {
    return request<{ message: string; user: AuthUser; token: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp }),
    });
  },

  getBuses() {
    return request<Bus[]>('/buses');
  },

  getBus(busNumber: string) {
    return request<Bus>(`/buses/${encodeURIComponent(busNumber)}`);
  },

  getBusPredictions(busNumber: string) {
    return request<BusPrediction[]>(`/buses/${encodeURIComponent(busNumber)}/predictions`);
  },

  getBusSeats(busNumber: string) {
    return request<{ bus_number: string; fare_per_seat: number; seat_layout: SeatLayoutItem[] }>(
      `/buses/${encodeURIComponent(busNumber)}/seats`,
    );
  },

  getStopBuses(stopId: string) {
    return request<{ stop: Stop; buses: Bus[] }>(`/stops/${encodeURIComponent(stopId)}/buses`);
  },

  getTickets(mobile: string) {
    return request<Ticket[]>(`/tickets?mobile=${encodeURIComponent(mobile)}`);
  },

  createBooking(payload: {
    mobile: string;
    bus_number: string;
    seats: number[];
    payment_method: 'Google Pay' | 'PhonePe' | 'Paytm' | 'UPI';
  }) {
    return request<{
      message: string;
      ticket: Ticket;
      fare_breakdown: { subtotal: number; gst: number; total: number };
    }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  createLowCrowdAlert(payload: {
    mobile: string;
    bus_number: string;
    preferred_crowd_level: 'low' | 'medium';
  }) {
    return request<{ message: string; alert: Record<string, unknown> }>('/notifications/low-crowd', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  createSos(payload: {
    mobile: string;
    bus_number?: string;
    latitude?: number;
    longitude?: number;
    message: string;
  }) {
    return request<{ message: string; alert: Record<string, unknown> }>('/sos', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getAnalyticsOverview() {
    return request<AnalyticsOverview>('/analytics/overview');
  },

  getDashboardSummary() {
    return request<DashboardSummary>('/dashboard/summary');
  },
};
