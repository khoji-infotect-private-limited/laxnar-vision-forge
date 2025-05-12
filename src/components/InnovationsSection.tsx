
import { Button } from "@/components/ui/button";

const innovations = [
  {
    title: "QuantumNLP",
    category: "Natural Language Processing",
    description: "Advanced language model with contextual understanding capabilities that exceed human baselines on complex reasoning tasks.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=800",
    metrics: ["98.5% accuracy", "10B parameters", "5x faster inference"]
  },
  {
    title: "DeepVision Pro",
    category: "Computer Vision",
    description: "Real-time object detection and scene understanding system that can process and analyze visuals with unprecedented accuracy.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1200&h=800", 
    metrics: ["99.7% object recognition", "200+ fps processing", "Edge-compatible"]
  },
  {
    title: "NexusCore",
    category: "Federated Learning",
    description: "Distributed AI system that enables collaborative model training across organizations while maintaining data privacy and security.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&h=800",
    metrics: ["Zero data exposure", "90% reduced bandwidth", "Multi-platform"]
  }
];

const InnovationsSection = () => {
  return (
    <section id="innovations" className="py-24 relative circuit-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Breakthrough Innovations</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our research team continually pushes the boundaries of what's possible with artificial intelligence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-16">
          {innovations.map((innovation, index) => (
            <div 
              key={index}
              className={`flex flex-col ${
                index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } gap-8 items-center`}
            >
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl blur-md opacity-30"></div>
                  <img 
                    src={innovation.image} 
                    alt={innovation.title} 
                    className="w-full h-64 md:h-96 object-cover rounded-lg relative z-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <span className="text-blue-400 font-medium mb-2 block">{innovation.category}</span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{innovation.title}</h3>
                <p className="text-gray-300 mb-6">{innovation.description}</p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  {innovation.metrics.map((metric, idx) => (
                    <span key={idx} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {metric}
                    </span>
                  ))}
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InnovationsSection;
