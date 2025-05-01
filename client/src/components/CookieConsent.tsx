import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  // Check if user has already consented
  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-800 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-base font-medium text-white mb-1">Cookie Notice</h3>
          <p className="text-sm text-zinc-400">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
            By clicking "Accept All Cookies", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <Button
            onClick={() => window.location.href = '/privacy-policy'}
            variant="outline"
            className="text-xs h-9 border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            Privacy Policy
          </Button>
          <Button
            onClick={acceptCookies}
            className="bg-[#74d1ea] hover:bg-[#74d1ea]/90 text-black font-normal text-xs h-9"
          >
            Accept All Cookies
          </Button>
          <button 
            onClick={acceptCookies}
            className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
            aria-label="Close cookie notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}