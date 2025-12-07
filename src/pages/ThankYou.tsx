import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const companyName = location.state?.companyName;
  const submissionId = location.state?.submissionId;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', { content_name: 'Submission', value: 50, currency: 'USD' });
    }

    // LinkedIn Insight Tag
    const linkedInPartnerId = "8383492";
    (window as any)._linkedin_data_partner_ids = (window as any)._linkedin_data_partner_ids || [];
    (window as any)._linkedin_data_partner_ids.push(linkedInPartnerId);

    if (!(window as any).lintrk) {
      (window as any).lintrk = function(a: any, b: any) {
        (window as any).lintrk.q.push([a, b]);
      };
      (window as any).lintrk.q = [];
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    document.head.appendChild(script);

    // Track conversion
    if ((window as any).lintrk) {
      (window as any).lintrk('track', { conversion_id: 21587876 });
    }

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://snap.licdn.com/li.lms-analytics/insight.min.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center"><CheckCircle className="w-24 h-24 text-primary animate-in zoom-in duration-500" /></div>
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold">Application Received</h1>
          {companyName && <p className="text-lg md:text-xl text-primary font-medium">{companyName}</p>}
          <p className="text-xl md:text-2xl text-muted-foreground">We've received your application. Our team will review it and get back to you within 48 hours.</p>
          {submissionId && <p className="text-sm text-muted-foreground">Reference ID: {submissionId.slice(0, 8)}</p>}
        </div>
        <Button onClick={() => navigate("/")} size="lg" className="gap-2"><Home className="w-4 h-4" />Back to Home</Button>
      </div>
    </div>
  );
};

export default ThankYou;
