
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-laxnar-dark-blue/80 shadow-md backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/4f8610eb-6b18-41eb-b5f3-6dabcc4cd82a.png" 
              alt="Laxnar AI Innovations" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-white hover:text-blue-400 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('solutions')} 
              className="text-white hover:text-blue-400 transition-colors"
            >
              Solutions
            </button>
            <button 
              onClick={() => scrollToSection('store')} 
              className="text-white hover:text-blue-400 transition-colors"
            >
              Store
            </button>
            <button 
              onClick={() => scrollToSection('innovations')} 
              className="text-white hover:text-blue-400 transition-colors"
            >
              Innovations
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-white hover:text-blue-400 transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-white hover:text-blue-400 transition-colors"
            >
              Contact
            </button>
          </nav>

          <div className="hidden md:block">
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              onClick={() => scrollToSection('contact')}
            >
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
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-white hover:text-blue-400 transition-colors py-2 text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('solutions')} 
                className="text-white hover:text-blue-400 transition-colors py-2 text-left"
              >
                Solutions
              </button>
              <button 
                onClick={() => scrollToSection('store')} 
                className="text-white hover:text-blue-400 transition-colors py-2 text-left"
              >
                Store
              </button>
              <button 
                onClick={() => scrollToSection('innovations')} 
                className="text-white hover:text-blue-400 transition-colors py-2 text-left"
              >
                Innovations
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-white hover:text-blue-400 transition-colors py-2 text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-white hover:text-blue-400 transition-colors py-2 text-left"
              >
                Contact
              </button>
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white w-full"
                onClick={() => scrollToSection('contact')}
              >
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
