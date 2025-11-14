import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Mail } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Confetti effect could be added here
    window.scrollTo(0, 0);
    
    // Track successful submission
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Idea Submission Success'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <CheckCircle className="w-24 h-24 text-primary relative animate-in zoom-in duration-500" />
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold">
            Thank You! 🎉
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Your idea has been successfully submitted
          </p>
        </div>

        {/* Details */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex items-start gap-3 text-left">
            <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">What happens next?</h3>
              <p className="text-sm text-muted-foreground">
                Our team will review your submission carefully. You'll receive a response via email within 24-48 hours.
              </p>
            </div>
          </div>
          
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              In the meantime, we may reach out via WhatsApp for any clarifications.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
          <Button
            onClick={() => navigate("/projects")}
            variant="outline"
            size="lg"
          >
            View Our Work
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-muted-foreground animate-in fade-in duration-700 delay-500">
          We're excited to learn more about your vision! 🚀
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
