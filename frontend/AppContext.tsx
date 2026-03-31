import { jsx as _jsx } from 'react/jsx-runtime';
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { api, type AuthSession, type BootstrapData, type TicketStatus } from './api';

type Theme = 'light' | 'dark';
type Language = 'en' | 'ta' | 'te' | 'kn' | 'ml' | 'hi';

type TranslationSet = {
  appName: string;
  tagline: string;
  login: string;
  verify: string;
  enterMobile: string;
  enterOTP: string;
  sendOTP: string;
  darkMode: string;
  nearbyBusStops: string;
  nextBuses: string;
  analytics: string;
  mins: string;
  low: string;
  medium: string;
  high: string;
  crowdLevel: string;
  crowdPercentage: string;
  seatsAvailable: string;
  femaleSafety: string;
  safe: string;
  moderate: string;
  estimatedArrival: string;
  passengerCount: string;
  liveTracking: string;
  aiPrediction: string;
  bestTravelTime: string;
  peakHours: string;
  notifyLowCrowdButton: string;
  sos: string;
  emergencyContact: string;
  safetyFeatures: string;
  cctvMonitored: string;
  gpsTracking: string;
  searchDestination: string;
  upcomingBuses: string;
  ticketHistory: string;
  myTickets: string;
  noTickets: string;
  ticketId: string;
};

type AppTicket = {
  id: string;
  busNumber: string;
  routeName: string;
  seats: number[];
  amount: number;
  paymentMethod: string;
  date: string;
  status: TicketStatus;
};

type AppContextValue = {
  translations: TranslationSet;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  mobile: string;
  setMobile: (mobile: string) => void;
  tickets: AppTicket[];
  addTicket: (ticket: AppTicket) => void;
  refreshTickets: (mobileNumber?: string) => Promise<void>;
  bootstrap: BootstrapData | null;
  isBootstrapping: boolean;
  bootstrapError: string;
};

const translationsByLanguage: Record<Language, TranslationSet> = {
  en: {
    appName: 'SmartBus Crowd Management',
    tagline: 'Travel Safer. Travel Smarter.',
    login: 'Login',
    verify: 'Verify OTP',
    enterMobile: 'Enter mobile number',
    enterOTP: 'Enter OTP',
    sendOTP: 'Send OTP',
    darkMode: 'Dark Mode',
    nearbyBusStops: 'Nearby Bus Stops',
    nextBuses: 'Next Buses',
    analytics: 'Analytics',
    mins: 'mins',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    crowdLevel: 'Crowd Level',
    crowdPercentage: 'Crowd Percentage',
    seatsAvailable: 'Seats Available',
    femaleSafety: 'Female Safety',
    safe: 'Safe',
    moderate: 'Moderate',
    estimatedArrival: 'Estimated Arrival',
    passengerCount: 'Passenger Count',
    liveTracking: 'Live Tracking',
    aiPrediction: 'AI Prediction',
    bestTravelTime: 'Best Travel Time',
    peakHours: 'Peak Hours',
    notifyLowCrowdButton: 'Notify me when low crowd',
    sos: 'SOS',
    emergencyContact: 'Emergency Contact',
    safetyFeatures: 'Safety Features',
    cctvMonitored: 'CCTV Monitored',
    gpsTracking: 'GPS Tracking',
    searchDestination: 'Search destination...',
    upcomingBuses: 'Upcoming Buses',
    ticketHistory: 'Ticket History',
    myTickets: 'My Tickets',
    noTickets: 'No tickets found',
    ticketId: 'Ticket ID',
  },
  ta: {
    appName: 'SmartBus Crowd Management',
    tagline: 'Travel Safer. Travel Smarter.',
    login: 'Login',
    verify: 'Verify OTP',
    enterMobile: 'Enter mobile number',
    enterOTP: 'Enter OTP',
    sendOTP: 'Send OTP',
    darkMode: 'Dark Mode',
    nearbyBusStops: 'Nearby Bus Stops',
    nextBuses: 'Next Buses',
    analytics: 'Analytics',
    mins: 'mins',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    crowdLevel: 'Crowd Level',
    crowdPercentage: 'Crowd Percentage',
    seatsAvailable: 'Seats Available',
    femaleSafety: 'Female Safety',
    safe: 'Safe',
    moderate: 'Moderate',
    estimatedArrival: 'Estimated Arrival',
    passengerCount: 'Passenger Count',
    liveTracking: 'Live Tracking',
    aiPrediction: 'AI Prediction',
    bestTravelTime: 'Best Travel Time',
    peakHours: 'Peak Hours',
    notifyLowCrowdButton: 'Notify me when low crowd',
    sos: 'SOS',
    emergencyContact: 'Emergency Contact',
    safetyFeatures: 'Safety Features',
    cctvMonitored: 'CCTV Monitored',
    gpsTracking: 'GPS Tracking',
    searchDestination: 'Search destination...',
    upcomingBuses: 'Upcoming Buses',
    ticketHistory: 'Ticket History',
    myTickets: 'My Tickets',
    noTickets: 'No tickets found',
    ticketId: 'Ticket ID',
  },
  te: {
    appName: 'SmartBus Crowd Management',
    tagline: 'Travel Safer. Travel Smarter.',
    login: 'Login',
    verify: 'Verify OTP',
    enterMobile: 'Enter mobile number',
    enterOTP: 'Enter OTP',
    sendOTP: 'Send OTP',
    darkMode: 'Dark Mode',
    nearbyBusStops: 'Nearby Bus Stops',
    nextBuses: 'Next Buses',
    analytics: 'Analytics',
    mins: 'mins',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    crowdLevel: 'Crowd Level',
    crowdPercentage: 'Crowd Percentage',
    seatsAvailable: 'Seats Available',
    femaleSafety: 'Female Safety',
    safe: 'Safe',
    moderate: 'Moderate',
    estimatedArrival: 'Estimated Arrival',
    passengerCount: 'Passenger Count',
    liveTracking: 'Live Tracking',
    aiPrediction: 'AI Prediction',
    bestTravelTime: 'Best Travel Time',
    peakHours: 'Peak Hours',
    notifyLowCrowdButton: 'Notify me when low crowd',
    sos: 'SOS',
    emergencyContact: 'Emergency Contact',
    safetyFeatures: 'Safety Features',
    cctvMonitored: 'CCTV Monitored',
    gpsTracking: 'GPS Tracking',
    searchDestination: 'Search destination...',
    upcomingBuses: 'Upcoming Buses',
    ticketHistory: 'Ticket History',
    myTickets: 'My Tickets',
    noTickets: 'No tickets found',
    ticketId: 'Ticket ID',
  },
  kn: {
    appName: 'SmartBus Crowd Management',
    tagline: 'Travel Safer. Travel Smarter.',
    login: 'Login',
    verify: 'Verify OTP',
    enterMobile: 'Enter mobile number',
    enterOTP: 'Enter OTP',
    sendOTP: 'Send OTP',
    darkMode: 'Dark Mode',
    nearbyBusStops: 'Nearby Bus Stops',
    nextBuses: 'Next Buses',
    analytics: 'Analytics',
    mins: 'mins',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    crowdLevel: 'Crowd Level',
    crowdPercentage: 'Crowd Percentage',
    seatsAvailable: 'Seats Available',
    femaleSafety: 'Female Safety',
    safe: 'Safe',
    moderate: 'Moderate',
    estimatedArrival: 'Estimated Arrival',
    passengerCount: 'Passenger Count',
    liveTracking: 'Live Tracking',
    aiPrediction: 'AI Prediction',
    bestTravelTime: 'Best Travel Time',
    peakHours: 'Peak Hours',
    notifyLowCrowdButton: 'Notify me when low crowd',
    sos: 'SOS',
    emergencyContact: 'Emergency Contact',
    safetyFeatures: 'Safety Features',
    cctvMonitored: 'CCTV Monitored',
    gpsTracking: 'GPS Tracking',
    searchDestination: 'Search destination...',
    upcomingBuses: 'Upcoming Buses',
    ticketHistory: 'Ticket History',
    myTickets: 'My Tickets',
    noTickets: 'No tickets found',
    ticketId: 'Ticket ID',
  },
  ml: {
    appName: 'SmartBus Crowd Management',
    tagline: 'Travel Safer. Travel Smarter.',
    login: 'Login',
    verify: 'Verify OTP',
    enterMobile: 'Enter mobile number',
    enterOTP: 'Enter OTP',
    sendOTP: 'Send OTP',
    darkMode: 'Dark Mode',
    nearbyBusStops: 'Nearby Bus Stops',
    nextBuses: 'Next Buses',
    analytics: 'Analytics',
    mins: 'mins',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    crowdLevel: 'Crowd Level',
    crowdPercentage: 'Crowd Percentage',
    seatsAvailable: 'Seats Available',
    femaleSafety: 'Female Safety',
    safe: 'Safe',
    moderate: 'Moderate',
    estimatedArrival: 'Estimated Arrival',
    passengerCount: 'Passenger Count',
    liveTracking: 'Live Tracking',
    aiPrediction: 'AI Prediction',
    bestTravelTime: 'Best Travel Time',
    peakHours: 'Peak Hours',
    notifyLowCrowdButton: 'Notify me when low crowd',
    sos: 'SOS',
    emergencyContact: 'Emergency Contact',
    safetyFeatures: 'Safety Features',
    cctvMonitored: 'CCTV Monitored',
    gpsTracking: 'GPS Tracking',
    searchDestination: 'Search destination...',
    upcomingBuses: 'Upcoming Buses',
    ticketHistory: 'Ticket History',
    myTickets: 'My Tickets',
    noTickets: 'No tickets found',
    ticketId: 'Ticket ID',
  },
  hi: {
    appName: 'SmartBus Crowd Management',
    tagline: 'Travel Safer. Travel Smarter.',
    login: 'Login',
    verify: 'Verify OTP',
    enterMobile: 'Enter mobile number',
    enterOTP: 'Enter OTP',
    sendOTP: 'Send OTP',
    darkMode: 'Dark Mode',
    nearbyBusStops: 'Nearby Bus Stops',
    nextBuses: 'Next Buses',
    analytics: 'Analytics',
    mins: 'mins',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    crowdLevel: 'Crowd Level',
    crowdPercentage: 'Crowd Percentage',
    seatsAvailable: 'Seats Available',
    femaleSafety: 'Female Safety',
    safe: 'Safe',
    moderate: 'Moderate',
    estimatedArrival: 'Estimated Arrival',
    passengerCount: 'Passenger Count',
    liveTracking: 'Live Tracking',
    aiPrediction: 'AI Prediction',
    bestTravelTime: 'Best Travel Time',
    peakHours: 'Peak Hours',
    notifyLowCrowdButton: 'Notify me when low crowd',
    sos: 'SOS',
    emergencyContact: 'Emergency Contact',
    safetyFeatures: 'Safety Features',
    cctvMonitored: 'CCTV Monitored',
    gpsTracking: 'GPS Tracking',
    searchDestination: 'Search destination...',
    upcomingBuses: 'Upcoming Buses',
    ticketHistory: 'Ticket History',
    myTickets: 'My Tickets',
    noTickets: 'No tickets found',
    ticketId: 'Ticket ID',
  },
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

function mapApiTicketToAppTicket(apiTicket: {
  id: string;
  bus_number: string;
  route_name: string;
  seats: number[];
  amount: number;
  payment_method: string;
  date: string;
  status: TicketStatus;
}): AppTicket {
  return {
    id: apiTicket.id,
    busNumber: apiTicket.bus_number,
    routeName: apiTicket.route_name,
    seats: apiTicket.seats,
    amount: apiTicket.amount,
    paymentMethod: apiTicket.payment_method,
    date: apiTicket.date,
    status: apiTicket.status,
  };
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mobile, setMobile] = useState('');
  const [tickets, setTickets] = useState<AppTicket[]>([]);
  const [bootstrap, setBootstrap] = useState<BootstrapData | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [bootstrapError, setBootstrapError] = useState('');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('app_theme');
      const savedLanguage = localStorage.getItem('app_language');
      const savedSession = localStorage.getItem('app_session');
      const savedMobile = localStorage.getItem('app_mobile');

      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }

      if (
        savedLanguage === 'en' ||
        savedLanguage === 'ta' ||
        savedLanguage === 'te' ||
        savedLanguage === 'kn' ||
        savedLanguage === 'ml' ||
        savedLanguage === 'hi'
      ) {
        setLanguage(savedLanguage);
      }

      if (savedSession) {
        const parsedSession = JSON.parse(savedSession) as AuthSession;
        setSession(parsedSession);
        setMobile(parsedSession.user.mobile);
      } else if (savedMobile) {
        setMobile(savedMobile);
      }
    } catch {
      // Ignore storage parsing failures and use default state.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('app_session', JSON.stringify(session));
      localStorage.setItem('app_mobile', session.user.mobile);
      if (!mobile) {
        setMobile(session.user.mobile);
      }
      return;
    }

    localStorage.removeItem('app_session');
  }, [session, mobile]);

  useEffect(() => {
    if (mobile) {
      localStorage.setItem('app_mobile', mobile);
      return;
    }

    localStorage.removeItem('app_mobile');
  }, [mobile]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getBootstrap();
        setBootstrap(data);
        setBootstrapError('');
      } catch (error) {
        setBootstrapError(error instanceof Error ? error.message : 'Backend connection failed');
      } finally {
        setIsBootstrapping(false);
      }
    };

    void loadData();
  }, []);

  const refreshTickets = async (mobileNumber?: string) => {
    const targetMobile = mobileNumber ?? mobile;
    if (!targetMobile) {
      setTickets([]);
      return;
    }

    try {
      const apiTickets = await api.getTickets(targetMobile);
      setTickets(apiTickets.map(mapApiTicketToAppTicket));
    } catch {
      // Keep existing tickets on failure to avoid wiping the UI.
    }
  };

  useEffect(() => {
    void refreshTickets();
  }, [mobile]);

  const addTicket = (ticket: AppTicket) => {
    setTickets((prevTickets) => {
      const existingTicketIndex = prevTickets.findIndex((existing) => existing.id === ticket.id);
      if (existingTicketIndex >= 0) {
        const updated = [...prevTickets];
        updated[existingTicketIndex] = ticket;
        return updated;
      }
      return [ticket, ...prevTickets];
    });
  };

  const translations = useMemo(() => {
    return translationsByLanguage[language] ?? translationsByLanguage.en;
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        translations,
        theme,
        setTheme,
        language,
        setLanguage,
        session,
        setSession,
        mobile,
        setMobile,
        tickets,
        addTicket,
        refreshTickets,
        bootstrap,
        isBootstrapping,
        bootstrapError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
