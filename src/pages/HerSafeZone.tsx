import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, MapPin, Users, Zap, AlertTriangle, Navigation, Clock, Lock, Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HerSafeZone = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for your interest in HerSafeZone! We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", organization: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-rose-400" />,
      title: "Real-Time Location Sharing",
      description: "Instant GPS broadcasting to verified responders in your vicinity"
    },
    {
      icon: <Navigation className="w-8 h-8 text-purple-400" />,
      title: "AI Route Optimization", 
      description: "Smart algorithms find the safest paths and fastest response routes"
    },
    {
      icon: <Users className="w-8 h-8 text-pink-400" />,
      title: "Verified Responder Network",
      description: "Background-checked community members ready to help"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Silent Mode Activation",
      description: "Discreet triggers for situations requiring stealth"
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-400" />,
      title: "Geofencing Technology",
      description: "Smart boundaries that trigger automatic alerts"
    },
    {
      icon: <Clock className="w-8 h-8 text-green-400" />,
      title: "Firebase Real-Time Updates",
      description: "Instant synchronization across all connected devices"
    }
  ];

  return (
    <div className="min-h-screen bg-laxnar-dark-blue">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden bg-gradient-to-br from-rose-900/20 via-purple-900/20 to-pink-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="inline-flex items-center gap-4 mb-6">
              <img 
                src="/lovable-uploads/960ce38d-cdf8-4b51-97d1-33263c0d26f3.png" 
                alt="HerSafeZone Logo" 
                className="w-20 h-20 rounded-xl"
              />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                HerSafeZone
              </h1>
            </div>
            
            <p className="text-2xl md:text-3xl text-white font-semibold mb-6">
              Real-Time Women Safety Grid Powered by AI
            </p>
            
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              An AI-powered personal safety ecosystem that transforms how women navigate the world. 
              Building active, intelligent protection through community-driven technology.
            </p>
          </div>
        </div>
        
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-rose-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-600/5 rounded-full filter blur-3xl"></div>
      </section>

      {/* Project Description */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Project Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  HerSafeZone reimagines personal safety through cutting-edge AI and community networking. 
                  Unlike traditional emergency systems that rely on distant authorities, our platform creates 
                  a hyperlocal safety grid where verified responders are always within reach.
                </p>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  The system leverages machine learning to predict risk patterns, optimize response routes, 
                  and build trust networks that grow stronger with each interaction. Every SOS alert becomes 
                  a data point that makes the entire network smarter and more responsive.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-pink-400 rounded-xl blur-md opacity-30"></div>
                <div className="relative bg-gradient-to-br from-rose-900/40 to-purple-900/40 p-6 rounded-xl border border-rose-500/20 backdrop-blur-sm">
                  <div className="text-center">
                    <Heart className="w-16 h-16 text-rose-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-4">Beyond Emergency Response</h3>
                    <p className="text-gray-300">
                      Creating a world where women feel protected by technology that understands their unique safety needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient mb-16">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-r from-rose-900/10 to-purple-900/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient mb-16">
            How It Works
          </h2>
          
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-rose-900/30 rounded-full inline-block mb-4">
                  <AlertTriangle className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">1. SOS Activation</h3>
                <p className="text-gray-300">
                  One-touch emergency activation or automatic triggers based on geofencing and behavioral patterns.
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-purple-900/30 rounded-full inline-block mb-4">
                  <MapPin className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">2. AI Response</h3>
                <p className="text-gray-300">
                  AI instantly analyzes location, identifies nearest responders, and calculates optimal response strategies.
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-pink-900/30 rounded-full inline-block mb-4">
                  <Users className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">3. Community Response</h3>
                <p className="text-gray-300">
                  Verified responders receive real-time updates and coordinate through the platform for immediate assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Collaboration Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
                Join the Movement
              </h2>
              <p className="text-lg text-gray-300">
                Interested in supporting, collaborating, or implementing HerSafeZone? Let's build safer communities together.
              </p>
            </div>
            
            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="organization" className="text-white">Organization</Label>
                  <Input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-white">Message *</Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-md text-white resize-none"
                    placeholder="Tell us about your interest in HerSafeZone..."
                  />
                </div>
                
                <div className="text-center">
                  <Button type="submit" size="lg" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HerSafeZone;
