import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Clock, Calendar, Lightbulb } from 'lucide-react';
import { useApp } from './AppContext';
import { Badge } from './badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const peakHoursData = [
  { id: 'h6', hour: '6AM', crowd: 45 },
  { id: 'h7', hour: '7AM', crowd: 72 },
  { id: 'h8', hour: '8AM', crowd: 95 },
  { id: 'h9', hour: '9AM', crowd: 88 },
  { id: 'h10', hour: '10AM', crowd: 52 },
  { id: 'h11', hour: '11AM', crowd: 38 },
  { id: 'h12', hour: '12PM', crowd: 42 },
  { id: 'h13', hour: '1PM', crowd: 48 },
  { id: 'h14', hour: '2PM', crowd: 35 },
  { id: 'h15', hour: '3PM', crowd: 40 },
  { id: 'h16', hour: '4PM', crowd: 58 },
  { id: 'h17', hour: '5PM', crowd: 78 },
  { id: 'h18', hour: '6PM', crowd: 92 },
  { id: 'h19', hour: '7PM', crowd: 85 },
  { id: 'h20', hour: '8PM', crowd: 68 },
  { id: 'h21', hour: '9PM', crowd: 45 }
];

const weeklyTrendData = [
  { id: 'd1', day: 'Mon', avgCrowd: 75 },
  { id: 'd2', day: 'Tue', avgCrowd: 78 },
  { id: 'd3', day: 'Wed', avgCrowd: 72 },
  { id: 'd4', day: 'Thu', avgCrowd: 80 },
  { id: 'd5', day: 'Fri', avgCrowd: 85 },
  { id: 'd6', day: 'Sat', avgCrowd: 65 },
  { id: 'd7', day: 'Sun', avgCrowd: 55 }
];

export default function AnalyticsScreen() {
  const navigate = useNavigate();
  const { translations, theme, bootstrap } = useApp();
  const analytics = bootstrap?.analytics;
  const peakHoursData = analytics?.peak_hours.map((item) => ({
    hour: item.hour,
    crowd: item.crowd_percentage,
  })) ?? [];
  const weeklyTrendData = analytics?.weekly_trend.map((item) => ({
    day: item.day,
    avgCrowd: item.crowd_percentage,
  })) ?? [];
  const peakHour = peakHoursData.reduce((best, current) => (current.crowd > best.crowd ? current : best), peakHoursData[0] ?? { hour: '--', crowd: 0 });

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
              {translations.analytics}
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Travel Patterns & Insights
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Peak Hour
              </span>
            </div>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {peakHour.hour}
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {peakHour.crowd}% avg crowd
            </p>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Best Time
              </span>
            </div>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {analytics?.best_travel_window ?? '--'}
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Live recommendation from backend
            </p>
          </div>
        </div>

        {/* Peak Hours Chart */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
          <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {translations.peakHours}
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Average crowd by hour (Today)
            </p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} 
                  stroke={theme === 'dark' ? '#4b5563' : '#d1d5db'}
                />
                <YAxis 
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} 
                  stroke={theme === 'dark' ? '#4b5563' : '#d1d5db'}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                  cursor={false}
                />
                <Bar dataKey="crowd" fill="#7c3aed" radius={[8, 8, 0, 0]} animationDuration={500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
          <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Weekly Trend
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Average crowd by day of week
            </p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} 
                  stroke={theme === 'dark' ? '#4b5563' : '#d1d5db'}
                />
                <YAxis 
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} 
                  stroke={theme === 'dark' ? '#4b5563' : '#d1d5db'}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                  cursor={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgCrowd" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Travel Times */}
        <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-purple-900 to-purple-800' : 'bg-gradient-to-br from-purple-500 to-purple-600'} rounded-2xl shadow-lg p-6`}>
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-1">
                {translations.bestTravelTime}
              </h2>
              <p className="text-sm text-purple-100">
                AI-powered recommendations
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Morning Travel</span>
                <Badge className="bg-green-500 text-white hover:bg-green-500">
                  Best Time
                </Badge>
              </div>
              <p className="text-purple-100 text-sm">
                6:30 AM - 7:30 AM • Low crowd expected
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Afternoon Travel</span>
                <Badge className="bg-green-500 text-white hover:bg-green-500">
                  Best Time
                </Badge>
              </div>
              <p className="text-purple-100 text-sm">
                2:00 PM - 4:00 PM • 35% avg crowd
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Avoid</span>
                <Badge className="bg-red-500 text-white hover:bg-red-500">
                  Peak Hours
                </Badge>
              </div>
              <p className="text-purple-100 text-sm">
                8:00 AM - 9:30 AM, 6:00 PM - 7:30 PM
              </p>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
          <h2 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Travel Insights
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mt-1">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Weekends are 30% less crowded
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Consider traveling on Saturday or Sunday for a more comfortable journey
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg mt-1">
                <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Peak hours shift by 30 mins
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Morning rush starts earlier on Fridays (7:30 AM vs 8:00 AM)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
