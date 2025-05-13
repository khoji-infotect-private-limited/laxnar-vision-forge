
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedProjectSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Featured Project</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Introducing our groundbreaking navigation technology that's changing how we navigate challenging environments.
          </p>
        </div>
        
        <div className="glass-card p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl blur-md opacity-30"></div>
              <div className="relative rounded-lg overflow-hidden aspect-video">
                <iframe
                  src="https://drive.google.com/file/d/1dbHjfdtuUVgD54zFkCgY6URapdToxP-1/preview"
                  title="Navaique - AI Navigation System"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            
            <div>
              <div className="mb-6">
                <div className="p-3 rounded-full bg-blue-900/30 border border-blue-500/20 inline-block">
                  <Navigation className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">Navaique</h3>
              <p className="text-lg text-gray-300 mb-6">
                World's first Artificial Intelligence based navigation system that doesn't need satellite communication. Perfect for GPS-restricted areas, indoor facilities, underground operations, and dense forests.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">99%</span>
                  <span className="text-gray-300">Accuracy in position tracking</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">0</span>
                  <span className="text-gray-300">Satellite dependencies</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">&lt; 50%</span>
                  <span className="text-gray-300">Cost compared to traditional systems</span>
                </div>
              </div>
              
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/projects">View Project Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full filter blur-3xl"></div>
    </section>
  );
};

export default FeaturedProjectSection;
