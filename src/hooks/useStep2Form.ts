import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Step1FormData } from "./useStep1Form";

type Step2FormData = {
  cin: string;
  founderBackground: string;
  usp: string;
  needs: string[];
  timeline: string;
};

type FormErrors = {
  [K in keyof Step2FormData]?: string;
};

const CIN_REGEX = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

export const useStep2Form = () => {
  const navigate = useNavigate();
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);
  const [cinVerified, setCinVerified] = useState(false);
  const [verifiedCompanyName, setVerifiedCompanyName] = useState("");
  const [formData, setFormData] = useState<Step2FormData>({
    cin: "",
    founderBackground: "",
    usp: "",
    needs: [],
    timeline: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cinError, setCinError] = useState("");

  useEffect(() => {
    // Check if Step 1 data exists
    const savedData = sessionStorage.getItem("step1Data");
    if (!savedData) {
      navigate("/submit-idea");
      return;
    }
    setStep1Data(JSON.parse(savedData));
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Step2FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (need: string) => {
    setFormData((prev) => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter((n) => n !== need)
        : [...prev.needs, need],
    }));
  };

  const verifyCIN = async () => {
    if (isSubmitting) return;

    const cin = formData.cin.toUpperCase().trim();
    
    if (!CIN_REGEX.test(cin)) {
      setCinError("Please enter a valid CIN format");
      return;
    }

    setIsSubmitting(true);
    setCinError("");

    try {
      const { data, error } = await supabase.functions.invoke("validate-and-submit", {
        body: {
          cin,
          company_name: step1Data?.companyName || "",
          founder_name: step1Data?.fullName || "",
          email: step1Data?.email || "",
          phone: step1Data?.phone || "",
          founder_background: "",
          idea: step1Data?.ideaDescription || "",
          revenue_model: "",
          usp: "",
          verifyOnly: true,
        },
      });

      if (error) throw error;

      if (data.success) {
        setCinVerified(true);
        setVerifiedCompanyName(data.verifiedCompanyName);
        setCinError("");
      } else {
        setCinError(
          data.message || "We only accept Active Private Limited companies. Please verify your CIN."
        );
      }
    } catch (error) {
      console.error("CIN verification error:", error);
      setCinError("Unable to verify CIN. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateFinalForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.founderBackground.trim()) {
      newErrors.founderBackground = "Founder background is required";
    }

    if (!formData.usp.trim()) {
      newErrors.usp = "USP is required";
    }

    if (formData.needs.length === 0) {
      newErrors.needs = "Please select at least one need";
    }

    if (!formData.timeline) {
      newErrors.timeline = "Please select a timeline";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || !cinVerified) return;

    if (!validateFinalForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("validate-and-submit", {
        body: {
          cin: formData.cin.toUpperCase().trim(),
          company_name: step1Data?.companyName || "",
          founder_name: step1Data?.fullName || "",
          email: step1Data?.email || "",
          phone: step1Data?.phone || "",
          founder_background: formData.founderBackground,
          idea: step1Data?.ideaDescription || "",
          revenue_model: formData.needs.join(", "),
          usp: formData.usp,
          stage: step1Data?.stage || "",
          timeline: formData.timeline,
        },
      });

      if (error) throw error;

      if (data.success) {
        // Fire Meta Pixel conversion event
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Lead", {
            content_name: "pvt_ltd_verified_conversion",
            value: 1,
            currency: "INR",
          });
        }

        // Create access token for Thank You page
        const accessToken = crypto.randomUUID();
        sessionStorage.setItem(
          "thankYouAccess",
          JSON.stringify({
            token: accessToken,
            companyName: verifiedCompanyName,
            timestamp: Date.now(),
          })
        );

        // Clear Step 1 data
        sessionStorage.removeItem("step1Data");

        navigate("/thank-you", {
          state: {
            verifiedCompanyName,
            accessToken,
          },
        });
      } else {
        setCinError(data.message || "Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Final submission error:", error);
      setCinError("Unable to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
