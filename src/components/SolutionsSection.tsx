
import { Database, Globe, Brain, Shield, Network, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const solutions = [
  {
    icon: <BrainCircuit className="w-10 h-10 text-blue-400" />,
    title: "Advanced Neural Networks",
    description: "State-of-the-art neural network architectures designed for complex pattern recognition and decision-making processes."
  },
  {
    icon: <Database className="w-10 h-10 text-blue-400" />,
    title: "Data Intelligence Systems",
    description: "Transform massive datasets into actionable insights with our proprietary data processing algorithms."
  },
  {
    icon: <Globe className="w-10 h-10 text-blue-400" />,
    title: "Global Monitoring Solutions",
    description: "Real-time monitoring and analytics systems for global-scale operations and infrastructure."
  },
  {
    icon: <Shield className="w-10 h-10 text-blue-400" />,
    title: "Cybersecurity AI",
    description: "Predictive threat detection and advanced security measures powered by sophisticated AI models."
  },
  {
    icon: <Brain className="w-10 h-10 text-blue-400" />,
    title: "Cognitive Computing",
    description: "Systems that learn, adapt, and potentially simulate human thought processes for complex problem-solving."
  },
  {
    icon: <Network className="w-10 h-10 text-blue-400" />,
    title: "Network Optimization",
    description: "AI-driven tools to enhance network efficiency, reduce latency, and optimize data flow across systems."
  }
];

const SolutionsSection = () => {
  return (
    <section id="solutions" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Cutting-Edge AI Solutions</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We provide tailored AI solutions to address the most complex challenges faced by government agencies and private enterprises.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <div key={index} className="group">
              <Card className="bg-gray-900/50 border border-blue-900/30 hover:border-blue-500/50 transition-all duration-300 h-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-4">
                  <div className="mb-2">{solution.icon}</div>
                  <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                    {solution.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-base">
                    {solution.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full filter blur-3xl"></div>
    </section>
  );
};

export default SolutionsSection;
