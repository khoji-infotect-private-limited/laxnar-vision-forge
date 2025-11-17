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

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.consent) {
      newErrors.consent = "You must consent to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = {};

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

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.consent) {
      newErrors.consent = "You must consent to continue";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Track custom lead_step_1 event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('trackCustom', 'lead_step_1');
      }

      // Save step 1 data to localStorage
      localStorage.setItem("laxnar_step1_data", JSON.stringify({
        founderName: formData.founderName.trim(),
        founderBackground: formData.founderBackground.trim(),
        idea: formData.idea.trim(),
        revenueModel: formData.revenueModel.trim(),
        usp: formData.usp.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ''),
      }));

      navigate("/company-verification");
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleContinue,
  };
};
