
import { Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 border-t border-blue-900/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <a href="#" className="inline-block mb-6">
              <img 
                src="/lovable-uploads/3d1eeff5-f0c5-414e-91ea-fa7825776561.png" 
                alt="Laxnar AI Innovations" 
                className="h-20 w-auto" // Increased from h-16 to h-20
              />
            </a>
            <p className="text-gray-400">
              Pioneering the future of AI technology with innovative solutions for complex challenges.
            </p>
            <p className="mt-4 text-gray-400">
              Founded by Ayush Mahajan
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Solutions</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Neural Networks</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Data Intelligence</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Cybersecurity AI</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Cognitive Computing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Company</h3>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Research</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.linkedin.com/in/ayush-mahajan-19121a212/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Linkedin size={18} />
                  LinkedIn
                </a>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">GitHub</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Medium</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Laxnar AI Innovations. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
