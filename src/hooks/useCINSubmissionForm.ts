import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface FormData {
  companyName: string;
  founderName: string;
  founderBackground: string;
  idea: string;
  revenueModel: string;
  usp: string;
  email: string;
  phone: string;
  cinOverride?: string; // Optional CIN input
}

type FormErrors = { [key: string]: string };

export const useCINSubmissionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ companyName: "", founderName: "", founderBackground: "", idea: "", revenueModel: "", usp: "", email: "", phone: "", cinOverride: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.founderName.trim()) newErrors.founderName = "Founder name is required";
    if (!formData.founderBackground.trim()) newErrors.founderBackground = "Founder background is required";
    if (!formData.idea.trim()) newErrors.idea = "Business idea is required";
    if (!formData.revenueModel.trim()) newErrors.revenueModel = "Revenue model is required";
    if (!formData.usp.trim()) newErrors.usp = "USP is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone number must be exactly 10 digits";
    
    // Validate CIN format if provided
    if (formData.cinOverride && formData.cinOverride.trim()) {
      const cinRegex = /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
      if (!cinRegex.test(formData.cinOverride.trim())) {
        newErrors.cinOverride = "Invalid CIN format (must be 21 characters: e.g., U72900KA2020PTC123456)";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) { toast.error("Please fill in all required fields correctly"); return; }
    setIsSubmitting(true);
    setErrors({});
    try {
      const fbp = (window as any).fbq?.getPixelId ? `fb.1.${Date.now()}.${Math.random().toString(36).substring(7)}` : undefined;
      const fbc = new URLSearchParams(window.location.search).get('fbclid') ? `fb.1.${Date.now()}.${new URLSearchParams(window.location.search).get('fbclid')}` : undefined;
      if (typeof window !== 'undefined' && (window as any).fbq) (window as any).fbq('track', 'lead_step_1');
      const { data, error } = await supabase.functions.invoke('validate-and-submit', { body: { ...formData, fbp, fbc } });
      if (error) throw error;
      if (data?.ok) navigate("/thank-you", { state: { leadType: data.leadType, verifiedCompanyName: data.verifiedCompanyName || formData.companyName } });
      else throw new Error(data?.error || "Submission failed");
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to submit application. Please try again." });
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, errors, isSubmitting, handleChange, handleContinue };
};
