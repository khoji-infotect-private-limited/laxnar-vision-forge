
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Globe, Smartphone, Brain, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LaxnarStoreSection = () => {
  return (
    <section id="store" className="py-24 px-4 bg-gradient-to-r from-blue-900/10 to-purple-900/10">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Laxnar Store
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover our premium AI-powered solutions and development services tailored for your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="glass-card border-blue-900/30 hover:border-blue-500/50 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-blue-900/30 border border-blue-500/20 w-fit">
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-xl text-white">Web Development</CardTitle>
              <CardDescription className="text-gray-400">From basic websites to complex applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">₹2,000 - ₹50,000+</div>
                <p className="text-gray-300 text-sm">Starting from basic to enterprise solutions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-blue-900/30 hover:border-blue-500/50 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-blue-900/30 border border-blue-500/20 w-fit">
                <Smartphone className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-xl text-white">Android Development</CardTitle>
              <CardDescription className="text-gray-400">MVP to production-ready applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">₹4,000 - ₹80,000+</div>
                <p className="text-gray-300 text-sm">From concept to App Store ready</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-blue-900/30 hover:border-blue-500/50 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-blue-900/30 border border-blue-500/20 w-fit">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-xl text-white">AI Model Development</CardTitle>
              <CardDescription className="text-gray-400">Custom AI solutions for your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">Custom Pricing</div>
                <p className="text-gray-300 text-sm">Tailored to your specific needs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/landing">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg flex items-center gap-2 mx-auto">
              <ShoppingBag className="w-5 h-5" />
              Explore Our Services
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LaxnarStoreSection;
