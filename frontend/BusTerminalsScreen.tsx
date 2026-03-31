import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  MapPin,
  Building2,
  Info,
  Star,
  Navigation2,
  Filter
} from 'lucide-react';
import { useApp } from './AppContext';
import { Input } from './input';
import { Badge } from './badge';
import { Card } from './card';
import { Button } from './button';
import { SOUTH_INDIA_BUS_TERMINALS } from './constants';

export default function BusTerminalsScreen() {
  const navigate = useNavigate();
  const { theme } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');

  const states = ['all', ...Array.from(new Set(SOUTH_INDIA_BUS_TERMINALS.map(t => t.state)))];

  const filteredTerminals = SOUTH_INDIA_BUS_TERMINALS.filter(terminal => {
    const matchesSearch = 
      terminal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      terminal.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      terminal.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = selectedState === 'all' || terminal.state === selectedState;
    
    return matchesSearch && matchesState;
  });

  const openInMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-50`}>
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/home')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <ArrowLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
            </button>
            <div className="flex-1">
              <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Bus Terminals
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {filteredTerminals.length} terminals across South India
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <Input
              type="text"
              placeholder="Search by city, terminal, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* State Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Filter by State
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {states.map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedState === state
                    ? 'bg-purple-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {state === 'all' ? 'All States' : state}
              </button>
            ))}
          </div>
        </div>

        {/* Terminals List */}
        <div className="space-y-3">
          {filteredTerminals.map((terminal) => (
            <Card
              key={terminal.id}
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-4 shadow-md hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-xl ${terminal.type === 'major' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                  <Building2 className={`w-6 h-6 ${terminal.type === 'major' ? 'text-purple-600' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {terminal.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className={`w-3 h-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {terminal.city}, {terminal.state}
                        </p>
                      </div>
                    </div>
                    {terminal.type === 'major' && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>

                  {/* Terminal Info */}
                  <div className="flex items-center gap-2 mt-2 mb-3">
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      {terminal.platforms} Platforms
                    </Badge>
                    {terminal.type === 'major' && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        Major Terminal
                      </Badge>
                    )}
                  </div>

                  {/* Facilities */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {terminal.facilities.slice(0, 3).map((facility, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-0.5 rounded ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {facility}
                      </span>
                    ))}
                    {terminal.facilities.length > 3 && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        +{terminal.facilities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openInMaps(terminal.latitude, terminal.longitude, terminal.name)}
                      size="sm"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Navigation2 className="w-3 h-3 mr-1" />
                      Navigate
                    </Button>
                    <Button
                      onClick={() => navigate('/home')}
                      size="sm"
                      variant="outline"
                      className={`flex-1 ${theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}`}
                    >
                      <Info className="w-3 h-3 mr-1" />
                      Buses
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTerminals.length === 0 && (
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-8 text-center`}>
            <Building2 className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              No terminals found
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your search or filter
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
