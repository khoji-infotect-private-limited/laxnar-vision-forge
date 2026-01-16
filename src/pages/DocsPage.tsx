import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  ArrowLeft,
  Package,
  Database,
  Cpu,
  HardDrive,
  Zap,
  FileText,
  Code,
  BookOpen,
  ExternalLink,
} from "lucide-react";

const DOCS_SECTIONS = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Sparkles,
    content: `
## Welcome to PRISM

PRISM (Propagation-based Retrieval with Indexed Semantic Memory) is a local-first knowledge management system designed for reproducible AI research.

### Quick Start

1. **Sign up** at [/auth](/auth) to create your account
2. **Open the app** at [/app](/app)
3. **Create your first bundle** by importing a PDF, DOCX, or TXT file
4. **Start chatting** with your knowledge base

### Key Concepts

- **Knowledge Bundles**: Self-contained packages of indexed documents
- **Dataset Packs**: Pre-built bundles from research datasets (MS MARCO, BEIR, etc.)
- **Retrieval Panel**: Shows which passages informed each AI response
- **Local-First**: All data stored on your device, works offline
    `,
  },
  {
    id: "bundles",
    title: "Knowledge Bundles",
    icon: Package,
    content: `
## Knowledge Bundles

A bundle is a self-contained collection of indexed documents that can be used for retrieval-augmented generation.

### Creating Bundles

You can create bundles in two ways:

1. **Import Documents**: Upload PDF, DOCX, or TXT files
2. **Download Dataset Packs**: Pre-built bundles from research datasets

### Bundle Structure

Each bundle contains:

- **Documents**: The original source files
- **Chunks**: MS-MARCO-like passages (~56 tokens each)
- **Index**: SQLite FTS index for fast retrieval
- **Metadata**: Creation date, size, health status

### Chunking Strategy

PRISM uses MS-MARCO-style passage chunking:

\`\`\`
Target chunk size: ~56 tokens
Overlap: 10 tokens between chunks
Sentence boundary: Chunks respect sentence boundaries when possible
\`\`\`

### Bundle Health

Bundles are periodically verified for:

- Index integrity
- Storage consistency
- Chunk count accuracy
    `,
  },
  {
    id: "retrieval",
    title: "Retrieval System",
    icon: Database,
    content: `
## Retrieval System

PRISM uses a two-stage retrieval pipeline for efficient and accurate passage retrieval.

### Stage 1: Full-Text Search

SQLite FTS5 handles the initial retrieval:

\`\`\`sql
SELECT passage, bm25(chunks) as score
FROM chunks
WHERE chunks MATCH ?
ORDER BY score
LIMIT 100
\`\`\`

### Stage 2: Energy Reranking (Native)

On native platforms (Android), an energy-based reranker scores the top-k passages:

\`\`\`
E(q, p) = -log P(relevant | q, p)
\`\`\`

Lower energy = higher relevance.

### Web vs Native

| Feature | Web | Android |
|---------|-----|---------|
| Initial retrieval | SQLite FTS | SQLite FTS |
| Reranking | BM25 only | Energy model |
| Latency | ~50ms | ~100ms |
| Accuracy | Good | Best |

### Determinism

Same query + same bundle = same results. Always.

This is achieved by:

1. Fixed random seeds
2. Sorted index traversal
3. Stable sorting algorithms
    `,
  },
  {
    id: "datasets",
    title: "Dataset Packs",
    icon: FileText,
    content: `
## Dataset Packs

Pre-built knowledge bundles from popular research datasets.

### Available Datasets

#### MS MARCO
Microsoft Machine Reading Comprehension dataset. The gold standard for passage ranking.

- **Mini**: 50 MB, 10k passages
- **Full**: 8 GB, 8.8M passages

#### BEIR SciFact
Scientific claim verification from the BEIR benchmark.

- **Mini**: 10 MB, 5k passages
- **Full**: 100 MB, 50k passages

#### BEIR NFCorpus
Nutrition and fitness corpus for health-related queries.

- **Mini**: 5 MB, 3k passages
- **Full**: 50 MB, 30k passages

#### The Pile
Large-scale diverse text corpus from EleutherAI.

- **Mini**: 100 MB, 100k passages
- **Full**: 80 GB, 800M passages

### Installing Packs

1. Go to **Datasets** in the sidebar
2. Choose a dataset and variant (mini/full)
3. Click **Download**
4. Wait for verification to complete
5. Bundle is automatically created and ready to use
    `,
  },
  {
    id: "local-first",
    title: "Local-First Architecture",
    icon: HardDrive,
    content: `
## Local-First Architecture

PRISM is built with a local-first philosophy. Your data stays on your device.

### Storage Layers

\`\`\`
┌─────────────────────────────────┐
│          Application            │
├─────────────────────────────────┤
│        SQLite (FTS5)            │
├─────────────────────────────────┤
│     IndexedDB / OPFS            │
├─────────────────────────────────┤
│        Device Storage           │
└─────────────────────────────────┘
\`\`\`

### Web Storage

- **IndexedDB**: Stores bundle metadata and small chunks
- **OPFS (Origin Private File System)**: Stores large dataset packs
- **Cache API**: Stores static assets for offline use

### Sync Model

PRISM uses a **local-first, cloud-optional** model:

1. All data created locally first
2. Optional sync to cloud for backup
3. Conflict resolution: last-write-wins

### Offline Capabilities

When offline, you can:

- ✅ Chat with existing bundles
- ✅ Create new bundles from local files
- ✅ Browse all your data
- ❌ Download new dataset packs
- ❌ Access cloud-only features
    `,
  },
  {
    id: "api",
    title: "API Reference",
    icon: Code,
    content: `
## API Reference

### Supabase Client

\`\`\`typescript
import { supabase } from "@/integrations/supabase/client";

// Fetch bundles
const { data: bundles } = await supabase
  .from("bundles")
  .select("*")
  .order("created_at", { ascending: false });

// Create bundle
const { data, error } = await supabase
  .from("bundles")
  .insert({
    name: "My Bundle",
    kind: "user_import",
    document_count: 1,
    chunk_count: 100,
    size_bytes: 50000,
  });
\`\`\`

### Local Storage API

\`\`\`typescript
// Store bundle data locally
await localDB.bundles.put({
  id: bundleId,
  chunks: chunkedData,
  index: ftsIndex,
});

// Query local index
const results = await localDB.search(bundleId, query, {
  limit: 10,
  threshold: 0.5,
});
\`\`\`

### Retrieval API

\`\`\`typescript
interface RetrievalResult {
  passage: string;
  score: number;
  source: string;
  chunkId: string;
}

async function retrieve(
  bundleId: string,
  query: string,
  topK: number = 10
): Promise<RetrievalResult[]>
\`\`\`
    `,
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">PRISM Documentation</span>
            </div>
          </div>
          
          <Button size="sm" asChild>
            <Link to="/app">Open App</Link>
          </Button>
        </div>
      </nav>

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-[250px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-2">
                <p className="text-sm font-medium text-muted-foreground mb-4">Documentation</p>
                {DOCS_SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <section.icon className="h-4 w-4" />
                    {section.title}
                  </a>
                ))}
              </div>
            </aside>

            {/* Content */}
            <main className="min-w-0">
              {/* Header */}
              <div className="mb-12">
                <Badge variant="secondary" className="mb-4">v1.0.0</Badge>
                <h1 className="text-4xl font-bold mb-4">PRISM Documentation</h1>
                <p className="text-xl text-muted-foreground">
                  Learn how to use PRISM for local-first knowledge management and reproducible AI research.
                </p>
              </div>

              {/* Quick links */}
              <div className="grid sm:grid-cols-2 gap-4 mb-12">
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Quick Start
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Get up and running with PRISM in under 5 minutes.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Core Concepts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Understand bundles, retrieval, and local-first architecture.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              {/* Documentation sections */}
              <div className="space-y-16">
                {DOCS_SECTIONS.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <section.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                    </div>
                    
                    <Card>
                      <CardContent className="pt-6 prose prose-invert prose-sm max-w-none">
                        <div 
                          className="[&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-3 
                                     [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mt-4 [&>h3]:mb-2
                                     [&>h4]:text-base [&>h4]:font-medium [&>h4]:mt-3 [&>h4]:mb-1
                                     [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:mb-3
                                     [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1 [&>ul]:text-muted-foreground
                                     [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-1 [&>ol]:text-muted-foreground
                                     [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-4
                                     [&>table]:w-full [&>table]:text-sm [&>table]:my-4
                                     [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-muted
                                     [&_td]:border [&_td]:border-border [&_td]:p-2"
                          dangerouslySetInnerHTML={{
                            __html: section.content
                              .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                              .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                              .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
                              .replace(/^- (.+)$/gm, '<li>$1</li>')
                              .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
                              .replace(/(<li>.*<\/li>\n?)+/g, (match) => {
                                if (match.includes('1.')) return `<ol>${match}</ol>`;
                                return `<ul>${match}</ul>`;
                              })
                              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                              .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
                              .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
                              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
                              .replace(/\n\n/g, '</p><p>')
                              .replace(/^(?!<[hluop])/gm, '<p>')
                              .replace(/(?<![>])$/gm, '</p>')
                              .replace(/<p><\/p>/g, '')
                              .replace(/<p>(<[hluopc])/g, '$1')
                              .replace(/(<\/[hluopc][^>]*>)<\/p>/g, '$1')
                          }}
                        />
                      </CardContent>
                    </Card>
                  </section>
                ))}
              </div>

              {/* Footer CTA */}
              <Card className="mt-12 bg-primary/5 border-primary/20">
                <CardContent className="py-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">Ready to start building?</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first knowledge bundle and experience local-first AI.
                  </p>
                  <Button asChild>
                    <Link to="/app">
                      Open PRISM App
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
