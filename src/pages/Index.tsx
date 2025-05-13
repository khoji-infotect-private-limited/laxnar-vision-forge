
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SolutionsSection from "@/components/SolutionsSection";
import InnovationsSection from "@/components/InnovationsSection";
import FeaturedProjectSection from "@/components/FeaturedProjectSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-laxnar-dark-blue">
      <Navbar />
      <HeroSection />
      <SolutionsSection />
      <InnovationsSection />
      <FeaturedProjectSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
