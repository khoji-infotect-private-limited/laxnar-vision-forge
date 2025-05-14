
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";

interface FormData {
  name: string;
  email: string;
  organization: string;
  message: string;
}

/* ----------------------------------------------------------
 * 1.  Keep secrets in .env – NOT in source control
 * ----------------------------------------------------------
 *    VITE_EMAILJS_PUBLIC_KEY   = 1T87mEuZ1wmDHkeNe
 *    VITE_EMAILJS_SERVICE_ID   = service_oeuetqc
 *    VITE_EMAILJS_TEMPLATE_ID  = template_gbm2utn
 * --------------------------------------------------------- */

const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "1T87mEuZ1wmDHkeNe";
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_oeuetqc";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_gbm2utn";

export const useContactForm = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    organization: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* -------------------------------------------------
   * Initialise EmailJS **once** when the hook mounts
   * ------------------------------------------------- */
  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  /* -----------------------------
   * Field change handler
   * ---------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* -----------------------------
   * Submit handler
   * ---------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;           // double‑click guard
    setIsSubmitting(true);

    // Simple client‑side validation
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

    /* Map EXACTLY the variables referenced in your EmailJS template.
       ⚠️ Do NOT include `to_email` or `to_name` unless you created
       those placeholders in the template's "To" field. */
    const templateParams = {
      from_name:       formData.name,
      from_email:      formData.email,
      organization:    formData.organization || "Individual",
      message:         formData.message,
      reply_to:        formData.email
    };

    try {
      console.log("Sending email with params:", templateParams);
      console.log("Using SERVICE_ID:", SERVICE_ID);
      console.log("Using TEMPLATE_ID:", TEMPLATE_ID);
      
      const { status, text }: EmailJSResponseStatus = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      );

      console.log("EmailJS response:", { status, text });
      
      if (status !== 200) throw new Error(text);

      toast({
        title: "Message sent ✔️",
        description: "Thank you! We'll get back to you shortly.",
        duration: 5000
      });

      // Reset the form
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
