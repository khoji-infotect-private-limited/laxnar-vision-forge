import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
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
            <Button size="sm" asChild>
              <Link to="/app">
                Open App
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge variant="outline" className="mb-6">
            <Zap className="h-3 w-3 mr-1" />
            Deterministic AI Retrieval
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Local-First Knowledge Bundles for{" "}
            <span className="text-primary">Reproducible AI</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            PRISM enables deterministic propagation with local-first knowledge bundles. 
            Your data stays on your device. Retrieval happens offline. Results are reproducible.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button size="lg" asChild>
              <Link to="/app">
                <Sparkles className="h-5 w-5 mr-2" />
                Open App
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#download-android">
                <Smartphone className="h-5 w-5 mr-2" />
                Download Android
              </a>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link to="/docs">
                <BookOpen className="h-5 w-5 mr-2" />
                Documentation
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>100% Local Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-primary" />
              <span>Offline-First</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Reproducible Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How PRISM Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps from knowledge to insights, all happening locally on your device.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">1</div>
              <CardContent className="pt-8 pb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Bundles</h3>
                <p className="text-muted-foreground">
                  Import PDFs, documents, or download research dataset packs. 
                  Content is chunked and indexed locally using MS-MARCO-like passage sizing.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">2</div>
              <CardContent className="pt-8 pb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Local Retrieval</h3>
                <p className="text-muted-foreground">
                  SQLite FTS handles full-text search. Energy-based reranking scores passages. 
                  All retrieval happens offline with deterministic results.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">3</div>
              <CardContent className="pt-8 pb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Grounded Responses</h3>
                <p className="text-muted-foreground">
                  Retrieved passages ground AI responses. See exactly which sources informed each answer. 
                  Full transparency and reproducibility.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dataset Packs */}
      <section id="datasets" className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Research Dataset Packs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download pre-built bundles from leading research datasets. 
              Mini variants for testing, full variants for production.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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
              <Card key={dataset.name} className="flex flex-col">
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
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/app/datasets">
                <Download className="h-5 w-5 mr-2" />
                Browse All Datasets
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built for Researchers & Developers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for reproducible AI research and development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Android Download */}
      <section id="download-android" className="py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <Smartphone className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">PRISM for Android</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Full native performance with energy-based reranking. 
            Same bundles sync across web and mobile.
          </p>
          <Button size="lg" variant="outline">
            <Download className="h-5 w-5 mr-2" />
            Coming Soon on Play Store
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Create your first knowledge bundle in minutes. No account required to explore.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/app">
                <Sparkles className="h-5 w-5 mr-2" />
                Open PRISM App
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/docs">
                Read Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold">PRISM</span>
              <span className="text-muted-foreground text-sm">by Laxnar AI</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
              <a href="https://github.com/laxnar" className="hover:text-foreground transition-colors">GitHub</a>
              <Link to="/submit-idea" className="hover:text-foreground transition-colors">Partner with Us</Link>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-8">
            © {new Date().getFullYear()} Laxnar AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
