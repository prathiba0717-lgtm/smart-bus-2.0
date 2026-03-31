import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Shield,
  Bell,
  BellOff,
  TrendingUp,
  Navigation,
  Sparkles,
  Phone,
  Video,
  AlertTriangle
} from 'lucide-react';
import { useApp } from './AppContext';
import { api, type Bus, type BusPrediction as ApiBusPrediction } from './api';
import { Button } from './button';
import { Progress } from './progress';
import { Badge } from './badge';
import { ImageWithFallback } from './ImageWithFallback';

type BusPrediction = ApiBusPrediction & {
  crowdLevel: ApiBusPrediction['crowd_level'];
  crowdPercentage: ApiBusPrediction['crowd_percentage'];
};

export default function BusDetailScreen() {
  const navigate = useNavigate();
  const { busNumber } = useParams<{ busNumber: string }>();
  const { translations, theme, mobile } = useApp();
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [busData, setBusData] = useState<Bus | null>(null);
  const [predictions, setPredictions] = useState<BusPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!busNumber) {
      return;
    }

    const loadBusData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [bus, predictionList] = await Promise.all([
          api.getBus(busNumber),
          api.getBusPredictions(busNumber),
        ]);
        setBusData(bus);
        setPredictions(
          predictionList.map((prediction) => ({
            ...prediction,
            crowdLevel: prediction.crowd_level,
            crowdPercentage: prediction.crowd_percentage,
          })),
        );
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load bus details');
      } finally {
        setIsLoading(false);
      }
    };

    void loadBusData();
  }, [busNumber]);

  const getCrowdColor = (level: 'low' | 'medium' | 'high') => {
    if (level === 'low') return 'bg-green-500';
    if (level === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCrowdBgColor = (level: 'low' | 'medium' | 'high') => {
    if (level === 'low') return theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50';
    if (level === 'medium') return theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50';
    return theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50';
  };

  const getCrowdTextColor = (level: 'low' | 'medium' | 'high') => {
    if (level === 'low') return 'text-green-600 dark:text-green-400';
    if (level === 'medium') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const toggleNotification = async () => {
    if (!busData || !mobile) {
      setError('Login first to enable low-crowd notifications.');
      return;
    }

    if (notificationEnabled) {
      setNotificationEnabled(false);
      return;
    }

    try {
      await api.createLowCrowdAlert({
        mobile,
        bus_number: busData.number,
        preferred_crowd_level: 'low',
      });
      setNotificationEnabled(true);
      setError('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to enable notifications');
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        Loading bus details from FastAPI...
      </div>
    );
  }

  if (!busData) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 text-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {error || 'Bus details are not available.'}
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
              Bus {busData.number}
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{busData.route_name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {error && <div className="rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700">{error}</div>}

        {/* Live Tracking Map */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
          <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {translations.liveTracking}
            </h2>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live
            </Badge>
          </div>
          <div className="relative h-56">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1763873732249-96ba5258b682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBjaXR5JTIwYnVzJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczNjM1MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Bus Live Tracking"
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4 w-full">
                <div className="text-center text-white">
                  <Navigation className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-semibold text-lg">{busData.current_location}</p>
                  <p className="text-sm opacity-90 mt-1">
                    {busData.stops_away} stops away
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrival Info */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
          <div className="text-center mb-4">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              {translations.estimatedArrival}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Clock className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-5xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                {busData.arrival_minutes}
              </span>
              <span className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-4`}>
                {translations.mins}
              </span>
            </div>
          </div>

          {/* Current Crowd Status */}
          <div className={`${getCrowdBgColor(busData.crowd_level)} rounded-xl p-4 mb-4`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {translations.crowdPercentage}
              </span>
              <span className={`text-2xl font-bold ${getCrowdTextColor(busData.crowd_level)}`}>
                {busData.crowd_percentage}%
              </span>
            </div>
            <Progress 
              value={busData.crowd_percentage} 
              className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              indicatorClassName={getCrowdColor(busData.crowd_level)}
            />
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-3`}>
              <Users className={`w-5 h-5 mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {translations.passengerCount}
              </p>
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {busData.passenger_count}/{busData.capacity}
              </p>
            </div>
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-3`}>
              <Shield className={`w-5 h-5 mb-2 ${busData.female_safety === 'safe' ? 'text-green-500' : 'text-yellow-500'}`} />
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {translations.femaleSafety}
              </p>
              <p className={`text-lg font-bold ${busData.female_safety === 'safe' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {busData.female_safety === 'safe' ? translations.safe : translations.moderate}
              </p>
            </div>
          </div>
        </div>

        {/* Long-Distance Travel Safety Features */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
          <div className={`px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 flex items-center gap-2`}>
            <Shield className="w-5 h-5 text-white" />
            <h2 className="font-semibold text-white">
              {translations.safetyFeatures}
            </h2>
          </div>
          <div className="p-4 space-y-3">
            <div className={`flex items-start gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className="bg-green-100 p-2 rounded-lg">
                <Video className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {translations.cctvMonitored}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  24/7 Live CCTV monitoring for passenger safety
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Navigation className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {translations.gpsTracking}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Real-time GPS tracking for family & safety monitoring
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className="bg-red-100 p-2 rounded-lg">
                <Phone className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {translations.emergencyContact}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  24x7 Emergency helpline: 1800-425-1111
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className="bg-purple-100 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Government Verified
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Licensed & verified by State Transport Authority
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Predictions */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
          <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {translations.nextBuses}
              </h2>
            </div>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
              {translations.aiPrediction}
            </Badge>
          </div>
          <div className="p-4 space-y-3">
            {predictions.map((prediction, index) => (
              <div
                key={index}
                className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {prediction.time}
                    </span>
                  </div>
                  <Badge 
                    className={`${
                      prediction.crowd_level === 'low' 
                        ? 'bg-green-100 text-green-700' 
                        : prediction.crowd_level === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    } hover:bg-opacity-100`}
                  >
                    {prediction.crowd_level === 'low' ? translations.low : prediction.crowd_level === 'medium' ? translations.medium : translations.high}
                  </Badge>
                </div>
                <div className="relative mb-2">
                  <Progress 
                    value={prediction.crowd_percentage} 
                    className={`h-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}
                    indicatorClassName={getCrowdColor(prediction.crowd_level)}
                  />
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {prediction.seats} seats • {prediction.crowdPercentage}% full
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Book Seat Button */}
        <Button
          onClick={() => navigate(`/bus/${busData.number}/book`)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-base mb-3"
        >
          Book Seat
        </Button>

        {/* Notification Button */}
        <Button
          onClick={toggleNotification}
          className={`w-full ${
            notificationEnabled
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white py-6 text-base`}
        >
          {notificationEnabled ? (
            <>
              <BellOff className="w-5 h-5 mr-2" />
              Notification Enabled ✓
            </>
          ) : (
            <>
              <Bell className="w-5 h-5 mr-2" />
              {translations.notifyLowCrowdButton}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
