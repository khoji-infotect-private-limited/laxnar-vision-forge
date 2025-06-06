
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

const researchPapers = [
  {
    title: "Attention Is All You Need",
    authors: "Vaswani et al., 2017",
    journal: "NIPS 2017",
    category: "Transformer Architecture",
    description: "Foundational research that introduced the Transformer architecture, which we leverage as the core building block for our QuantumNLP language models and contextual understanding systems.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&h=800",
    metrics: ["8,000+ citations", "Transformer backbone", "Self-attention mechanism"],
    applicationInLaxnar: "Core architecture for our natural language processing models"
  },
  {
    title: "YOLO: Real-Time Object Detection",
    authors: "Redmon et al., 2016",
    journal: "CVPR 2016", 
    category: "Computer Vision",
    description: "Groundbreaking real-time object detection research that forms the foundation of our DeepVision Pro system, enabling unprecedented speed and accuracy in visual recognition tasks.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1200&h=800",
    metrics: ["Real-time detection", "Single neural network", "End-to-end training"],
    applicationInLaxnar: "Foundation for our real-time visual analysis systems"
  },
  {
    title: "Federated Learning: Collaborative Machine Learning without Centralized Training Data",
    authors: "McMahan et al., 2017",
    journal: "AISTATS 2017",
    category: "Distributed Learning",
    description: "Pioneering research in federated learning that inspired our NexusCore platform, enabling secure collaborative AI training across distributed organizations while preserving data privacy.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&h=800",
    metrics: ["Privacy-preserving", "Distributed training", "Edge computing"],
    applicationInLaxnar: "Basis for our collaborative AI training infrastructure"
  }
];

const InnovationsSection = () => {
  return (
    <section id="innovations" className="py-16 md:py-24 relative circuit-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gradient">
            Research-Driven Innovation
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            Our AI systems are built upon cutting-edge research. We leverage foundational papers to create practical, scalable solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:gap-16">
          {researchPapers.map((paper, index) => (
            <div 
              key={index}
              className={`flex flex-col ${
                index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-6 md:gap-8 items-center`}
            >
              {/* Image Section */}
              <div className="w-full lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl blur-md opacity-30"></div>
                  <img 
                    src={paper.image} 
                    alt={paper.title} 
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 object-cover rounded-lg relative z-10"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm font-medium">Research Paper</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
                <div>
                  <span className="text-blue-400 font-medium text-sm md:text-base block mb-2">
                    {paper.category} • {paper.journal}
                  </span>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 text-white leading-tight">
                    {paper.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base mb-2">
                    {paper.authors}
                  </p>
                </div>
                
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {paper.description}
                </p>
                
                {/* Metrics */}
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {paper.metrics.map((metric, idx) => (
                    <span 
                      key={idx} 
                      className="bg-blue-900/30 text-blue-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
                
                {/* Application */}
                <div className="bg-blue-950/30 border border-blue-800/30 rounded-lg p-3 md:p-4">
                  <h4 className="text-blue-400 font-semibold text-sm md:text-base mb-2">
                    Application at Laxnar AI
                  </h4>
                  <p className="text-gray-300 text-sm md:text-base">
                    {paper.applicationInLaxnar}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base">
                    <FileText className="w-4 h-4 mr-2" />
                    View Implementation
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-sm md:text-base"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Research Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12 md:mt-16">
          <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-700/30 rounded-xl p-6 md:p-8 max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
              Research Collaboration
            </h3>
            <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-6 max-w-2xl mx-auto">
              We actively collaborate with research institutions and contribute back to the AI community through open research initiatives.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base">
              Partner with Our Research Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnovationsSection;
