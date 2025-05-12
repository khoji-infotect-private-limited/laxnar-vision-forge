
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-laxnar-dark-blue/80 shadow-md backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/3d1eeff5-f0c5-414e-91ea-fa7825776561.png" 
              alt="Laxnar AI Innovations" 
              className="h-10 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-white hover:text-blue-400 transition-colors">Home</a>
            <a href="#solutions" className="text-white hover:text-blue-400 transition-colors">Solutions</a>
            <a href="#innovations" className="text-white hover:text-blue-400 transition-colors">Innovations</a>
            <a href="#about" className="text-white hover:text-blue-400 transition-colors">About</a>
            <a href="#contact" className="text-white hover:text-blue-400 transition-colors">Contact</a>
          </nav>

          <div className="hidden md:block">
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
              Get in Touch
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-laxnar-dark-blue/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#home" 
                className="text-white hover:text-blue-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="#solutions" 
                className="text-white hover:text-blue-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Solutions
              </a>
              <a 
                href="#innovations" 
                className="text-white hover:text-blue-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Innovations
              </a>
              <a 
                href="#about" 
                className="text-white hover:text-blue-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="text-white hover:text-blue-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white w-full">
                Get in Touch
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
