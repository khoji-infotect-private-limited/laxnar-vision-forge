import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Mail, Clock } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifiedCompanyName, setVerifiedCompanyName] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check for valid access token
    const accessData = sessionStorage.getItem("thankYouAccess");

    if (!accessData) {
      // No token = direct access, redirect home
      navigate("/", { replace: true });
      return;
    }

    try {
      const { token, companyName, timestamp } = JSON.parse(accessData);
      const tokenFromState = location.state?.accessToken;

      // Verify token matches and is recent (within 5 minutes)
      const isValid =
        token === tokenFromState && Date.now() - timestamp < 300000;

      if (!isValid) {
        navigate("/", { replace: true });
        return;
      }

      // Valid access - clear token immediately for one-time use
      sessionStorage.removeItem("thankYouAccess");

      // Set verified company name from secure source
      setVerifiedCompanyName(companyName);

      // Fire Meta Pixel conversion event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "pvt_ltd_verified_conversion",
          value: 1,
          currency: "INR",
        });
      }
    } catch (e) {
      // Invalid token format, redirect
      navigate("/", { replace: true });
    }
  }, [navigate, location.state]);

  return (
    <div className="light-theme min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="text-2xl font-bold text-primary">
            Laxnar Venture Studio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              You're Verified!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your application has been submitted. Our team will contact you within 24–48 hours.
            </p>
            {verifiedCompanyName && (
              <p className="text-lg text-foreground">
                <strong>{verifiedCompanyName}</strong> is now part of our review queue.
              </p>
            )}
          </div>

          {/* What's Next Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">What Happens Next?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Application Review</h3>
                  <p className="text-muted-foreground">
                    Our investment team will carefully review your application, company details, and growth potential.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Initial Contact</h3>
                  <p className="text-muted-foreground">
                    Within 24-48 hours, we'll reach out via email or WhatsApp to schedule a discovery call.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Discovery Call</h3>
                  <p className="text-muted-foreground">
                    We'll discuss your vision, technical requirements, timeline, and explore how we can partner for success.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              variant="outline"
            >
              Back to Home
            </Button>
            <Button
              onClick={() => navigate("/projects")}
              size="lg"
            >
              View Our Work
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Footer Message */}
          <div className="text-center">
            <p className="text-muted-foreground">
              We're excited about the possibility of partnering with you to build something exceptional.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Laxnar Venture Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ThankYou;
