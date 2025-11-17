import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStep2Form } from "@/hooks/useStep2Form";
import { CheckCircle, Shield, AlertCircle } from "lucide-react";

const VerifyCIN = () => {
  const {
    step1Data,
    cinVerified,
    verifiedCompanyName,
    formData,
    errors,
    isSubmitting,
    cinError,
    handleChange,
    handleCheckboxChange,
    verifyCIN,
    handleFinalSubmit,
  } = useStep2Form();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fire Meta Pixel PageView
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
  }, []);

  if (!step1Data) {
    return null;
  }

  const needsOptions = [
    "MVP Development",
    "Tech Manager",
    "AI App Development",
    "Funding Support",
  ];

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
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              ✓
            </div>
            <span className="ml-2 text-sm font-medium text-primary">Basic Info</span>
          </div>
          <div className="w-16 h-0.5 bg-primary"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              2
            </div>
            <span className="ml-2 text-sm font-medium">Verification</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            <span>Secure Verification</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Final Step — Verify your Company CIN
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We only accept founders of active Private Limited companies.
          </p>
        </div>

        {/* CIN Verification Form */}
        {!cinVerified ? (
          <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cin">Company Identification Number (CIN) *</Label>
                <Input
                  id="cin"
                  name="cin"
                  placeholder="U12345MH2020PTC123456"
                  value={formData.cin}
                  onChange={handleChange}
                  maxLength={21}
                  className={`uppercase ${cinError ? "border-destructive" : ""}`}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your 21-character CIN (found on incorporation certificate)
                </p>
                {cinError && (
                  <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{cinError}</p>
                  </div>
                )}
              </div>

              <Button
                type="button"
                size="lg"
                onClick={verifyCIN}
                disabled={isSubmitting || !formData.cin}
                className="w-full text-base font-semibold"
              >
                {isSubmitting ? "Verifying..." : "Verify CIN"}
              </Button>

              <div className="pt-6 border-t border-border">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>
                    We verify your company status through official government records.
                    Only Active Private Limited companies are eligible for the cohort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Extended Fields After Verification */
          <div className="space-y-8">
            {/* Verification Success */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-primary">Company Verified!</h3>
              </div>
              <p className="text-foreground">
                <strong>{verifiedCompanyName}</strong> is an active Private Limited company.
              </p>
            </div>

            {/* Final Application Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Complete Your Application</h2>
                <p className="text-muted-foreground">
                  Just a few more details to finish your application
                </p>
              </div>

              <form onSubmit={handleFinalSubmit} className="space-y-6">
                {/* Founder Background */}
                <div className="space-y-2">
                  <Label htmlFor="founderBackground">Founder's Background *</Label>
                  <Textarea
                    id="founderBackground"
                    name="founderBackground"
                    placeholder="Tell us about your professional background, expertise, and what makes you the right person to build this startup..."
                    value={formData.founderBackground}
                    onChange={handleChange}
                    rows={4}
                    className={errors.founderBackground ? "border-destructive" : ""}
                  />
                  {errors.founderBackground && (
                    <p className="text-sm text-destructive">{errors.founderBackground}</p>
                  )}
                </div>

                {/* USP */}
                <div className="space-y-2">
                  <Label htmlFor="usp">What's your Unique Selling Proposition (USP)? *</Label>
                  <Textarea
                    id="usp"
                    name="usp"
                    placeholder="What makes your solution different from existing alternatives? Why will customers choose you?"
                    value={formData.usp}
                    onChange={handleChange}
                    rows={4}
                    className={errors.usp ? "border-destructive" : ""}
                  />
                  {errors.usp && (
                    <p className="text-sm text-destructive">{errors.usp}</p>
                  )}
                </div>

                {/* Needs */}
                <div className="space-y-3">
                  <Label>What do you need right now? *</Label>
                  <div className="space-y-2">
                    {needsOptions.map((need) => (
                      <label
                        key={need}
                        className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.needs.includes(need)}
                          onChange={() => handleCheckboxChange(need)}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm font-medium">{need}</span>
                      </label>
                    ))}
                  </div>
                  {errors.needs && (
                    <p className="text-sm text-destructive">{errors.needs}</p>
                  )}
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline Expectation *</Label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border ${
                      errors.timeline ? "border-destructive" : "border-input"
                    } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                  >
                    <option value="">Select expected timeline</option>
                    <option value="0-3 months">0-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="12+ months">12+ months</option>
                  </select>
                  {errors.timeline && (
                    <p className="text-sm text-destructive">{errors.timeline}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full text-base font-semibold"
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span>Your information is secure and confidential</span>
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

export default VerifyCIN;
