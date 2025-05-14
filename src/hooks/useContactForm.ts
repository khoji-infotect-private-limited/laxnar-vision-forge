
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

interface FormData {
  name: string;
  email: string;
  organization: string;
  message: string;
}

/* ──────────────────────────────────────────────────────────
 *  ENV VARIABLES  (fallbacks only help in local dev)
 * ────────────────────────────────────────────────────────── */
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "1T87mEuZ1wmDHkeNe";
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_oeuetqc";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_gbm2utn";

// Initialize EmailJS once outside of component to prevent re-initialization
try {
  console.log("Initializing EmailJS with PUBLIC_KEY:", PUBLIC_KEY);
  emailjs.init(PUBLIC_KEY);
  console.log("EmailJS initialized successfully");
} catch (err) {
  console.error("Failed to initialize EmailJS:", err);
}

export const useContactForm = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    organization: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitResult, setLastSubmitResult] = useState<{success: boolean, message: string} | null>(null);

  /* ------------------------------------------------------
   *  Handle input / textarea changes
   * ---------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* ------------------------------------------------------
   *  Form submission
   * ---------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submission started");
    
    if (isSubmitting) {
      console.log("Submission already in progress, ignoring duplicate submission");
      return;
    }
    
    setIsSubmitting(true);
    setLastSubmitResult(null);

    /* --- simple client‑side validation --- */
    if (!formData.name || !formData.email || !formData.message) {
      const errorMsg = "Name, email and message are required.";
      console.error(errorMsg);
      toast({
        title: "Missing information",
        description: errorMsg,
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      setLastSubmitResult({success: false, message: errorMsg});
      return;
    }

    console.log("Validation passed, preparing to send email with data:", {
      name: formData.name,
      email: formData.email,
      organization: formData.organization || "Individual",
      message: formData.message.substring(0, 20) + "..." // Truncate message for logging
    });

    /* --- parameters must exactly match your template vars --- */
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      organization: formData.organization || "Individual",
      message: formData.message,
      reply_to: formData.email,
      to_name: "Laxnar AI Support",
      to_email: "laxnarai25@gmail.com"
    };

    try {
      console.log("Sending email with SERVICE_ID:", SERVICE_ID);
      console.log("Using TEMPLATE_ID:", TEMPLATE_ID);
      console.log("Template parameters:", JSON.stringify(templateParams, null, 2));
      
      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      );

      console.log("EmailJS response:", result);

      if (result.status !== 200) {
        throw new Error(`Email sending failed with status: ${result.status}`);
      }

      const successMsg = "Thank you! We'll get back to you shortly.";
      console.log("Email sent successfully:", successMsg);
      
      toast({
        title: "Message sent ✔️",
        description: successMsg,
        duration: 5000
      });

      setLastSubmitResult({success: true, message: successMsg});
      setFormData({ name: "", email: "", organization: "", message: "" });
    } catch (err) {
      console.error("EmailJS error →", err);
      
      const errorMsg = "Something went wrong – please try again later.";
      toast({
        title: "Send failed",
        description: errorMsg,
        variant: "destructive",
        duration: 5000
      });
      
      setLastSubmitResult({success: false, message: `Error: ${err instanceof Error ? err.message : String(err)}`});
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    formData, 
    isSubmitting, 
    handleChange, 
    handleSubmit,
    lastSubmitResult 
  };
};
