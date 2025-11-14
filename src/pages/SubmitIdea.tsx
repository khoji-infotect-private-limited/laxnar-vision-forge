import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSubmissionForm } from "@/hooks/useSubmissionForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Rocket, TrendingUp } from "lucide-react";
import { useEffect } from "react";

const SubmitIdea = () => {
  const { formData, isSubmitting, handleChange, handleFileChange, handleSubmit } = useSubmissionForm();

  useEffect(() => {
    // Track page view for submit-idea page
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Submit Idea Form'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Rocket className="w-4 h-4" />
              <span className="text-sm font-medium">Turn Your Vision Into Reality</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Let's Build Something <span className="text-primary">Amazing</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Share your idea with us and take the first step towards innovation
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-2xl p-8 shadow-lg">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="h-12"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="h-12"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                type="tel"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                required
                className="h-12"
              />
            </div>

            {/* Idea Description */}
            <div className="space-y-2">
              <Label htmlFor="ideaDescription">Tell Us About Your Idea *</Label>
              <Textarea
                id="ideaDescription"
                name="ideaDescription"
                value={formData.ideaDescription}
                onChange={handleChange}
                placeholder="Describe your vision, the problem you're solving, and how you plan to make an impact..."
                required
                rows={6}
                className="resize-none"
              />
            </div>

            {/* Traction */}
            <div className="space-y-2">
              <Label htmlFor="traction" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Current Traction (Optional)
              </Label>
              <Textarea
                id="traction"
                name="traction"
                value={formData.traction}
                onChange={handleChange}
                placeholder="Users, revenue, partnerships, or any milestones achieved..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Pitch Deck Upload */}
            <div className="space-y-2">
              <Label htmlFor="pitchDeck" className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Pitch Deck (Optional)
              </Label>
              <div className="relative">
                <Input
                  id="pitchDeck"
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="h-12 cursor-pointer"
                />
                {formData.pitchDeck && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {formData.pitchDeck.name}
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, PPT, PPTX (Max 10MB)
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Your Idea"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              We'll review your submission and get back to you within 24-48 hours
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitIdea;
