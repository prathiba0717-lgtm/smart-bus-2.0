export const APP_VERSION = '2.0.0';
export const APP_BUILD = '2026.03';
export const APP_NAME = 'SmartBus Crowd Management';

// Tamil Nadu & South India Major Bus Terminals
export interface BusTerminal {
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

export const SOUTH_INDIA_BUS_TERMINALS: BusTerminal[] = [
  // Tamil Nadu - Major Terminals
  { id: 'cmbt', name: 'Chennai Mofussil Bus Terminus (CMBT)', city: 'Chennai', state: 'Tamil Nadu', latitude: 13.0381, longitude: 80.2042, type: 'major', facilities: ['AC Waiting Hall', 'Food Court', 'ATM', 'Restrooms'], platforms: 75 },
  { id: 'koyambedu', name: 'Koyambedu Bus Terminus', city: 'Chennai', state: 'Tamil Nadu', latitude: 13.0674, longitude: 80.1952, type: 'major', facilities: ['Shopping Complex', 'Food Court', 'Parking'], platforms: 60 },
  { id: 'tpuram', name: 'Thiruvanmiyur Bus Stand', city: 'Chennai', state: 'Tamil Nadu', latitude: 12.9826, longitude: 80.2583, type: 'city', facilities: ['Waiting Hall', 'Ticket Counter'], platforms: 12 },
  { id: 'tambaram', name: 'Tambaram Bus Stand', city: 'Chennai', state: 'Tamil Nadu', latitude: 12.9249, longitude: 80.1000, type: 'city', facilities: ['Waiting Area', 'Food Stalls'], platforms: 20 },
  
  { id: 'coimbatore-central', name: 'Coimbatore Central Bus Stand (Gandhipuram)', city: 'Coimbatore', state: 'Tamil Nadu', latitude: 11.0183, longitude: 76.9674, type: 'major', facilities: ['AC Waiting Hall', 'Food Court', 'Shopping', 'Medical'], platforms: 50 },
  { id: 'ukkadam', name: 'Ukkadam Bus Stand', city: 'Coimbatore', state: 'Tamil Nadu', latitude: 10.9864, longitude: 76.9548, type: 'city', facilities: ['Basic Facilities', 'Food Stalls'], platforms: 30 },
  
  { id: 'madurai-central', name: 'Mattuthavani Integrated Bus Terminus', city: 'Madurai', state: 'Tamil Nadu', latitude: 9.9082, longitude: 78.0969, type: 'major', facilities: ['AC Waiting Hall', 'Food Court', 'Parking', 'ATM'], platforms: 40 },
  { id: 'periyar', name: 'Periyar Bus Stand', city: 'Madurai', state: 'Tamil Nadu', latitude: 9.9195, longitude: 78.1193, type: 'city', facilities: ['Basic Facilities'], platforms: 20 },
  
  { id: 'salem-central', name: 'Salem Central Bus Stand', city: 'Salem', state: 'Tamil Nadu', latitude: 11.6643, longitude: 78.1460, type: 'major', facilities: ['Waiting Hall', 'Food Court', 'Parking'], platforms: 35 },
  { id: 'trichy-central', name: 'Tiruchirappalli Central Bus Stand (Chathiram)', city: 'Tiruchirappalli', state: 'Tamil Nadu', latitude: 10.8050, longitude: 78.6856, type: 'major', facilities: ['AC Waiting Hall', 'Food Court'], platforms: 35 },
  { id: 'tirunelveli', name: 'Tirunelveli Town Bus Stand', city: 'Tirunelveli', state: 'Tamil Nadu', latitude: 8.7139, longitude: 77.7567, type: 'major', facilities: ['Waiting Hall', 'Ticket Counter'], platforms: 25 },
  { id: 'vellore', name: 'Vellore Bus Stand', city: 'Vellore', state: 'Tamil Nadu', latitude: 12.9165, longitude: 79.1325, type: 'city', facilities: ['Basic Facilities', 'Food Stalls'], platforms: 20 },
  { id: 'erode', name: 'Erode Bus Stand', city: 'Erode', state: 'Tamil Nadu', latitude: 11.3410, longitude: 77.7172, type: 'city', facilities: ['Waiting Area', 'Food Court'], platforms: 28 },
  { id: 'thanjavur', name: 'Thanjavur New Bus Stand', city: 'Thanjavur', state: 'Tamil Nadu', latitude: 10.7870, longitude: 79.1378, type: 'city', facilities: ['Waiting Hall'], platforms: 22 },
  
  // Karnataka
  { id: 'bangalore-majestic', name: 'Kempegowda Bus Station (Majestic)', city: 'Bangalore', state: 'Karnataka', latitude: 12.9767, longitude: 77.5717, type: 'major', facilities: ['AC Waiting Hall', 'Food Court', 'Shopping', 'ATM'], platforms: 65 },
  { id: 'bangalore-satellite', name: 'Bangalore Satellite Bus Station', city: 'Bangalore', state: 'Karnataka', latitude: 13.0189, longitude: 77.5390, type: 'major', facilities: ['Waiting Hall', 'Food Court'], platforms: 40 },
  { id: 'mysore', name: 'Mysore Central Bus Stand', city: 'Mysore', state: 'Karnataka', latitude: 12.3051, longitude: 76.6553, type: 'major', facilities: ['AC Waiting Hall', 'Parking'], platforms: 35 },
  
  // Kerala
  { id: 'kochi-vytilla', name: 'Vytilla Mobility Hub', city: 'Kochi', state: 'Kerala', latitude: 9.9674, longitude: 76.3237, type: 'major', facilities: ['AC Waiting Hall', 'Food Court', 'Metro Connectivity'], platforms: 45 },
  { id: 'trivandrum-central', name: 'Trivandrum Central Bus Station', city: 'Thiruvananthapuram', state: 'Kerala', latitude: 8.4855, longitude: 76.9492, type: 'major', facilities: ['Waiting Hall', 'Food Court', 'Parking'], platforms: 38 },
  { id: 'calicut', name: 'Kozhikode KSRTC Bus Stand', city: 'Kozhikode', state: 'Kerala', latitude: 11.2588, longitude: 75.7804, type: 'major', facilities: ['AC Waiting Hall', 'Shopping'], platforms: 32 },
  
  // Andhra Pradesh
  { id: 'vijayawada', name: 'Pandit Nehru Bus Station (PNBS)', city: 'Vijayawada', state: 'Andhra Pradesh', latitude: 16.5193, longitude: 80.6305, type: 'major', facilities: ['AC Waiting Hall', 'Food Court', 'Shopping'], platforms: 55 },
  { id: 'tirupati', name: 'Tirupati Central Bus Stand', city: 'Tirupati', state: 'Andhra Pradesh', latitude: 13.6288, longitude: 79.4192, type: 'major', facilities: ['Waiting Hall', 'Food Stalls'], platforms: 30 },
  
  // Telangana
  { id: 'hyderabad-mgbs', name: 'Mahatma Gandhi Bus Station (MGBS)', city: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, type: 'major', facilities: ['AC Waiting Hall', 'Food Court', 'Metro Connectivity'], platforms: 72 },
  { id: 'hyderabad-jbs', name: 'Jubilee Bus Station (JBS)', city: 'Hyderabad', state: 'Telangana', latitude: 17.4419, longitude: 78.4791, type: 'major', facilities: ['Waiting Hall', 'Parking'], platforms: 40 },
  
  // Pondicherry
  { id: 'puducherry', name: 'Pondicherry Bus Stand', city: 'Puducherry', state: 'Puducherry', latitude: 11.9342, longitude: 79.8306, type: 'city', facilities: ['Waiting Hall', 'Food Stalls'], platforms: 18 }
];

// Popular Routes in Tamil Nadu & South India
export interface BusRoute {
  id: string;
  from: string;
  to: string;
  distance: number; // in km
  duration: number; // in hours
  frequency: string; // buses per day
  popular: boolean;
}

export const POPULAR_ROUTES: BusRoute[] = [
  { id: 'chn-cbe', from: 'Chennai', to: 'Coimbatore', distance: 507, duration: 8, frequency: '50+ daily', popular: true },
  { id: 'chn-mdu', from: 'Chennai', to: 'Madurai', distance: 462, duration: 7.5, frequency: '40+ daily', popular: true },
  { id: 'chn-blr', from: 'Chennai', to: 'Bangalore', distance: 346, duration: 6, frequency: '100+ daily', popular: true },
  { id: 'chn-pdy', from: 'Chennai', to: 'Pondicherry', distance: 162, duration: 3, frequency: '30+ daily', popular: true },
  { id: 'cbe-mdu', from: 'Coimbatore', to: 'Madurai', distance: 215, duration: 4, frequency: '25+ daily', popular: false },
  { id: 'cbe-blr', from: 'Coimbatore', to: 'Bangalore', distance: 362, duration: 6.5, frequency: '35+ daily', popular: true },
  { id: 'mdu-kochi', from: 'Madurai', to: 'Kochi', distance: 246, duration: 5, frequency: '20+ daily', popular: false },
  { id: 'blr-mys', from: 'Bangalore', to: 'Mysore', distance: 144, duration: 3, frequency: '60+ daily', popular: true },
];

export const CHANGELOG = [
  {
    version: '2.0.0',
    date: 'March 2026',
    features: [
      'Tamil Nadu & South India bus terminal database (25+ major terminals)',
      'Comprehensive route planner with map integration',
      'Smart travel comfort recommendations',
      'Enhanced crowd prediction with AI analytics',
      'Real-time seat availability and booking',
      'Integrated payment gateway (UPI, Cards, Google Pay)',
      'E-ticket generation with QR code',
      'Multi-city search with distance and duration',
      'Professional government-grade UI design'
    ]
  },
  {
    version: '1.0.0',
    date: 'February 2026',
    features: [
      'Live crowd tracking with real-time updates',
      'AI-based crowd prediction for next buses',
      'Interactive seat booking system',
      'Female safety indicators and SOS emergency button',
      'Multi-language support (English & Tamil)',
      'Dark mode for comfortable viewing',
      'Analytics dashboard with peak hours insights',
      'Live bus tracking on map',
      'Push notifications for low crowd alerts'
    ]
  }
];