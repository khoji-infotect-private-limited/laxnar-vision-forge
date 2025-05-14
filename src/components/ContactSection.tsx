
import { useContactForm } from "@/hooks/useContactForm";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

const ContactSection = () => {
  const { formData, isSubmitting, handleChange, handleSubmit } = useContactForm();

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
          <ContactInfo />
          <ContactForm 
            formData={formData}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
