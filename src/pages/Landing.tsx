import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Globe, Smartphone, Brain, CheckCircle, Star, ArrowRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `Hi! I'm interested in your services.
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service: ${formData.service}
Message: ${formData.message}`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/919140982008?text=${encodedMessage}`, '_blank');
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/919140982008', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-laxnar-dark-blue via-blue-950 to-laxnar-dark-blue">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-laxnar-dark-blue/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/4f8610eb-6b18-41eb-b5f3-6dabcc4cd82a.png" 
                alt="Laxnar AI Innovations" 
                className="h-12 w-auto"
              />
            </Link>
            <Link to="/">
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden mt-20">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/4f8610eb-6b18-41eb-b5f3-6dabcc4cd82a.png" 
              alt="Laxnar AI Innovations" 
              className="h-20 mx-auto mb-6"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient glow">
            Transform Your Business with AI-Powered Solutions
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            From web development to Android apps and custom AI models - we deliver cutting-edge technology solutions at competitive market rates with unmatched speed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              View Our Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={openWhatsApp}
              variant="outline" 
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-6 text-lg flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-gray-300">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span>Fastest Delivery in Market</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-300">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span>Competitive Pricing</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-300">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span>Custom AI Solutions</span>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-600/5 rounded-full filter blur-3xl"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Our Services & Pricing</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Professional development services tailored to your business needs with transparent pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Web Development */}
            <Card className="glass-card border-blue-900/30 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-blue-900/30 border border-blue-500/20 w-fit">
                  <Globe className="w-8 h-8 text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-white">Web Development</CardTitle>
                <CardDescription className="text-gray-400">From basic websites to complex web applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Basic to Mid-level</span>
                    <span className="text-blue-400 font-semibold">₹2,000 - ₹20,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Mid to Advanced</span>
                    <span className="text-blue-400 font-semibold">₹25,000 - ₹50,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Custom Complex</span>
                    <span className="text-blue-400 font-semibold">₹50,000+</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-4">
                  • E-commerce platforms<br/>
                  • Corporate websites<br/>
                  • Custom web applications<br/>
                  • Responsive design
                </div>
              </CardContent>
            </Card>

            {/* Android Development */}
            <Card className="glass-card border-blue-900/30 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-blue-900/30 border border-blue-500/20 w-fit">
                  <Smartphone className="w-8 h-8 text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-white">Android Development</CardTitle>
                <CardDescription className="text-gray-400">From MVP to production-ready applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Basic to Mid-level</span>
                    <span className="text-blue-400 font-semibold">₹4,000 - ₹26,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Mid to Advanced</span>
                    <span className="text-blue-400 font-semibold">₹30,000 - ₹80,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Custom Complex</span>
                    <span className="text-blue-400 font-semibold">₹80,000+</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-4">
                  • Native Android apps<br/>
                  • Business applications<br/>
                  • Social media apps<br/>
                  • E-commerce apps
                </div>
              </CardContent>
            </Card>

            {/* AI Models */}
            <Card className="glass-card border-blue-900/30 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-blue-900/30 border border-blue-500/20 w-fit">
                  <Brain className="w-8 h-8 text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-white">AI Model Development</CardTitle>
                <CardDescription className="text-gray-400">Custom AI solutions for your business needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">Custom Pricing</div>
                  <p className="text-gray-300 mb-4">Talk with us to discuss your AI requirements</p>
                  <Button 
                    onClick={openWhatsApp}
                    className="bg-green-600 hover:bg-green-700 text-white w-full flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Discuss on WhatsApp
                  </Button>
                </div>
                <div className="text-sm text-gray-400 mt-4">
                  • Machine Learning models<br/>
                  • Natural Language Processing<br/>
                  • Computer Vision<br/>
                  • Predictive Analytics
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Get Started Today</h2>
            <p className="text-lg text-gray-300">
              Ready to transform your business? Send us a message and we'll get back to you within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Send Us a Message</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill out the form and we'll send your message directly to our WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">
                        Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Service Required *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full h-10 rounded-md border border-gray-700 bg-gray-800/50 text-white px-3 py-2"
                    >
                      <option value="">Select a service</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Android Development">Android Development</option>
                      <option value="AI Model Development">AI Model Development</option>
                      <option value="Multiple Services">Multiple Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Project Details *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 min-h-[120px]"
                      placeholder="Tell us about your project requirements..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Send Message to WhatsApp
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">+91 9140982008</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">www.laxnar.ai</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Why Choose Laxnar AI?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">Fastest Delivery</h4>
                      <p className="text-gray-400 text-sm">We deliver projects faster than anyone in the market</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">Competitive Rates</h4>
                      <p className="text-gray-400 text-sm">Best prices in the market without compromising quality</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">AI Expertise</h4>
                      <p className="text-gray-400 text-sm">Our strongest point - custom AI solutions for your business</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={openWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Chat Directly on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-blue-900/20">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Ready to Start Your Project?
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who have transformed their businesses with our solutions.
          </p>
          <Button 
            onClick={openWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg flex items-center gap-2 mx-auto"
          >
            <MessageCircle className="w-5 h-5" />
            Start Your Project Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
