import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBookCallForm } from "@/hooks/useBookCallForm";
import { 
  Shield, 
  FileCheck, 
  Phone, 
  Handshake,
  MessageCircle,
  Search,
  Rocket,
  Lightbulb,
  Users,
  Zap,
  Heart,
  Clock,
  UserCheck,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const SubmitIdea = () => {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useBookCallForm();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, []);

  const scrollToForm = () => {
    document.getElementById('book-call-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              We Help Early-Stage Founders Turn Ideas into MVPs
              <span className="text-gradient block mt-2">— Without Upfront Development Cost</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Laxnar is a venture studio that partners with founders to design, build, and launch tech products in exchange for equity — not invoices.
            </p>
            <Button 
              size="lg" 
              onClick={scrollToForm}
              className="text-lg px-8 py-6 h-auto group"
            >
              Book a Free 15-Minute Call
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>

        {/* Trust & De-risk Section */}
        <section className="py-12 px-4 border-y border-border/50">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">We don't take your idea — you own it</span>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <FileCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">NDA available if needed</span>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">No obligation call</span>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Handshake className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">We only partner if there's a strong mutual fit</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 text-center relative">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Short Discovery Call</h3>
                <p className="text-sm text-muted-foreground">
                  A quick call to understand your idea, goals, and where you are in your journey.
                </p>
              </div>
              <div className="glass-card p-6 text-center relative">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Feasibility Review</h3>
                <p className="text-sm text-muted-foreground">
                  We assess scope, technical effort, and whether we can add real value.
                </p>
              </div>
              <div className="glass-card p-6 text-center relative">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Build Together</h3>
                <p className="text-sm text-muted-foreground">
                  If aligned, we become long-term partners and build your product on an equity basis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ideal For Section */}
        <section className="py-16 md:py-20 px-4 bg-secondary/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
              This Is a Good Fit If You…
            </h2>
            <p className="text-center text-muted-foreground mb-10 text-sm">
              If this isn't a fit, we'll tell you honestly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 glass-card">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Have a startup idea but no tech team</span>
              </div>
              <div className="flex items-start gap-3 p-4 glass-card">
                <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Are a non-technical or semi-technical founder</span>
              </div>
              <div className="flex items-start gap-3 p-4 glass-card">
                <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Want to move fast without burning cash</span>
              </div>
              <div className="flex items-start gap-3 p-4 glass-card">
                <Heart className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Are open to equity-based partnerships</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="book-call-form" className="py-16 md:py-20 px-4 scroll-mt-20">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Book Your Free 15-Minute Feasibility Call
              </h2>
              <p className="text-muted-foreground">
                No pitching. No obligation. Just clarity.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* LinkedIn or Company */}
              <div className="space-y-2">
                <Label htmlFor="linkedinOrCompany">LinkedIn Profile or Company Name *</Label>
                <Input
                  id="linkedinOrCompany"
                  name="linkedinOrCompany"
                  type="text"
                  placeholder="linkedin.com/in/johndoe or Acme Inc"
                  value={formData.linkedinOrCompany}
                  onChange={handleChange}
                  autoComplete="organization"
                  className={errors.linkedinOrCompany ? "border-destructive" : ""}
                />
                {errors.linkedinOrCompany && (
                  <p className="text-sm text-destructive">{errors.linkedinOrCompany}</p>
                )}
              </div>

              {/* Optional Idea One-liner */}
              <div className="space-y-2">
                <Label htmlFor="ideaOneLiner">
                  In one line, what are you building? 
                  <span className="text-muted-foreground ml-1">(optional)</span>
                </Label>
                <Input
                  id="ideaOneLiner"
                  name="ideaOneLiner"
                  type="text"
                  placeholder="e.g., AI-powered expense tracker for freelancers"
                  value={formData.ideaOneLiner}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Free Call"}
              </Button>

              <p className="text-xs text-center text-muted-foreground pt-2">
                No pitching. No obligation. Just clarity.
              </p>
            </form>
          </div>
        </section>

        {/* What Happens Next Section */}
        <section className="py-16 md:py-20 px-4 border-t border-border/50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              What Happens Next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">We'll review your details within 24 hours</h3>
                  <p className="text-sm text-muted-foreground">Quick turnaround so you're not left waiting.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">You'll speak directly with a venture partner</h3>
                  <p className="text-sm text-muted-foreground">Not a sales rep — someone who understands building products.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">If there's a fit, we explain next steps clearly</h3>
                  <p className="text-sm text-muted-foreground">No pressure, no hidden agendas — just honest conversation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              Ready to explore if we're a fit?
            </h2>
            <Button 
              size="lg" 
              onClick={scrollToForm}
              className="text-base px-8"
            >
              Book Your Free Call
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitIdea;
