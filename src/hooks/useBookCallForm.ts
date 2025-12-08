import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface BookCallFormData {
  fullName: string;
  email: string;
  phone: string;
  linkedinOrCompany: string;
  ideaOneLiner: string;
}

type FormErrors = { [key: string]: string };

export const useBookCallForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BookCallFormData>({
    fullName: "",
    email: "",
    phone: "",
    linkedinOrCompany: "",
    ideaOneLiner: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!formData.linkedinOrCompany.trim()) newErrors.linkedinOrCompany = "LinkedIn profile or company name is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[BookCall] Form submit", formData);

    if (!validateForm()) {
      console.warn("[BookCall] Validation failed", { formData, errors });
      toast.error("Please fill in the required fields");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const fbp = (window as any).fbq?.getPixelId
        ? `fb.1.${Date.now()}.${Math.random().toString(36).substring(7)}`
        : undefined;
      const fbcParam = new URLSearchParams(window.location.search).get("fbclid");
      const fbc = fbcParam ? `fb.1.${Date.now()}.${fbcParam}` : undefined;

      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Schedule");
      }

      // Map to existing edge function format
      const submissionData = {
        companyName: formData.linkedinOrCompany,
        founderName: formData.fullName,
        founderBackground: "LinkedIn Lead - Book Call",
        idea: formData.ideaOneLiner || "Discovery call requested",
        revenueModel: "TBD",
        usp: "TBD",
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        fbp,
        fbc,
      };

      console.log("[BookCall] Invoking validate-and-submit", { body: submissionData });

      const { data, error } = await supabase.functions.invoke("validate-and-submit", {
        body: submissionData,
      });

      console.log("[BookCall] validate-and-submit response", { data, error });

      if (error) throw error;

      if (data?.ok) {
        navigate("/thank-you", {
          state: {
            companyName: formData.linkedinOrCompany,
            submissionId: data.submissionId,
            isCallBooking: true,
          },
        });
      } else {
        throw new Error(data?.error || "Submission failed");
      }
    } catch (error: any) {
      console.error("[BookCall] Submission error", error);
      const errorMessage = error.message || "Something went wrong. Please try again.";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, errors, isSubmitting, handleChange, handleSubmit };
};
