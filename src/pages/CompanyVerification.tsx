import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, InfoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CIN_REGEX = /^[A-Z0-9]{21}$/i;

const CompanyVerification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [cin, setCin] = useState("");
  const [errors, setErrors] = useState<{ companyName?: string; cin?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if step 1 data exists
    const step1Data = localStorage.getItem("laxnar_step1_data");
    if (!step1Data) {
      toast({
        title: "Please complete Step 1 first",
        description: "You need to fill the initial form",
        variant: "destructive",
      });
      navigate("/submit-idea");
      return;
    }

    // Track pixel event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Company Verification Form',
      });
    }
  }, [navigate, toast]);

  const validateForm = (): boolean => {
    const newErrors: { companyName?: string; cin?: string } = {};

    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!cin.trim()) {
      newErrors.cin = "CIN is required";
    } else if (!CIN_REGEX.test(cin.trim())) {
      newErrors.cin = "Invalid CIN format — please check.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const step1Data = localStorage.getItem("laxnar_step1_data");
    if (!step1Data) {
      toast({
        title: "Error",
        description: "Step 1 data not found. Please start again.",
        variant: "destructive",
      });
      navigate("/submit-idea");
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedStep1Data = JSON.parse(step1Data);
      
      const { data, error } = await supabase.functions.invoke('validate-and-submit', {
        body: {
          ...parsedStep1Data,
          companyName: companyName.trim(),
          cin: cin.trim().toUpperCase(),
        },
      });

      if (error) throw error;

      if (data?.ok && data?.accepted) {
        // Clear stored data
        localStorage.removeItem("laxnar_step1_data");

        toast({
          title: "Success!",
          description: "Your application has been submitted successfully.",
        });

        navigate("/thank-you");
      } else {
        const errorMsg = data?.error || "Verification failed";
        toast({
          title: "Verification Failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-12 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Step 2: Company Verification
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Verify your company details to complete your application
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-20 px-4">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Acme Labs Pvt Ltd"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (errors.companyName) {
                      setErrors((prev) => ({ ...prev, companyName: undefined }));
                    }
                  }}
                  className={errors.companyName ? "border-destructive" : ""}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName}</p>
                )}
              </div>

              {/* CIN Number */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="cin">Company CIN Number *</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">We only accept Active Private Limited companies. CIN will be verified.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="cin"
                  name="cin"
                  type="text"
                  placeholder="Enter 21-character CIN (e.g. U74999KA2020PTC012345)"
                  value={cin}
                  onChange={(e) => {
                    setCin(e.target.value);
                    if (errors.cin) {
                      setErrors((prev) => ({ ...prev, cin: undefined }));
                    }
                  }}
                  maxLength={21}
                  className={errors.cin ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  CIN required — will be validated before submission.
                </p>
                {errors.cin && (
                  <p className="text-sm text-destructive">{errors.cin}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyVerification;
