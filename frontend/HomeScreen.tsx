import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, MapPin, Clock, Users, Shield, TrendingUp, AlertCircle, Navigation, Route, Building2, BarChart3, Info, Moon, Sun, Globe, Sparkles, Ticket, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './sheet';
import { useApp } from './AppContext';
import { api } from './api';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Progress } from './progress';
import { Switch } from './switch';
import { ImageWithFallback } from './ImageWithFallback';
import { APP_VERSION } from './constants';

export default function HomeScreen() {
  const navigate = useNavigate();
  const {
    translations,
    theme,
    setTheme,
    language,
    setLanguage,
    bootstrap,
    isBootstrapping,
    bootstrapError,
    mobile,
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSOS, setShowSOS] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [sosMessage, setSosMessage] = useState('');

  const searchResults = useMemo(() => {
    if (!bootstrap || searchQuery.trim().length === 0) {
      return [];
    }

    return bootstrap.terminals.filter((terminal) =>
      terminal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      terminal.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      terminal.state.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [bootstrap, searchQuery]);

  const nearbyStops = bootstrap?.stops.slice(0, 4) ?? [];
  const upcomingBuses = bootstrap?.buses ?? [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleSearchResultClick = (terminalId: string, terminalName: string, city: string) => {
    // Navigate to route planner with the selected terminal
    navigate(`/route-planner?from=${encodeURIComponent(city)}&terminal=${terminalId}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const getCrowdColor = (level: 'low' | 'medium' | 'high') => {
    if (level === 'low') return theme === 'dark' ? 'bg-green-500' : 'bg-green-500';
    if (level === 'medium') return theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-500';
    return theme === 'dark' ? 'bg-red-500' : 'bg-red-500';
  };

  const getCrowdTextColor = (level: 'low' | 'medium' | 'high') => {
    if (level === 'low') return 'text-green-600 dark:text-green-400';
    if (level === 'medium') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const toggleLanguage = () => {
    const languageSequence: Array<'en' | 'ta' | 'te' | 'kn' | 'ml' | 'hi'> = ['en', 'ta', 'te', 'kn', 'ml', 'hi'];
    const currentIndex = languageSequence.indexOf(language as any);
    const nextIndex = (currentIndex + 1) % languageSequence.length;
    setLanguage(languageSequence[nextIndex]);
  };

  const getLanguageDisplay = () => {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'ta': 'தமிழ்',
      'te': 'తెలుగు',
      'kn': 'ಕನ್ನಡ',
      'ml': 'മലയാളം',
      'hi': 'हिंदी'
    };
    return languageNames[language];
  };

  const handleSOSClick = async () => {
    if (!mobile) {
      setSosMessage('Login first to send an SOS alert.');
      setShowSOS(true);
      setTimeout(() => setShowSOS(false), 3000);
      return;
    }

    try {
      const response = await api.createSos({
        mobile,
        message: 'Emergency assistance requested from home screen',
      });
      setSosMessage(response.message);
    } catch (error) {
      setSosMessage(error instanceof Error ? error.message : 'Unable to send SOS alert');
    }

    setShowSOS(true);
    setTimeout(() => setShowSOS(false), 3000);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-50`}>
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <Menu className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Access app features and settings</SheetDescription>
                  <div className="py-6 space-y-4 flex flex-col h-full">
                    <div>
                      <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Menu</h2>
                      <div className="space-y-3">
                        <button
                          onClick={() => navigate('/route-planner')}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <Route className="w-5 h-5 text-purple-600" />
                          <span>Route Planner</span>
                        </button>
                        <button
                          onClick={() => navigate('/terminals')}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <Building2 className="w-5 h-5 text-purple-600" />
                          <span>Bus Terminals</span>
                        </button>
                        <button
                          onClick={() => navigate('/tickets')}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <Ticket className="w-5 h-5 text-green-600" />
                          <span>{translations.ticketHistory}</span>
                        </button>
                        <button
                          onClick={() => navigate('/analytics')}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <BarChart3 className="w-5 h-5" />
                          <span>{translations.analytics}</span>
                        </button>
                        <button
                          onClick={() => navigate('/about')}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <Info className="w-5 h-5" />
                          <span>About</span>
                        </button>
                        <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <div className="flex items-center gap-3">
                            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            <span>{translations.darkMode}</span>
                          </div>
                          <Switch
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                          />
                        </div>
                        <button
                          onClick={toggleLanguage}
                          className={`w-full flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5" />
                            <span>Language</span>
                          </div>
                          <span className="text-sm font-semibold text-purple-600">{getLanguageDisplay()}</span>
                        </button>
                      </div>
                    </div>

                    {/* App Info at Bottom */}
                    <div className="mt-auto pt-6 border-t border-gray-700">
                      <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p className="text-sm font-semibold mb-1">{translations.appName}</p>
                        <p className="text-xs">Version {APP_VERSION}</p>
                        <p className="text-xs mt-2 text-purple-500">Tamil Nadu & South India</p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {translations.appName}
              </h1>
            </div>
            <Button
              onClick={handleSOSClick}
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              {translations.sos}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <Input
              type="text"
              placeholder={translations.searchDestination}
              value={searchQuery}
              onChange={handleSearchChange}
              className={`pl-10 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
            />

            {/* Search Results */}
            {showSearchResults && (
              <div className={`absolute left-0 right-0 top-full mt-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-lg max-h-96 overflow-y-auto z-50 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((terminal) => (
                      <button
                        key={terminal.id}
                        onClick={() => handleSearchResultClick(terminal.id, terminal.name, terminal.city)}
                        className={`w-full text-left p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors flex items-center gap-3`}
                      >
                        <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                          <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{terminal.name}</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{terminal.city}, {terminal.state}</p>
                        </div>
                        {terminal.type === 'major' && (
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs">Major</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      No results found for "{searchQuery}"
                    </p>
                  </div>
                )}
                <button
                  onClick={clearSearch}
                  className={`absolute top-2 right-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-600`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SOS Alert */}
      {showSOS && (
        <div className="max-w-md mx-auto px-4 mt-4">
          <div className="bg-red-600 text-white p-4 rounded-lg flex items-center gap-3 animate-pulse">
            <AlertCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">SOS Status</p>
              <p className="text-sm">{sosMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 pb-6">
        {isBootstrapping && (
          <div className="mt-4 mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Loading live data from FastAPI backend...
          </div>
        )}

        {bootstrapError && (
          <div className="mt-4 mb-4 rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
            Backend connection issue: {bootstrapError}
          </div>
        )}

        {/* Smart Features Quick Access */}
        <div className="mt-4 mb-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/route-planner')}
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-2`}
          >
            <div className="bg-purple-100 p-3 rounded-full">
              <Route className="w-6 h-6 text-purple-600" />
            </div>
            <span className={`text-sm font-semibold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Route Planner
            </span>
            <Badge className="bg-green-100 text-green-700 text-xs">Smart AI</Badge>
          </button>
          <button
            onClick={() => navigate('/terminals')}
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-2`}
          >
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className={`text-sm font-semibold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Bus Terminals
            </span>
            <Badge className="bg-blue-100 text-blue-700 text-xs">25+ Stands</Badge>
          </button>
        </div>

        {/* Map Section with Bus Image */}
        <div className="mb-6">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
            <div className="relative h-64">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1767949954147-c4c006b1c65f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaXR5JTIwYnVzJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczNjM1MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="SmartBus"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <div className="text-center text-white">
                    <MapPin className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Chennai - Koyambedu CMBT</p>
                    <p className="text-xs opacity-90 mt-1">Live Bus Tracking • Tamil Nadu</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <button className="bg-white p-2 rounded-full shadow-lg">
                  <Navigation className="w-5 h-5 text-purple-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Bus Stops */}
        <div className="mb-6">
          <h2 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {translations.nearbyBusStops}
          </h2>
          <div className="space-y-2">
            {nearbyStops.map((stop) => (
              <button
                key={stop.id}
                onClick={() => navigate(`/stop/${stop.id}`)}
                className={`w-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} rounded-xl p-4 shadow-md flex items-center justify-between transition-colors`}
              >
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stop.name}</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{stop.city}</p>
                    </div>
                  </div>
                {stop.id === 'cmbt' && (
                  <Badge className="bg-yellow-100 text-yellow-700">Major</Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Buses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {translations.upcomingBuses}
            </h2>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                AI Powered
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {upcomingBuses.map((bus) => (
              <div
                key={bus.number}
                onClick={() => navigate(`/bus/${bus.number}`)}
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow`}
              >
                {/* Bus Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{bus.number}</h3>
                      {bus.crowd_level === 'low' && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Best Choice
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{bus.route_name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <span className={`font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{bus.arrival_minutes}</span>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{translations.mins}</span>
                    </div>
                  </div>
                </div>

                {/* Crowd Level Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {translations.crowdLevel}
                    </span>
                    <span className={`text-sm font-bold ${getCrowdTextColor(bus.crowd_level)}`}>
                      {bus.crowd_level === 'low' ? translations.low : bus.crowd_level === 'medium' ? translations.medium : translations.high}
                    </span>
                  </div>
                  <Progress 
                    value={bus.crowd_percentage} 
                    className={`h-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                    indicatorClassName={getCrowdColor(bus.crowd_level)}
                  />
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {bus.passenger_count}/{bus.capacity} passengers ({bus.crowd_percentage}% full)
                  </p>
                </div>

                {/* Info Row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {bus.seats_available} {translations.seatsAvailable}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className={`w-4 h-4 ${bus.female_safety === 'safe' ? 'text-green-500' : 'text-yellow-500'}`} />
                    <span className={`text-sm ${bus.female_safety === 'safe' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {bus.female_safety === 'safe' ? translations.safe : translations.moderate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
