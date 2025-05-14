
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

interface FormData {
  name: string;
  email: string;
  organization: string;
  message: string;
}

const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "1T87mEuZ1wmDHkeNe";
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || "service_oeuetqc";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_gbm2utn";

emailjs.init(PUBLIC_KEY);            // initialise once

export const useContactForm = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", organization: "", message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitResult, setLastSubmitResult] = useState<
    { success: boolean; message: string; errorDetail?: string } | null
  >(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setLastSubmitResult(null);

    /* ---- minimal validation ---- */
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Missing information",
              description: "Name, email and message are required.",
              variant: "destructive", duration: 5000 });
      setIsSubmitting(false);
      return;
    }

    /* ---- variables MUST match template placeholders ---- */
    const templateParams = {
      user_email:     "laxnarai25@gmail.com",   // recipient (matches {{user_email}})
      from_name:      formData.name,
      from_email:     formData.email,
      organization:   formData.organization || "Individual",
      message:        formData.message,
      reply_to:       formData.email
    };

    try {
      const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      if (res.status !== 200) throw new Error(res.text);

      toast({ title: "Message sent ✔️",
              description: "Thank you! We'll get back to you shortly.",
              duration: 5000 });
      setFormData({ name: "", email: "", organization: "", message: "" });
      setLastSubmitResult({ success: true, message: res.text });
    } catch (err: any) {
      console.error("EmailJS error →", err);

      let errorDetail: string;

      // EmailJS usually returns { status: ###, text: "..." }
      if (err && typeof err === "object" && "text" in err) {
        errorDetail = `${(err as any).status ?? "??"} – ${(err as any).text}`;
      } else {
        // Fallbacks
        try   { errorDetail = JSON.stringify(err, null, 2); }
        catch { errorDetail = String(err); }
      }

      toast({
        title: "Send failed",
        description: "Something went wrong – see details below.",
        variant: "destructive",
        duration: 5000
      });

      setLastSubmitResult({
        success: false,
        message: "API error",
        errorDetail      // ← always a plain string now
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, isSubmitting, handleChange, handleSubmit, lastSubmitResult };
};
