import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus } from 'lucide-react';
import { useApp } from './AppContext';
import { APP_VERSION } from './constants';

export default function SplashScreen() {
  const navigate = useNavigate();
  const { translations, theme, session } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(session ? '/home' : '/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, session]);

  return (
    <div className={`h-screen w-full flex flex-col items-center justify-center ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-500 to-purple-700'
    }`}>
      {/* Bus Icon */}
      <div className="mb-8 relative">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-purple-400' : 'bg-white'} opacity-20 blur-3xl rounded-full`}></div>
        <Bus className={`w-24 h-24 ${theme === 'dark' ? 'text-purple-400' : 'text-white'} relative z-10`} strokeWidth={1.5} />
      </div>

      {/* App Name */}
      <h1 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
        {translations.appName}
      </h1>

      {/* Tagline */}
      <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-purple-100'} mb-12`}>
        {translations.tagline}
      </p>

      {/* Loading Indicator */}
      <div className="flex space-x-2">
        <div className={`w-3 h-3 ${theme === 'dark' ? 'bg-purple-400' : 'bg-white'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`w-3 h-3 ${theme === 'dark' ? 'bg-purple-400' : 'bg-white'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`w-3 h-3 ${theme === 'dark' ? 'bg-purple-400' : 'bg-white'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-purple-100'}`}>
          Tamil Nadu & South India
        </p>
        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-purple-200'}`}>
          Version {APP_VERSION} • Smart City Initiative
        </p>
      </div>
    </div>
  );
}
