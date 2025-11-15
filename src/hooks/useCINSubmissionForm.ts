import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type FormData = {
  companyName: string;
  cin: string;
  founderName: string;
  founderBackground: string;
  idea: string;
  revenueModel: string;
  usp: string;
  email: string;
  phone: string;
  consent: boolean;
};

type FormErrors = {
  [key: string]: string;
};

const CIN_REGEX = /^[A-Z0-9]{21}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useCINSubmissionForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    cin: "",
    founderName: "",
    founderBackground: "",
    idea: "",
    revenueModel: "",
    usp: "",
    email: "",
    phone: "",
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.cin.trim()) {
      newErrors.cin = "CIN is required";
    } else if (!CIN_REGEX.test(formData.cin.trim())) {
      newErrors.cin = "Invalid CIN format — please check.";
    }

    if (!formData.founderName.trim()) {
      newErrors.founderName = "Founder name is required";
    }

    if (!formData.founderBackground.trim()) {
      newErrors.founderBackground = "Founder background is required";
    }

    if (!formData.idea.trim()) {
      newErrors.idea = "Business idea is required";
    }

    if (!formData.revenueModel.trim()) {
      newErrors.revenueModel = "Revenue model is required";
    }

    if (!formData.usp.trim()) {
      newErrors.usp = "USP is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.consent) {
      newErrors.consent = "You must consent to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent duplicate submissions within 30 seconds
    const now = Date.now();
    if (now - lastSubmitTime < 30000) {
      toast({
        title: "Please wait",
        description: "You can only submit once every 30 seconds",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLastSubmitTime(now);

    try {
      const { data, error } = await supabase.functions.invoke('validate-and-submit', {
        body: {
          companyName: formData.companyName.trim(),
          cin: formData.cin.trim().toUpperCase(),
          founderName: formData.founderName.trim(),
          founderBackground: formData.founderBackground.trim(),
          idea: formData.idea.trim(),
          revenueModel: formData.revenueModel.trim(),
          usp: formData.usp.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.ok) {
        // Handle validation errors
        if (data.error) {
          setErrors({ submit: data.error });
          toast({
            title: "Validation Failed",
            description: data.error,
            variant: "destructive",
            duration: 7000,
          });
        }
        setIsSubmitting(false);
        return;
      }

      // Success - track with Facebook Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          lead_type: 'validated_cin',
          company_name: data.verifiedCompanyName,
        });
      }

      // Track with GA
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'submit_idea_validated_cin', {
          company_name: data.verifiedCompanyName,
        });
      }

      // Navigate to thank you page with company name
      navigate('/thank-you', { state: { verifiedCompanyName: data.verifiedCompanyName } });

    } catch (err: any) {
      console.error("Submission error:", err);
      setErrors({ submit: "Network error — please try again." });
      toast({
        title: "Submission failed",
        description: err.message || "Network error — please try again.",
        variant: "destructive",
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};
