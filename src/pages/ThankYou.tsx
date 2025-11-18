import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verifiedCompanyName = location.state?.verifiedCompanyName;
  const leadType = location.state?.leadType || 'pure';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window !== 'undefined' && (window as any).fbq) {
      if (leadType === 'pure') (window as any).fbq('track', 'CompleteRegistration', { content_name: 'Pure Lead', value: 100, currency: 'USD' });
      else (window as any).fbq('track', 'lead_A', { content_name: 'Impure Lead', value: 30, currency: 'USD' });
    }
  }, [leadType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center"><CheckCircle className="w-24 h-24 text-primary animate-in zoom-in duration-500" /></div>
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold">Application Received</h1>
          {verifiedCompanyName && leadType === 'pure' && <p className="text-lg md:text-xl text-primary font-medium">{verifiedCompanyName} — Verified ✓</p>}
          <p className="text-xl md:text-2xl text-muted-foreground">{leadType === 'pure' ? "Your company is verified. We'll review your idea and contact you within 48 hours." : "We've received your application. Our team will review it and get back to you soon."}</p>
        </div>
        <Button onClick={() => navigate("/")} size="lg" className="gap-2"><Home className="w-4 h-4" />Back to Home</Button>
      </div>
    </div>
  );
};

export default ThankYou;
