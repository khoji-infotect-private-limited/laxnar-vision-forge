import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export type Step1FormData = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  stage: string;
  ideaDescription: string;
};

type FormErrors = {
  [K in keyof Step1FormData]?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useStep1Form = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Step1FormData>({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    stage: "",
    ideaDescription: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Step1FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.replace(/\D/g, "").length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.stage) {
      newErrors.stage = "Please select a stage";
    }

    if (!formData.ideaDescription.trim()) {
      newErrors.ideaDescription = "Please describe your idea";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save Step 1 data to sessionStorage for Step 2
      sessionStorage.setItem("step1Data", JSON.stringify(formData));

      // Fire Meta Pixel event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "lead_step_1",
        });
      }

      // Navigate to Step 2
      navigate("/verify-cin");
    } catch (error) {
      console.error("Error in Step 1:", error);
      setErrors({ email: "Something went wrong. Please try again." });
    } finally {
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
