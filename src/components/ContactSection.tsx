
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // Updated import path
import { Mail, Phone, MapPin, Send } from "lucide-react";
import emailjs from 'emailjs-com';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
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

  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Get in Touch</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Interested in our AI solutions? Contact us to discuss how we can help your organization leverage the power of artificial intelligence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 glass-card">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-blue-900/30 rounded-full">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Email</h4>
                    <p className="text-gray-300">laxnarai25@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-blue-900/30 rounded-full">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Phone</h4>
                    <p className="text-gray-300">+(91) 9140982008</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-blue-900/30 rounded-full">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Office</h4>
                    <p className="text-gray-300">
                      331 A, 1st Floor<br />
                      Mahajan Handloom<br />
                      Jhansi, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 glass-card">
            <form onSubmit={handleSubmit} className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Send Us a Message</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="organization" className="block text-sm font-medium text-gray-200 mb-1">
                  Organization
                </label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                  placeholder="Company Name"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">
                  Message <span className="text-red-400">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 min-h-[150px]"
                  placeholder="Tell us about your project or inquiry"
                />
              </div>
              
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto px-8 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
