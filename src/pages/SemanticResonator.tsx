import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, FileText, Mail, Zap, Database, Clock, Shield } from "lucide-react";

const SemanticResonator = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SR</span>
              </div>
              <span className="font-semibold text-lg">Semantic Resonator</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <button onClick={() => scrollToSection("problem")} className="text-gray-400 hover:text-white transition-colors">Problem</button>
              <button onClick={() => scrollToSection("solution")} className="text-gray-400 hover:text-white transition-colors">Solution</button>
              <button onClick={() => scrollToSection("benchmarks")} className="text-gray-400 hover:text-white transition-colors">Benchmarks</button>
              <button onClick={() => scrollToSection("research")} className="text-gray-400 hover:text-white transition-colors">Research</button>
              <a href="#paper" className="text-red-400 hover:text-red-300 transition-colors">Paper</a>
              <a href="mailto:contact@laxnar.ai" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Subtle geometric background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Language AI<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">without attention.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-4">
              Meaning from geometry. Not attention.
            </p>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              The Semantic Resonator: a non-transformer architecture with <span className="text-white">constant memory</span> and <span className="text-white">competitive throughput</span>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
                <a href="#paper">
                  <FileText className="mr-2 h-5 w-5" />
                  Read the paper
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-6 text-lg"
                onClick={() => scrollToSection("benchmarks")}
              >
                <ArrowDown className="mr-2 h-5 w-5" />
                See the benchmarks
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-gray-600" />
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Transformers hit a wall.
            </h2>
            <div className="space-y-4 text-lg text-gray-400">
              <p>
                Attention is <span className="text-red-400 font-mono">O(N²)</span>. Double the sequence, <span className="text-white">quadruple the cost</span>.
              </p>
              <ul className="space-y-3 list-none">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>$200B+ in AI compute projected by 2030</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Memory and cost scale with context length</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Longer contexts = exponentially more resources</span>
                </li>
              </ul>
              <p className="pt-4 text-xl text-white font-medium">
                "Double your input, quadruple your cost."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Semantic Resonator.
            </h2>
            <div className="space-y-6 text-lg text-gray-400">
              <p>
                <span className="text-white">No attention matrices.</span> Tokens map to 288-point geometric signatures on a fixed 3-field lattice (3,072 coordinates).
              </p>
              <p>
                "Resonance" gates how information flows. Meaning emerges from <span className="text-red-400">geometry</span>, not attention.
              </p>
              <div className="py-6">
                <div className="inline-block bg-[#1a1a24] border border-white/10 rounded-lg px-6 py-4">
                  <span className="text-gray-500 text-sm">Complexity:</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-mono font-bold text-red-400">O(N×K)</span>
                    <span className="text-gray-500">where K is constant</span>
                  </div>
                  <span className="text-gray-600 text-sm">Not O(N²)</span>
                </div>
              </div>
              <blockquote className="border-l-4 border-red-500 pl-6 py-2 text-xl text-white italic">
                "No attention matrices. No quadratic scaling. Just geometric resonance."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Benchmarks Section */}
      <section id="benchmarks" className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Benchmarked.
            </h2>
            <p className="text-gray-500 mb-12">
              10,000 passages • Single GPU • BF16
            </p>

            {/* Memory Comparison */}
            <div className="mb-16">
              <h3 className="text-xl font-semibold mb-6 text-gray-300">Peak Memory</h3>
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Semantic Resonator</span>
                    <span className="text-2xl font-mono font-bold text-red-400">293 MB</span>
                  </div>
                  <div className="h-8 bg-[#1a1a24] rounded-lg overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-lg" style={{ width: '10%' }} />
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">DistilGPT-2</span>
                    <span className="text-lg font-mono text-gray-500">~1,018 MB</span>
                  </div>
                  <div className="h-8 bg-[#1a1a24] rounded-lg overflow-hidden">
                    <div className="h-full bg-gray-700 rounded-lg" style={{ width: '34%' }} />
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">GPT-2 Medium</span>
                    <span className="text-lg font-mono text-gray-500">~3,000 MB</span>
                  </div>
                  <div className="h-8 bg-[#1a1a24] rounded-lg overflow-hidden">
                    <div className="h-full bg-gray-700 rounded-lg" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-red-400 font-semibold">3–10× less memory</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-[#1a1a24] border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-mono font-bold text-red-400 mb-2">O(1)</div>
                  <div className="text-sm text-gray-400">Memory Scaling</div>
                  <div className="text-xs text-gray-600 mt-2">Always 293 MB</div>
                </CardContent>
              </Card>
              <Card className="bg-[#1a1a24] border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-mono font-bold text-red-400 mb-2">55K</div>
                  <div className="text-sm text-gray-400">Tokens/sec</div>
                  <div className="text-xs text-gray-600 mt-2">Competitive throughput</div>
                </CardContent>
              </Card>
              <Card className="bg-[#1a1a24] border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-mono font-bold text-red-400 mb-2">N×K</div>
                  <div className="text-sm text-gray-400">Complexity</div>
                  <div className="text-xs text-gray-600 mt-2">K is constant</div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-[#12121a] border border-white/5 rounded-xl p-6">
              <p className="text-center text-lg">
                <span className="text-gray-400">As context grows, transformer memory grows.</span><br />
                <span className="text-white font-semibold">Semantic Resonator stays constant.</span><br />
                <span className="text-red-400 font-mono text-xl">Always 293 megabytes.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section id="advantages" className="py-24 bg-gradient-to-b from-[#0f0f18] to-[#0a0a0f] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Why it matters.
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 p-6 bg-[#1a1a24] rounded-xl border border-white/5">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-red-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">10–100× Lower Compute</h3>
                  <p className="text-gray-400 text-sm">Potential for dramatically reduced computational requirements at scale.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-[#1a1a24] rounded-xl border border-white/5">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Database className="h-6 w-6 text-red-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">~1000× Smaller Memory</h3>
                  <p className="text-gray-400 text-sm">Constant memory footprint enables deployment on resource-constrained devices.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-[#1a1a24] rounded-xl border border-white/5">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-red-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Real-Time Inference</h3>
                  <p className="text-gray-400 text-sm">55K tokens/sec throughput enables true real-time language processing.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-[#1a1a24] rounded-xl border border-white/5">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Novel, Defensible IP</h3>
                  <p className="text-gray-400 text-sm">The first viable non-transformer architecture for production language AI.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Rigorous research.
            </h2>
            <p className="text-lg text-gray-400 mb-6">
              This isn't just an idea—it's <span className="text-white">rigorous research</span>. A formal mathematical framework: three-field geometry, recurrence equations, 288-dimensional signatures, and full theoretical foundations.
            </p>
            <p className="text-xl text-white mb-10">
              Ten pages of mathematical formalization.<br />
              <span className="text-gray-400">Peer-reviewed foundations for a new kind of language AI.</span>
            </p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
              <a href="#paper">
                <FileText className="mr-2 h-5 w-5" />
                Read the paper
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-24 bg-gradient-to-t from-[#12121a] to-[#0a0a0f] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The future of efficient language AI.
            </h2>
            <p className="text-xl text-gray-400 mb-2">
              Constant memory. Competitive throughput.
            </p>
            <p className="text-lg text-red-400 mb-10">
              Let's build it together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8">
                <a href="#paper">
                  <FileText className="mr-2 h-5 w-5" />
                  Read the Paper
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <a href="mailto:contact@laxnar.ai">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-3 mb-8">
              <img 
                src="/lovable-uploads/4f8610eb-6b18-41eb-b5f3-6dabcc4cd82a.png" 
                alt="Laxnar AI Innovations" 
                className="h-10 w-auto"
              />
              <span className="text-gray-400">Laxnar AI Innovations</span>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <a href="#paper" className="hover:text-white transition-colors">Paper</a>
              <span>•</span>
              <a href="mailto:contact@laxnar.ai" className="hover:text-white transition-colors">Contact</a>
              <span>•</span>
              <a href="/" className="hover:text-white transition-colors">Laxnar AI</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SemanticResonator;
