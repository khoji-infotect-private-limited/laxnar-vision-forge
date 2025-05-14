
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from 'emailjs-com';

interface FormData {
  name: string;
  email: string;
  organization: string;
  message: string;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Starting email submission process...");
      
      // Initialize EmailJS with your user ID
      console.log("Initializing EmailJS...");
      emailjs.init("1T87mEuZ1wmDHkeNe");
      console.log("EmailJS initialized successfully");
      
      console.log("Preparing to send email with the following details:");
      console.log("- Service ID:", "service_oeuetqc");
      console.log("- Template ID:", "template_gbm2utn");
      console.log("- Form data:", {
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        message: formData.message
      });
      
      // EmailJS template parameters - ensure we provide all required fields
      // The recipient email must be configured in the EmailJS dashboard/template
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        organization: formData.organization || "Not specified",
        message: formData.message,
        reply_to: formData.email,
        to_name: "Laxnar Support",
        // Add to_email explicitly to be used by EmailJS template
        to_email: "laxnarai25@gmail.com"
      };
      
      console.log("Sending with template parameters:", templateParams);
      
      // Send email using EmailJS
      const result = await emailjs.send(
        "service_oeuetqc", // Service ID
        "template_gbm2utn", // Template ID
        templateParams,
        "1T87mEuZ1wmDHkeNe" // Public Key
      );
      
      console.log("Email sent successfully:", result);
      console.log("Email status:", result.status);
      console.log("Email response text:", result.text);
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
        duration: 5000,
      });
      
      setFormData({
        name: "",
        email: "",
        organization: "",
        message: ""
      });
    } catch (error) {
      console.error('Error sending email:', error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else if (typeof error === 'object' && error !== null) {
        console.error('Error details:', JSON.stringify(error));
      }
      
      toast({
        title: "Error",
        description: "There was an error sending your message. Please check the console for details.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      console.log("Email submission process completed");
      setIsSubmitting(false);
    }
  };

  return { formData, isSubmitting, handleChange, handleSubmit };
};
