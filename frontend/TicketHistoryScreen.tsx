import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket as TicketIcon, Calendar, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { useApp } from './AppContext';
import { Badge } from './badge';

export default function TicketHistoryScreen() {
  const navigate = useNavigate();
  const { translations, theme, tickets } = useApp();

  const formatIndianCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-600'} text-white shadow-lg sticky top-0 z-50`}>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-purple-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{translations.ticketHistory}</h1>
              <p className="text-sm text-purple-100">{translations.myTickets}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} mb-4`}>
              <TicketIcon className={`w-12 h-12 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {translations.noTickets}
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Book your first bus ticket to see it here
            </p>
            <button
              onClick={() => navigate('/home')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Book a Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg border-l-4 ${
                  ticket.status === 'confirmed' ? 'border-green-500' :
                  ticket.status === 'completed' ? 'border-blue-500' :
                  'border-red-500'
                }`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`${
                    ticket.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    ticket.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  } hover:${
                    ticket.status === 'confirmed' ? 'bg-green-100' :
                    ticket.status === 'completed' ? 'bg-blue-100' :
                    'bg-red-100'
                  }`}>
                    {ticket.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </Badge>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {formatDate(ticket.date)}
                  </div>
                </div>

                {/* Ticket ID */}
                <div className={`${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-lg p-3 mb-4`}>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    {translations.ticketId}
                  </p>
                  <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {ticket.id}
                  </p>
                </div>

                {/* Bus Details */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-lg`}>
                      <TicketIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Bus Number</p>
                      <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {ticket.busNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-lg`}>
                      <MapPin className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Route</p>
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {ticket.routeName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Seats</p>
                      <div className="flex gap-1 mt-1">
                        {ticket.seats.map((seat) => (
                          <Badge key={seat} className="bg-purple-600 text-white hover:bg-purple-600">
                            {seat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Amount</p>
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {formatIndianCurrency(ticket.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-700">
                    <CreditCard className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Paid via {ticket.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
