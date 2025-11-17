import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCINSubmissionForm } from "@/hooks/useCINSubmissionForm";

const SubmitIdea = () => {
  const { formData, errors, isSubmitting, handleChange, handleContinue } = useCINSubmissionForm();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-12 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Have a Startup Idea? We'll Build Your MVP.
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Join Laxnar — we build early-stage MVPs in exchange for 10–20% equity.
            </p>
            <p className="text-sm font-medium text-primary mb-12">
              Apply With Your Idea
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-20 px-4">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleContinue} className="space-y-6">
              {/* Founder Name */}
              <div className="space-y-2">
                <Label htmlFor="founderName">Founder's Full Name *</Label>
                <Input
                  id="founderName"
                  name="founderName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.founderName}
                  onChange={handleChange}
                  className={errors.founderName ? "border-destructive" : ""}
                />
                {errors.founderName && (
                  <p className="text-sm text-destructive">{errors.founderName}</p>
                )}
              </div>

              {/* Founder Background */}
              <div className="space-y-2">
                <Label htmlFor="founderBackground">Founder's Background *</Label>
                <Textarea
                  id="founderBackground"
                  name="founderBackground"
                  placeholder="ex: Product manager, 7 yrs fintech"
                  value={formData.founderBackground}
                  onChange={handleChange}
                  className={errors.founderBackground ? "border-destructive" : ""}
                  rows={3}
                />
                {errors.founderBackground && (
                  <p className="text-sm text-destructive">{errors.founderBackground}</p>
                )}
              </div>

              {/* Business Idea */}
              <div className="space-y-2">
                <Label htmlFor="idea">One-line Business Idea *</Label>
                <Input
                  id="idea"
                  name="idea"
                  type="text"
                  placeholder="ex: AI bookkeeping for SMBs"
                  value={formData.idea}
                  onChange={handleChange}
                  className={errors.idea ? "border-destructive" : ""}
                />
                {errors.idea && (
                  <p className="text-sm text-destructive">{errors.idea}</p>
                )}
              </div>

              {/* Revenue Model */}
              <div className="space-y-2">
                <Label htmlFor="revenueModel">Revenue Model *</Label>
                <Input
                  id="revenueModel"
                  name="revenueModel"
                  type="text"
                  placeholder="ex: Subscription"
                  value={formData.revenueModel}
                  onChange={handleChange}
                  className={errors.revenueModel ? "border-destructive" : ""}
                />
                {errors.revenueModel && (
                  <p className="text-sm text-destructive">{errors.revenueModel}</p>
                )}
              </div>

              {/* USP */}
              <div className="space-y-2">
                <Label htmlFor="usp">USP (Unique Selling Point) *</Label>
                <Textarea
                  id="usp"
                  name="usp"
                  placeholder="ex: Automates GST filings"
                  value={formData.usp}
                  onChange={handleChange}
                  className={errors.usp ? "border-destructive" : ""}
                  rows={3}
                />
                {errors.usp && (
                  <p className="text-sm text-destructive">{errors.usp}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="founder@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className={errors.phone ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  Enter 10-digit mobile number without country code
                </p>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-border"
                />
                <Label htmlFor="consent" className="text-sm font-normal cursor-pointer">
                  I consent to Laxnar verifying my company details and contacting me. *
                </Label>
              </div>
              {errors.consent && (
                <p className="text-sm text-destructive">{errors.consent}</p>
              )}

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
                  <p className="text-sm text-destructive">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!formData.consent}
              >
                Continue to Step 2
              </Button>
            </form>

            {/* Trust Line */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                We only accept Registered Private Limited companies. No upfront fees — equity-based support (10–20%).
              </p>
              <p className="text-xs text-muted-foreground">
                By applying you agree to our{" "}
                <a href="/terms" className="underline hover:text-foreground">Terms</a>
                {" & "}
                <a href="/privacy" className="underline hover:text-foreground">Privacy</a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitIdea;
