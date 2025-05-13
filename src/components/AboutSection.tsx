
import { Rocket, Lightbulb, Globe, Users } from "lucide-react";

const values = [
  {
    icon: <Lightbulb className="w-8 h-8 text-blue-400" />,
    title: "Innovation",
    description: "Pushing the boundaries of what AI can accomplish through creative thinking and bold research initiatives."
  },
  {
    icon: <Globe className="w-8 h-8 text-blue-400" />,
    title: "Impact",
    description: "Developing solutions that address real-world challenges and create meaningful change on a global scale."
  },
  {
    icon: <Users className="w-8 h-8 text-blue-400" />,
    title: "Collaboration",
    description: "Working closely with partners to ensure our technologies address specific needs and deliver optimal results."
  },
  {
    icon: <Rocket className="w-8 h-8 text-blue-400" />,
    title: "Excellence",
    description: "Maintaining the highest standards in our research, development, and implementation processes."
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">About Laxnar AI Innovations</h2>
            <p className="text-lg text-gray-300 mb-6">
              Founded by <span className="font-semibold text-white">Ayush Mahajan</span> with a mission to revolutionize how organizations leverage artificial intelligence, 
              Laxnar AI Innovations designs and develops cutting-edge AI solutions for government agencies 
              and private enterprises worldwide.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              Our team of world-class AI researchers, data scientists, and engineers combines theoretical 
              expertise with practical application knowledge to create technologies that solve complex problems
              and drive organizational success.
            </p>
            <p className="text-lg text-gray-300">
              We specialize in developing proprietary deep learning models, neural networks, and machine 
              intelligence systems that can be tailored to meet the unique requirements of our clients.
            </p>
          </div>
          
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-8 text-center text-white">Our Core Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-4 p-4 rounded-full bg-blue-900/30 border border-blue-500/20">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-white">{value.title}</h4>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-blue-600/5 rounded-full filter blur-3xl"></div>
    </section>
  );
};

export default AboutSection;
