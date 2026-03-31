import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  MapPin,
  Navigation,
  Clock,
  TrendingUp,
  Users,
  Bus,
  Star,
  Info,
  Sparkles,
  CheckCircle2,
  Route
} from 'lucide-react';
import { useApp } from './AppContext';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Card } from './card';
import { SOUTH_INDIA_BUS_TERMINALS, POPULAR_ROUTES, BusTerminal } from './constants';

interface SmartRecommendation {
  type: 'comfort' | 'time' | 'crowd';
  title: string;
  description: string;
  icon: any;
}

export default function RoutePlannerScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useApp();
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [selectedFrom, setSelectedFrom] = useState<BusTerminal | null>(null);
  const [selectedTo, setSelectedTo] = useState<BusTerminal | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Pre-fill from URL parameters (from HomeScreen search)
  useEffect(() => {
    const fromCity = searchParams.get('from');
    const terminalId = searchParams.get('terminal');
    
    if (fromCity && terminalId) {
      const terminal = SOUTH_INDIA_BUS_TERMINALS.find(t => t.id === terminalId);
      if (terminal) {
        setSelectedFrom(terminal);
        setFromSearch(terminal.city);
      }
    }
  }, [searchParams]);

  const filteredFromTerminals = SOUTH_INDIA_BUS_TERMINALS.filter(terminal =>
    terminal.name.toLowerCase().includes(fromSearch.toLowerCase()) ||
    terminal.city.toLowerCase().includes(fromSearch.toLowerCase()) ||
    terminal.state.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToTerminals = SOUTH_INDIA_BUS_TERMINALS.filter(terminal =>
    terminal.name.toLowerCase().includes(toSearch.toLowerCase()) ||
    terminal.city.toLowerCase().includes(toSearch.toLowerCase()) ||
    terminal.state.toLowerCase().includes(toSearch.toLowerCase())
  );

  const calculateDistance = (from: BusTerminal, to: BusTerminal) => {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (to.latitude - from.latitude) * Math.PI / 180;
    const dLon = (to.longitude - from.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(from.latitude * Math.PI / 180) * Math.cos(to.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const handleSearch = () => {
    if (selectedFrom && selectedTo) {
      setShowResults(true);
    }
  };

  const smartRecommendations: SmartRecommendation[] = [
    {
      type: 'comfort',
      title: 'Most Comfortable',
      description: 'AC Volvo with low crowd expected (32% full)',
      icon: Sparkles
    },
    {
      type: 'time',
      title: 'Fastest Route',
      description: 'Express service, arrives 45 mins earlier',
      icon: TrendingUp
    },
    {
      type: 'crowd',
      title: 'Least Crowded',
      description: 'Next bus at 10:30 AM - Only 18% full',
      icon: Users
    }
  ];

  const distance = selectedFrom && selectedTo ? calculateDistance(selectedFrom, selectedTo) : 0;
  const estimatedDuration = Math.round(distance / 60); // Rough estimate at 60 km/h

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-50`}>
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <ArrowLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
            </button>
            <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Route Planner
            </h1>
            <Badge className="ml-auto bg-purple-600 text-white">Tamil Nadu & South India</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search Section */}
        <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-4 shadow-lg`}>
          <div className="space-y-4">
            {/* From Location */}
            <div className="space-y-2">
              <label className={`text-sm font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                <MapPin className="w-4 h-4 text-green-600" />
                From
              </label>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                <Input
                  type="text"
                  placeholder="Search city or bus terminal..."
                  value={fromSearch}
                  onChange={(e) => {
                    setFromSearch(e.target.value);
                    setSelectedFrom(null);
                    setShowResults(false);
                  }}
                  className={`pl-10 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
              </div>
              {selectedFrom && (
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                  <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                    {selectedFrom.name}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedFrom.city}, {selectedFrom.state}
                  </p>
                </div>
              )}
              {fromSearch && !selectedFrom && filteredFromTerminals.length > 0 && (
                <div className={`mt-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} shadow-lg max-h-60 overflow-y-auto`}>
                  {filteredFromTerminals.slice(0, 5).map((terminal) => (
                    <button
                      key={terminal.id}
                      onClick={() => {
                        setSelectedFrom(terminal);
                        setFromSearch(terminal.name);
                      }}
                      className={`w-full p-3 text-left hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors border-b last:border-b-0 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-100'}`}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {terminal.name}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {terminal.city}, {terminal.state}
                          </p>
                          {terminal.type === 'major' && (
                            <Badge className="mt-1 bg-purple-100 text-purple-700 text-xs">Major Terminal</Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* To Location */}
            <div className="space-y-2">
              <label className={`text-sm font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                <MapPin className="w-4 h-4 text-red-600" />
                To
              </label>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                <Input
                  type="text"
                  placeholder="Search city or bus terminal..."
                  value={toSearch}
                  onChange={(e) => {
                    setToSearch(e.target.value);
                    setSelectedTo(null);
                    setShowResults(false);
                  }}
                  className={`pl-10 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
              </div>
              {selectedTo && (
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                    {selectedTo.name}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedTo.city}, {selectedTo.state}
                  </p>
                </div>
              )}
              {toSearch && !selectedTo && filteredToTerminals.length > 0 && (
                <div className={`mt-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} shadow-lg max-h-60 overflow-y-auto`}>
                  {filteredToTerminals.slice(0, 5).map((terminal) => (
                    <button
                      key={terminal.id}
                      onClick={() => {
                        setSelectedTo(terminal);
                        setToSearch(terminal.name);
                      }}
                      className={`w-full p-3 text-left hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors border-b last:border-b-0 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-100'}`}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {terminal.name}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {terminal.city}, {terminal.state}
                          </p>
                          {terminal.type === 'major' && (
                            <Badge className="mt-1 bg-purple-100 text-purple-700 text-xs">Major Terminal</Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={!selectedFrom || !selectedTo}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Route className="w-4 h-4 mr-2" />
              Search Routes
            </Button>
          </div>
        </Card>

        {/* Route Information */}
        {showResults && selectedFrom && selectedTo && (
          <>
            {/* Distance & Duration */}
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-4 shadow-lg`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Route Information
                </h3>
                <Badge className="bg-blue-100 text-blue-700">Direct</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                  <Navigation className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {distance}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>km</p>
                </div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                  <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {estimatedDuration}h
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>duration</p>
                </div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                  <Bus className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    25+
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>daily buses</p>
                </div>
              </div>
            </Card>

            {/* Smart Travel Recommendations */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Smart Travel Recommendations
                </h3>
              </div>
              <div className="space-y-3">
                {smartRecommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  return (
                    <Card
                      key={index}
                      className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${rec.type === 'comfort' ? 'bg-purple-100' : rec.type === 'time' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          <Icon className={`w-5 h-5 ${rec.type === 'comfort' ? 'text-purple-600' : rec.type === 'time' ? 'text-blue-600' : 'text-green-600'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {rec.title}
                            </h4>
                            {index === 0 && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {rec.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Recommended by AI
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Terminal Facilities */}
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-4 shadow-lg`}>
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-purple-600" />
                <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Terminal Facilities
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    At {selectedFrom.name}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFrom.facilities.map((facility, index) => (
                      <Badge key={index} className="bg-purple-100 text-purple-700">
                        {facility}
                      </Badge>
                    ))}
                    <Badge className="bg-gray-100 text-gray-700">
                      {selectedFrom.platforms} Platforms
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    At {selectedTo.name}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTo.facilities.map((facility, index) => (
                      <Badge key={index} className="bg-purple-100 text-purple-700">
                        {facility}
                      </Badge>
                    ))}
                    <Badge className="bg-gray-100 text-gray-700">
                      {selectedTo.platforms} Platforms
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* View Available Buses Button */}
            <Button
              onClick={() => navigate('/home')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              View Available Buses
            </Button>
          </>
        )}

        {/* Popular Routes */}
        {!showResults && (
          <div>
            <h3 className={`font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Popular Routes
            </h3>
            <div className="space-y-2">
              {POPULAR_ROUTES.filter(r => r.popular).map((route) => (
                <Card
                  key={route.id}
                  onClick={() => {
                    const fromTerminal = SOUTH_INDIA_BUS_TERMINALS.find(t => t.city === route.from);
                    const toTerminal = SOUTH_INDIA_BUS_TERMINALS.find(t => t.city === route.to);
                    if (fromTerminal && toTerminal) {
                      setSelectedFrom(fromTerminal);
                      setSelectedTo(toTerminal);
                      setFromSearch(fromTerminal.name);
                      setToSearch(toTerminal.name);
                      setShowResults(true);
                    }
                  }}
                  className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} p-3 shadow-md cursor-pointer transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                        <Bus className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {route.from} → {route.to}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {route.distance} km • {route.duration}h • {route.frequency}
                        </p>
                      </div>
                    </div>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
