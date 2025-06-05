
import { Button } from "@/components/ui/button";
import { Shield, MapPin, Users, Zap, AlertTriangle, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const HerSafeZoneSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-rose-900/20 via-purple-900/20 to-pink-900/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-rose-400" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              HerSafeZone
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-white font-semibold mb-4">
            Real-Time Women Safety Grid Powered by AI
          </p>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            HerSafeZone is an AI-powered personal safety app designed to protect women in real-time 
            through a smart, hyperlocal emergency response system.
          </p>
        </div>

        {/* Main Content */}
        <div className="glass-card p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Features */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white mb-6">🚨 When a woman sends an SOS alert:</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-rose-900/30 rounded-full">
                    <MapPin className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">📡 Instant Location Broadcast</h4>
                    <p className="text-gray-300">Her live location is instantly broadcasted to nearby verified users running the app.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-900/30 rounded-full">
                    <Navigation className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">🧠 AI-Powered Route Mapping</h4>
                    <p className="text-gray-300">AI maps the safest routes and responders in seconds.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-pink-900/30 rounded-full">
                    <Zap className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">🔕 Smart Triggers</h4>
                    <p className="text-gray-300">Built with geofencing, silent-mode triggers, and Firebase real-time updates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual/Quote */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-pink-400 rounded-xl blur-md opacity-30"></div>
              <div className="relative bg-gradient-to-br from-rose-900/40 to-purple-900/40 p-8 rounded-xl border border-rose-500/20 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="p-4 rounded-full bg-rose-900/50 border border-rose-500/30 inline-block mb-4">
                    <Users className="w-12 h-12 text-rose-400" />
                  </div>
                </div>
                
                <blockquote className="text-xl font-semibold text-white text-center mb-6">
                  💬 "Emergency contacts are passive. HerSafeZone builds an active safety ecosystem."
                </blockquote>
                
                <p className="text-lg text-gray-300 text-center">
                  It's not just an app—it's a distributed, AI-driven movement to respond faster than traditional systems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
            <Link to="/hersafezone">Learn More About HerSafeZone</Link>
          </Button>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-rose-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-600/5 rounded-full filter blur-3xl"></div>
    </section>
  );
};

export default HerSafeZoneSection;
