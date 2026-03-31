import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Moon, Sun, Globe } from 'lucide-react';
import { useApp } from './AppContext';
import { Button } from './button';
import { Input } from './input';
import { Switch } from './switch';
import { APP_VERSION } from './constants';
import { api } from './api';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { translations, theme, setTheme, language, setLanguage, setSession, setMobile } = useApp();
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, updateMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [error, setError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleSendOTP = async () => {
    if (mobile.length !== 10) {
      return;
    }

    setError('');
    setIsSendingOtp(true);
    try {
      const response = await api.sendOtp(mobile);
      setMobile(mobile);
      setDemoOtp(response.otp_demo);
      setStep('otp');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      return;
    }

    setError('');
    setIsVerifyingOtp(true);
    try {
      const response = await api.verifyOtp(mobile, otp);
      setSession({ user: response.user, token: response.token });
      navigate('/home');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to verify OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <div className={`min-h-screen w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bus className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {translations.appName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLanguage} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Globe className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-6 py-12">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8`}>
          <div className="text-center mb-8">
            <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {step === 'mobile' ? translations.login : translations.verify}
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {step === 'mobile' ? translations.enterMobile : translations.enterOTP}
            </p>
          </div>

          {step === 'mobile' ? (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {translations.enterMobile}
                </label>
                <Input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={mobile}
                  onChange={(e) => updateMobile(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
              </div>
              <Button
                onClick={handleSendOTP}
                disabled={mobile.length !== 10 || isSendingOtp}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSendingOtp ? 'Sending OTP...' : translations.sendOTP}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {translations.enterOTP}
                </label>
                <Input
                  type="text"
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  OTP sent to +91 {mobile}
                </p>
                {demoOtp && (
                  <p className="text-xs mt-2 text-purple-600">
                    Demo OTP from backend: {demoOtp}
                  </p>
                )}
              </div>
              <Button
                onClick={handleVerifyOTP}
                disabled={otp.length < 4 || isVerifyingOtp}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isVerifyingOtp ? 'Verifying...' : translations.verify}
              </Button>
              <button
                onClick={() => {
                  setStep('mobile');
                  setOtp('');
                  setError('');
                }}
                className={`w-full text-sm ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}
              >
                Change Mobile Number
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Government Badge */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2">
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                🇮🇳 Government of Tamil Nadu Initiative
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p className={`text-center text-xs mt-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>

        {/* Version Info */}
        <div className="text-center mt-8">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
            Version {APP_VERSION} • Smart City Initiative
          </p>
        </div>
      </div>
    </div>
  );
}
