
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "lucide-react";

const projects = [
  {
    id: "navaique",
    title: "Navaique",
    description: "World's first Artificial Intelligence based navigation system that doesn't need satellite communication.",
    videoSrc: "https://drive.google.com/file/d/1dbHjfdtuUVgD54zFkCgY6URapdToxP-1/preview",
    icon: <Navigation className="w-12 h-12 text-blue-400 mb-4" />,
    features: [
      "Works in GPS restricted areas",
      "Suitable for indoor and underground facilities",
      "Navigates through dense forests",
      "99% accuracy rate",
      "More affordable than traditional navigation systems",
      "Perfect for military, firefighters, and emergency responders"
    ],
    applications: [
      "Military operations in signal-denied environments",
      "Firefighter navigation in smoke-filled buildings",
      "Underground facility exploration",
      "Deep forest expeditions",
      "Indoor navigation for large facilities"
    ]
  }
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 relative circuit-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Our Projects</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Exploring the frontiers of artificial intelligence with groundbreaking applied technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16">
          {projects.map((project) => (
            <div key={project.id} className="glass-card overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Video Section */}
                <div className="relative overflow-hidden rounded-lg">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl blur-md opacity-30"></div>
                  <div className="relative aspect-video w-full h-full">
                    <iframe
                      src={project.videoSrc}
                      title={project.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                </div>
                
                {/* Project Info */}
                <div className="flex flex-col justify-between p-6">
                  <div>
                    {project.icon}
                    <h2 className="text-3xl font-bold mb-4 text-white">{project.title}</h2>
                    <p className="text-gray-300 mb-8">{project.description}</p>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-blue-400">Key Features</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {project.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Applications Section */}
              <div className="border-t border-blue-900/30 p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Applications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.applications.map((application, index) => (
                    <Card key={index} className="bg-blue-900/20 border-blue-800/30">
                      <CardContent className="pt-6">
                        <p className="text-gray-300">{application}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-600/5 rounded-full filter blur-3xl"></div>
    </section>
  );
};

export default ProjectsSection;
