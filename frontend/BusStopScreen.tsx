import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, TrendingUp } from 'lucide-react';
import { useApp } from './AppContext';
import { api, type Bus, type Stop } from './api';
import { Progress } from './progress';
import { Badge } from './badge';

export default function BusStopScreen() {
  const navigate = useNavigate();
  const { stopId } = useParams<{ stopId: string }>();
  const { translations, theme } = useApp();
  const [stop, setStop] = useState<Stop | null>(null);
  const [busesAtStop, setBusesAtStop] = useState<Bus[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!stopId) {
      return;
    }

    const loadStopData = async () => {
      try {
        const response = await api.getStopBuses(stopId);
        setStop(response.stop);
        setBusesAtStop(response.buses);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load stop details');
      }
    };

    void loadStopData();
  }, [stopId]);

  const getCrowdColor = (level: 'low' | 'medium' | 'high') => {
    if (level === 'low') return 'bg-green-500';
    if (level === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCrowdTextColor = (level: 'low' | 'medium' | 'high') => {
    if (level === 'low') return 'text-green-600 dark:text-green-400';
    if (level === 'medium') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (!stop) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 text-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {error || 'Loading stop data from FastAPI...'}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-50`}>
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
          </button>
          <div className="flex-1">
            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stop.name}
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Stop Code: {stop.code}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Stop Info Card */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-6`}>
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-xl">
              <MapPin className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className={`text-lg font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stop.name}
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                {busesAtStop.length} buses arriving
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Updates
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Crowd Comparison Chart */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-6`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Live Crowd Comparison
            </h3>
          </div>
          <div className="space-y-4">
            {busesAtStop.slice(0, 3).map((bus) => (
              <div key={bus.number}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Bus {bus.number}
                  </span>
                  <span className={`text-sm font-bold ${getCrowdTextColor(bus.crowd_level)}`}>
                    {bus.crowd_percentage}%
                  </span>
                </div>
                <Progress 
                  value={bus.crowd_percentage} 
                  className={`h-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                  indicatorClassName={getCrowdColor(bus.crowd_level)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buses at Stop */}
        <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          All Buses at This Stop
        </h2>
        <div className="space-y-3">
          {busesAtStop.map((bus) => (
            <div
              key={bus.number}
              onClick={() => navigate(`/bus/${bus.number}`)}
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {bus.number}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {bus.route_name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    <span className={`font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                      {bus.arrival_minutes}
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {translations.mins}
                    </span>
                  </div>
                </div>
              </div>

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
                </div>

              <div className="flex items-center gap-2">
                <Users className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {bus.seats_available} {translations.seatsAvailable}
                  </span>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}
