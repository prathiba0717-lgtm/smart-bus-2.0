import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, CreditCard, Smartphone, Wallet, QrCode, CheckCircle } from 'lucide-react';
import { useApp } from './AppContext';
import { api, type Bus, type SeatLayoutItem } from './api';
import { Button } from './button';
import { Badge } from './badge';
import { ImageWithFallback } from './ImageWithFallback';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog';

interface Seat {
  id: string;
  row: number;
  number: number;
  isAvailable: boolean;
  isSelected: boolean;
  type: 'window' | 'aisle';
}

type PaymentMethod = 'gpay' | 'phonepe' | 'paytm' | 'upi' | null;

export default function SeatBookingScreen() {
  const navigate = useNavigate();
  const { busNumber } = useParams<{ busNumber: string }>();
  const { translations, theme, addTicket, mobile, refreshTickets } = useApp();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [seats, setSeats] = useState<Seat[]>([]);
  const [busData, setBusData] = useState<Bus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!busNumber) {
      return;
    }

    const loadSeatData = async () => {
      setError('');
      try {
        const [bus, seatData] = await Promise.all([
          api.getBus(busNumber),
          api.getBusSeats(busNumber),
        ]);
        setBusData(bus);
        setSeats(
          seatData.seat_layout.map((seat: SeatLayoutItem) => ({
            id: seat.id,
            row: seat.row,
            number: seat.number,
            isAvailable: seat.is_available,
            isSelected: false,
            type: seat.type,
          })),
        );
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load seats');
      }
    };

    void loadSeatData();
  }, [busNumber]);

  const handleSeatClick = (seatId: string) => {
    setSeats(prevSeats =>
      prevSeats.map(seat =>
        seat.id === seatId && seat.isAvailable
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    );
  };

  const selectedSeats = seats.filter(seat => seat.isSelected);
  const farePerSeat = busData?.fare ?? 0;
  const totalFare = selectedSeats.length * farePerSeat;
  const gst = totalFare * 0.05; // 5% GST
  const finalAmount = totalFare + gst;

  const handleBooking = () => {
    if (selectedSeats.length > 0) {
      setShowPaymentDialog(true);
    }
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod || !busData || !mobile) return;

    setIsProcessing(true);
    setError('');

    try {
      const paymentMethod =
        selectedPaymentMethod === 'gpay'
          ? 'Google Pay'
          : selectedPaymentMethod === 'phonepe'
            ? 'PhonePe'
            : selectedPaymentMethod === 'paytm'
              ? 'Paytm'
              : 'UPI';

      const response = await api.createBooking({
        mobile,
        bus_number: busData.number,
        seats: selectedSeats.map((seat) => seat.number),
        payment_method: paymentMethod,
      });

      setTicketId(response.ticket.id);
      addTicket({
        id: response.ticket.id,
        busNumber: response.ticket.bus_number,
        routeName: response.ticket.route_name,
        seats: response.ticket.seats,
        amount: response.ticket.amount,
        paymentMethod: response.ticket.payment_method,
        date: response.ticket.date,
        status: response.ticket.status,
      });

      await refreshTickets(mobile);
      setPaymentSuccess(true);

      setTimeout(() => {
        setPaymentSuccess(false);
        setShowPaymentDialog(false);
        navigate('/tickets');
      }, 3000);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to complete booking');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatIndianCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  if (!busData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {error || 'Loading seat layout from FastAPI...'}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-600'} text-white shadow-lg sticky top-0 z-50`}>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-purple-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Book Seat - Bus {busData?.number ?? busNumber}</h1>
              <p className="text-sm text-purple-100">{busData?.route_name ?? 'Loading route...'}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Arrives in {busData?.arrival_minutes ?? '--'} mins</span>
            <span>Fare: ₹{busData.fare}/seat</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Bus Image */}
        <div className="mb-6">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1767949954147-c4c006b1c65f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaXR5JTIwYnVzJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczNjM1MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Bus"
              className="w-full h-48 object-cover"
            />
          </div>
        </div>

        {/* Legend */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-purple-50'} rounded-xl p-4 mb-6`}>
          <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Seat Legend</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border-2 rounded`}></div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded flex items-center justify-center`}>
                <X className="w-4 h-4 text-gray-500" />
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Occupied</span>
            </div>
          </div>
        </div>

        {/* Driver Section */}
        <div className="mb-4">
          <div className={`${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-600'} text-white text-center py-2 rounded-lg font-semibold`}>
            Driver
          </div>
        </div>

        {/* Seat Layout */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-purple-50'} rounded-2xl p-4 mb-6`}>
          <div className="space-y-3">
            {Array.from({ length: 10 }, (_, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {/* Left side seats (2 seats) */}
                <div className="flex gap-2">
                  {seats
                    .filter(seat => seat.row === rowIndex + 1)
                    .slice(0, 2)
                    .map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={!seat.isAvailable}
                        className={`w-10 h-10 rounded transition-all ${
                          seat.isSelected
                            ? 'bg-purple-600 text-white'
                            : seat.isAvailable
                            ? theme === 'dark'
                              ? 'bg-gray-700 border-2 border-gray-600 hover:border-purple-500'
                              : 'bg-white border-2 border-gray-300 hover:border-purple-500'
                            : theme === 'dark'
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gray-300 cursor-not-allowed'
                        } flex items-center justify-center text-xs font-semibold`}
                      >
                        {seat.isSelected ? <Check className="w-4 h-4" /> : seat.isAvailable ? seat.number : <X className="w-4 h-4" />}
                      </button>
                    ))}
                </div>

                {/* Aisle */}
                <div className="w-8"></div>

                {/* Right side seats (2 seats) */}
                <div className="flex gap-2">
                  {seats
                    .filter(seat => seat.row === rowIndex + 1)
                    .slice(2, 4)
                    .map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={!seat.isAvailable}
                        className={`w-10 h-10 rounded transition-all ${
                          seat.isSelected
                            ? 'bg-purple-600 text-white'
                            : seat.isAvailable
                            ? theme === 'dark'
                              ? 'bg-gray-700 border-2 border-gray-600 hover:border-purple-500'
                              : 'bg-white border-2 border-gray-300 hover:border-purple-500'
                            : theme === 'dark'
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gray-300 cursor-not-allowed'
                        } flex items-center justify-center text-xs font-semibold`}
                      >
                        {seat.isSelected ? <Check className="w-4 h-4" /> : seat.isAvailable ? seat.number : <X className="w-4 h-4" />}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Summary */}
        {selectedSeats.length > 0 && (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-purple-50'} rounded-xl p-4 mb-4`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Selected Seats:</span>
              <div className="flex gap-1 flex-wrap justify-end">
                {selectedSeats.map(seat => (
                  <Badge key={seat.id} className="bg-purple-600 text-white hover:bg-purple-600">
                    {seat.number}
                  </Badge>
                ))}
              </div>
            </div>
            <div className={`space-y-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-3`}>
              <div className="flex items-center justify-between text-sm">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Base Fare ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}):</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{formatIndianCurrency(totalFare)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>GST (5%):</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{formatIndianCurrency(gst)}</span>
              </div>
              <div className={`flex items-center justify-between border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-2`}>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Total Amount:</span>
                <span className="text-2xl font-bold text-purple-600">{formatIndianCurrency(finalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Book Button */}
        <Button
          onClick={handleBooking}
          disabled={selectedSeats.length === 0}
          className={`w-full py-6 text-base ${
            selectedSeats.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {selectedSeats.length === 0
            ? 'Select Seats to Book'
            : `Proceed to Pay ${formatIndianCurrency(finalAmount)}`}
        </Button>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} max-w-md`}>
          <DialogHeader>
            <DialogTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              {paymentSuccess ? 'Payment Successful!' : 'Choose Payment Method'}
            </DialogTitle>
            <DialogDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {paymentSuccess
                ? 'Your ticket has been generated successfully'
                : `Pay ${formatIndianCurrency(finalAmount)} to confirm your booking`}
            </DialogDescription>
          </DialogHeader>

          {paymentSuccess ? (
            <div className="py-6 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-20 h-20 text-green-500" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Ticket Confirmed!
              </h3>
              <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 mb-4`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ticket ID</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{ticketId}</p>
              </div>
              <div className={`${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-lg p-4 text-left`}>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Bus Number:</span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{busData.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Seats:</span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {selectedSeats.map(s => s.number).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Amount Paid:</span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatIndianCurrency(finalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Payment Method:</span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPaymentMethod === 'gpay' ? 'Google Pay' :
                       selectedPaymentMethod === 'phonepe' ? 'PhonePe' :
                       selectedPaymentMethod === 'paytm' ? 'Paytm' : 'UPI'}
                    </span>
                  </div>
                </div>
              </div>
              <p className={`text-xs mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Redirecting to home...
              </p>
            </div>
          ) : isProcessing ? (
            <div className="py-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
              </div>
              <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Processing Payment...
              </p>
              <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Please wait while we confirm your payment
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 py-4">
                {/* Google Pay */}
                <button
                  onClick={() => setSelectedPaymentMethod('gpay')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPaymentMethod === 'gpay'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="bg-white p-2 rounded-lg">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Google Pay</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>UPI Payment</p>
                  </div>
                  {selectedPaymentMethod === 'gpay' && (
                    <Check className="w-5 h-5 text-purple-600" />
                  )}
                </button>

                {/* PhonePe */}
                <button
                  onClick={() => setSelectedPaymentMethod('phonepe')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPaymentMethod === 'phonepe'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="bg-white p-2 rounded-lg">
                    <Wallet className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>PhonePe</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>UPI Payment</p>
                  </div>
                  {selectedPaymentMethod === 'phonepe' && (
                    <Check className="w-5 h-5 text-purple-600" />
                  )}
                </button>

                {/* Paytm */}
                <button
                  onClick={() => setSelectedPaymentMethod('paytm')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPaymentMethod === 'paytm'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="bg-white p-2 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Paytm</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Wallet & UPI</p>
                  </div>
                  {selectedPaymentMethod === 'paytm' && (
                    <Check className="w-5 h-5 text-purple-600" />
                  )}
                </button>

                {/* Other UPI */}
                <button
                  onClick={() => setSelectedPaymentMethod('upi')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPaymentMethod === 'upi'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="bg-white p-2 rounded-lg">
                    <QrCode className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Other UPI</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>BHIM, Bank UPI</p>
                  </div>
                  {selectedPaymentMethod === 'upi' && (
                    <Check className="w-5 h-5 text-purple-600" />
                  )}
                </button>
              </div>

              <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 mb-4`}>
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Amount to Pay:</span>
                  <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatIndianCurrency(finalAmount)}
                  </span>
                </div>
              </div>

              <Button
                onClick={processPayment}
                disabled={!selectedPaymentMethod}
                className={`w-full py-6 ${
                  selectedPaymentMethod
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white`}
              >
                {selectedPaymentMethod ? 'Confirm Payment' : 'Select Payment Method'}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
