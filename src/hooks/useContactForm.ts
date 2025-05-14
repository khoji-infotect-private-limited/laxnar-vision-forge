
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
      // Get first name for personalized response
      const firstName = formData.name.split(' ')[0] || formData.name;
      
      // Initialize EmailJS with your user ID
      emailjs.init("1T87mEuZ1wmDHkeNe");
      
      console.log("Sending email with the following parameters:");
      console.log("Service ID:", "service_oeuetqc");
      console.log("Template ID:", "template_gbm2utn");
      console.log("User data:", {
        to_name: "Laxna",
        from_name: formData.name,
        first_name: firstName,
        from_email: formData.email,
        organization: formData.organization,
        message: formData.message,
        reply_to: formData.email,
      });
      
      // Send the form data using EmailJS
      const result = await emailjs.send(
        "service_oeuetqc", // Service ID
        "template_gbm2utn", // Template ID
        {
          to_name: "Laxna",
          from_name: formData.name,
          first_name: firstName,
          from_email: formData.email,
          organization: formData.organization || "Not specified",
          message: formData.message,
          reply_to: formData.email,
        },
        "1T87mEuZ1wmDHkeNe" // Public Key
      );
      
      console.log("Email sent successfully:", result);
      
      toast({
        title: "Message Sent",
        description: `Thank you ${firstName}! Your message has been sent successfully.`,
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
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, isSubmitting, handleChange, handleSubmit };
};
