import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStep1Form } from "@/hooks/useStep1Form";
import { ArrowRight, CheckCircle, Rocket, TrendingUp } from "lucide-react";

const ApplyStep1 = () => {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useStep1Form();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fire Meta Pixel PageView
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
  }, []);

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
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" />
            <span>30-Startup Cohort Now Open</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Apply to Join the 30-Startup Cohort
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We build your tech product, assign a dedicated tech manager, and support your growth — in exchange for equity.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="p-6 bg-card rounded-lg border border-border">
            <CheckCircle className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Full Tech Build</h3>
            <p className="text-sm text-muted-foreground">Complete MVP development with modern stack</p>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border">
            <TrendingUp className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Dedicated Manager</h3>
            <p className="text-sm text-muted-foreground">Personal tech lead for your project</p>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border">
            <Rocket className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Growth Support</h3>
            <p className="text-sm text-muted-foreground">Scaling strategy and technical guidance</p>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                1
              </div>
              <h2 className="text-2xl font-bold">Basic Information</h2>
            </div>
            <p className="text-muted-foreground">Tell us about yourself and your startup idea</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
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

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Startup / Company Name *</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Your Startup Name"
                value={formData.companyName}
                onChange={handleChange}
                className={errors.companyName ? "border-destructive" : ""}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName}</p>
              )}
            </div>

            {/* Stage */}
            <div className="space-y-2">
              <Label htmlFor="stage">Stage *</Label>
              <select
                id="stage"
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className={`flex h-10 w-full rounded-md border ${
                  errors.stage ? "border-destructive" : "border-input"
                } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              >
                <option value="">Select stage</option>
                <option value="Idea Stage">Idea Stage</option>
                <option value="Registered Private Limited">Registered Private Limited</option>
                <option value="MVP Ready">MVP Ready</option>
                <option value="Generating Revenue">Generating Revenue</option>
              </select>
              {errors.stage && (
                <p className="text-sm text-destructive">{errors.stage}</p>
              )}
            </div>

            {/* Idea Description */}
            <div className="space-y-2">
              <Label htmlFor="ideaDescription">Briefly describe your tech idea *</Label>
              <Textarea
                id="ideaDescription"
                name="ideaDescription"
                placeholder="Tell us about your startup idea, the problem you're solving, and who your target customers are..."
                value={formData.ideaDescription}
                onChange={handleChange}
                rows={5}
                className={errors.ideaDescription ? "border-destructive" : ""}
              />
              {errors.ideaDescription && (
                <p className="text-sm text-destructive">{errors.ideaDescription}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full text-base font-semibold"
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  Continue to Eligibility Check
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span>Your information is secure and confidential</span>
          </div>
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
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

export default ApplyStep1;
