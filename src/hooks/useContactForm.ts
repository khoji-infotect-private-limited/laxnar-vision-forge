
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
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "1T87mEuZ1wmDHkeNe";
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || "service_oeuetqc";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_gbm2utn";

// Initialize EmailJS with public key
emailjs.init(PUBLIC_KEY);

export const useContactForm = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    organization: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;
    setIsSubmitting(true);

    /* --- simple client‑side validation --- */
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Name, email and message are required.",
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }

    /* --- parameters must exactly match your template vars --- */
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      organization: formData.organization || "Individual",
      message: formData.message,
      reply_to: formData.email,
      // The EmailJS template likely requires these fields to be specified exactly
      to_name: "Laxnar AI Support",
      to_email: "laxnarai25@gmail.com"
    };

    try {
      console.log("Sending email with params:", templateParams);
      console.log("Using SERVICE_ID:", SERVICE_ID);
      console.log("Using TEMPLATE_ID:", TEMPLATE_ID);
      console.log("Using PUBLIC_KEY:", PUBLIC_KEY);
      
      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      );

      console.log("EmailJS response:", result);

      if (result.status !== 200) throw new Error("Email sending failed");

      toast({
        title: "Message sent ✔️",
        description: "Thank you! We'll get back to you shortly.",
        duration: 5000
      });

      setFormData({ name: "", email: "", organization: "", message: "" });
    } catch (err) {
      console.error("EmailJS error →", err);
      toast({
        title: "Send failed",
        description: "Something went wrong – please try again later.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, isSubmitting, handleChange, handleSubmit };
};
