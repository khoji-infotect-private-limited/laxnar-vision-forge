import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  fadeInUp,
  heroTextReveal,
  staggerContainer,
  cardHover,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/lib/animations";
import {
  Sparkles,
  ArrowRight,
  Database,
  Package,
  Zap,
  Shield,
  Download,
  Users,
  CheckCircle,
  Cpu,
  HardDrive,
  Globe,
  Smartphone,
  BookOpen,
  Store,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="font-bold text-xl">PRISM</span>
            <Badge variant="secondary" className="text-xs">by Laxnar</Badge>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#datasets" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Datasets
            </a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" asChild>
                <Link to="/app">
                  Open App
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </motion.div>

        <div className="container mx-auto max-w-5xl text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6">
              <Zap className="h-3 w-3 mr-1" />
              Deterministic AI Retrieval
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Local-First Knowledge Bundles for{" "}
            <span className="text-primary">Reproducible AI</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            PRISM enables deterministic propagation with local-first knowledge bundles. 
            Your data stays on your device. Retrieval happens offline. Results are reproducible.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" asChild>
                <Link to="/app">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Open App
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" asChild>
                <a href="#download-android">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Download Android
                </a>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="ghost" asChild>
                <Link to="/docs">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Documentation
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            {[
              { icon: Shield, text: "100% Local Processing" },
              { icon: HardDrive, text: "Offline-First" },
              { icon: CheckCircle, text: "Reproducible Results" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4 text-primary" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How PRISM Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps from knowledge to insights, all happening locally on your device.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                icon: Package,
                title: "Create Bundles",
                desc: "Import PDFs, documents, or download research dataset packs. Content is chunked and indexed locally using MS-MARCO-like passage sizing.",
              },
              {
                num: "2",
                icon: Database,
                title: "Local Retrieval",
                desc: "SQLite FTS handles full-text search. Energy-based reranking scores passages. All retrieval happens offline with deterministic results.",
              },
              {
                num: "3",
                icon: Cpu,
                title: "Grounded Responses",
                desc: "Retrieved passages ground AI responses. See exactly which sources informed each answer. Full transparency and reproducibility.",
              },
            ].map((step) => (
              <StaggerItem key={step.num}>
                <motion.div
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                >
                  <Card className="relative overflow-hidden h-full">
                    <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">
                      {step.num}
                    </div>
                    <CardContent className="pt-8 pb-6">
                      <motion.div 
                        className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <step.icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Dataset Packs */}
      <section id="datasets" className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Research Dataset Packs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download pre-built bundles from leading research datasets. 
              Mini variants for testing, full variants for production.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: "MS MARCO",
                description: "Microsoft Machine Reading Comprehension dataset for passage ranking",
                miniSize: "50 MB",
                fullSize: "8 GB",
                category: "Retrieval",
              },
              {
                name: "BEIR SciFact",
                description: "Scientific fact verification from the BEIR benchmark",
                miniSize: "10 MB",
                fullSize: "100 MB",
                category: "Scientific",
              },
              {
                name: "BEIR NFCorpus",
                description: "Nutrition and fitness corpus for health-related retrieval",
                miniSize: "5 MB",
                fullSize: "50 MB",
                category: "Health",
              },
              {
                name: "The Pile",
                description: "Large-scale diverse text corpus for language modeling",
                miniSize: "100 MB",
                fullSize: "80 GB",
                category: "General",
              },
            ].map((dataset) => (
              <StaggerItem key={dataset.name}>
                <motion.div
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                >
                  <Card className="flex flex-col h-full">
                    <CardContent className="pt-6 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">{dataset.name}</h3>
                        <Badge variant="outline">{dataset.category}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{dataset.description}</p>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Mini:</span>
                          <span className="font-medium">{dataset.miniSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Full:</span>
                          <span className="font-medium">{dataset.fullSize}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeInUp delay={0.4} className="text-center mt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="lg" asChild>
                <Link to="/app/datasets">
                  <Download className="h-5 w-5 mr-2" />
                  Browse All Datasets
                </Link>
              </Button>
            </motion.div>
          </FadeInUp>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built for Researchers & Developers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for reproducible AI research and development.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: HardDrive,
                title: "Local-First Storage",
                description: "All data stored in IndexedDB/OPFS. Works completely offline.",
              },
              {
                icon: Shield,
                title: "Privacy by Design",
                description: "Your documents never leave your device. No cloud processing.",
              },
              {
                icon: Zap,
                title: "Deterministic Results",
                description: "Same query, same bundle = same results. Every time.",
              },
              {
                icon: Store,
                title: "Bundle Marketplace",
                description: "Share and discover community-created knowledge bundles.",
              },
              {
                icon: Users,
                title: "Community Rooms",
                description: "Collaborate with others on shared knowledge bases.",
              },
              {
                icon: Globe,
                title: "Cross-Platform",
                description: "Web, Android, and desktop. Same bundles work everywhere.",
              },
            ].map((feature) => (
              <StaggerItem key={feature.title}>
                <motion.div
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <feature.icon className="h-8 w-8 text-primary mb-4" />
                      </motion.div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Android Download */}
      <section id="download-android" className="py-20 px-6">
        <FadeInUp className="container mx-auto max-w-3xl text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Smartphone className="h-16 w-16 text-primary mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">PRISM for Android</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Full native performance with energy-based reranking. 
            Same bundles sync across web and mobile.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="outline">
              <Download className="h-5 w-5 mr-2" />
              Coming Soon on Play Store
            </Button>
          </motion.div>
        </FadeInUp>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary/5">
        <FadeInUp className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Create your first knowledge bundle in minutes. No account required to explore.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" asChild>
                <Link to="/app">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Open PRISM App
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs">
                  Read Documentation
                </Link>
              </Button>
            </motion.div>
          </div>
        </FadeInUp>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold">PRISM</span>
              <span className="text-muted-foreground text-sm">by Laxnar AI</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 text-sm text-muted-foreground"
            >
              <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
              <a href="https://github.com/laxnar" className="hover:text-foreground transition-colors">GitHub</a>
              <Link to="/submit-idea" className="hover:text-foreground transition-colors">Partner with Us</Link>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            © {new Date().getFullYear()} Laxnar AI. All rights reserved.
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
