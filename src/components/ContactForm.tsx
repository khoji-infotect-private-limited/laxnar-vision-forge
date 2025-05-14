
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface ContactFormProps {
  formData: {
    name: string;
    email: string;
    organization: string;
    message: string;
  };
  isSubmitting: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  lastSubmitResult?: {success: boolean, message: string} | null;
}

const ContactForm = ({
  formData,
  isSubmitting,
  handleChange,
  handleSubmit,
  lastSubmitResult
}: ContactFormProps) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  useEffect(() => {
    // Log form state on mount
    console.log("ContactForm mounted with formData:", formData);
  }, [formData]);
  
  return (
    <div className="lg:col-span-2 glass-card">
      <form onSubmit={handleSubmit} className="p-8">
        <h3 className="text-2xl font-bold mb-6 text-white">Send Us a Message</h3>

        {lastSubmitResult && (
          <div className={`mb-6 p-4 rounded-md flex items-center gap-2 ${
            lastSubmitResult.success 
              ? "bg-green-900/30 text-green-200 border border-green-700" 
              : "bg-red-900/30 text-red-200 border border-red-700"
          }`}>
            {lastSubmitResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
            <p>{lastSubmitResult.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
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
          <label
            htmlFor="organization"
            className="block text-sm font-medium text-gray-200 mb-1"
          >
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
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-200 mb-1"
          >
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

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto px-8 flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
            <Send className="w-4 h-4" />
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white w-full md:w-auto"
          >
            {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
          </Button>
        </div>
        
        {showDebugInfo && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded border border-gray-700 text-xs text-gray-300 font-mono overflow-auto">
            <p className="font-semibold text-gray-200 mb-1">Debug Information:</p>
            <p>Service ID: {import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_oeuetqc"}</p>
            <p>Template ID: {import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_gbm2utn"}</p>
            <p>Form State: {isSubmitting ? "Submitting" : "Idle"}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
