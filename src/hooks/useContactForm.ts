
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

emailjs.init(PUBLIC_KEY);

export const useContactForm = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", organization: "", message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitResult, setLastSubmitResult] = useState<
    { success: boolean; message: string } | null
  >(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setLastSubmitResult(null);

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

    const templateParams = {
      email:          formData.email,
      from_name:      formData.name,
      from_email:     formData.email,
      organization:   formData.organization || "Individual",
      message:        formData.message,
      reply_to:       formData.email
    };

    try {
      const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      if (res.status !== 200) throw new Error(res.text);

      toast({ 
        title: "Sent",
        description: "Thank you! We'll get back to you shortly.",
        duration: 5000 
      });
      setFormData({ name: "", email: "", organization: "", message: "" });
      setLastSubmitResult({ success: true, message: res.text });
    } catch (err: any) {
      toast({
        title: "Send failed",
        description: "Something went wrong – please try again later.",
        variant: "destructive",
        duration: 5000
      });
      setLastSubmitResult({
        success: false,
        message: "Failed to send message"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, isSubmitting, handleChange, handleSubmit, lastSubmitResult };
};
