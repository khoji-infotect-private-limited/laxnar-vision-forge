import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Send,
  ChevronDown,
  ChevronRight,
  Package,
  Sparkles,
  Bot,
  User,
  Loader2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  retrievals?: Retrieval[];
  model?: string;
  timestamp: Date;
}

interface Retrieval {
  id: string;
  passage: string;
  score: number;
  source: string;
}

interface Bundle {
  id: string;
  name: string;
  kind: string;
}

const MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google" },
  { id: "gpt-5-mini", name: "GPT-5 Mini", provider: "OpenAI" },
  { id: "gpt-5", name: "GPT-5", provider: "OpenAI" },
];

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [expandedRetrievals, setExpandedRetrievals] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBundles();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchBundles = async () => {
    const { data } = await supabase
      .from("bundles")
      .select("id, name, kind")
      .order("created_at", { ascending: false });
    
    if (data) {
      setBundles(data);
      // Set first bundle as active if available
      const activeBundle = data.find(b => b.kind === "dataset_pack") || data[0];
      if (activeBundle) setSelectedBundle(activeBundle.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response with mock retrievals
    setTimeout(() => {
      const mockRetrievals: Retrieval[] = selectedBundle ? [
        {
          id: "ret-1",
          passage: "Knowledge bundles provide deterministic retrieval by storing pre-computed embeddings locally. This ensures consistent results across queries.",
          score: 0.89,
          source: "bundle://prism-docs/architecture.md"
        },
        {
          id: "ret-2",
          passage: "The PRISM system uses SQLite FTS for full-text search on web platforms, providing fast local-first search without network dependencies.",
          score: 0.76,
          source: "bundle://prism-docs/local-search.md"
        },
        {
          id: "ret-3",
          passage: "Energy-based reranking computes relevance scores using learned energy functions, improving retrieval precision without additional model calls.",
          score: 0.68,
          source: "bundle://prism-docs/reranking.md"
        }
      ] : [];

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: selectedBundle 
          ? `Based on the retrieved passages from your active bundle, I can explain that PRISM uses a deterministic propagation approach for knowledge retrieval. The system stores pre-computed embeddings locally in knowledge bundles, which enables consistent and reproducible results.\n\nThe web version leverages SQLite FTS (Full-Text Search) for efficient local-first search, while native platforms can use the full energy-based reranking system for enhanced precision.\n\nWould you like me to elaborate on any specific aspect of the PRISM architecture?`
          : `I notice you don't have an active knowledge bundle selected. For the best experience with PRISM, I recommend:\n\n1. **Import a bundle** - Upload PDF, DOCX, or TXT files to create a custom knowledge bundle\n2. **Download a dataset pack** - Choose from MS MARCO, BEIR SciFact, or other research datasets\n\nOnce you have an active bundle, I'll be able to retrieve relevant passages and provide grounded responses based on your knowledge base.`,
        retrievals: mockRetrievals.length > 0 ? mockRetrievals : undefined,
        model: MODELS.find(m => m.id === selectedModel)?.name,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const toggleRetrievals = (messageId: string) => {
    setExpandedRetrievals(prev => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Controls bar */}
      <div className="border-b border-border p-4 flex flex-wrap gap-4 items-center bg-muted/30">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Model:</span>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span>{model.name}</span>
                    <span className="text-xs text-muted-foreground">({model.provider})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Bundle:</span>
          <Select value={selectedBundle || ""} onValueChange={setSelectedBundle}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="No bundle selected" />
            </SelectTrigger>
            <SelectContent>
              {bundles.length === 0 ? (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                  No bundles available.<br />
                  Create one in Bundles or Datasets.
                </div>
              ) : (
                bundles.map(bundle => (
                  <SelectItem key={bundle.id} value={bundle.id}>
                    {bundle.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-primary/50 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Welcome to PRISM Chat</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start a conversation to explore your knowledge bundles. 
                Retrieved passages will appear alongside responses for full transparency.
              </p>
            </div>
          )}

          {messages.map(message => (
            <div key={message.id} className="space-y-2">
              <div
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-lg px-4 py-3 max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.model && (
                    <p className="text-xs opacity-70 mt-2">{message.model}</p>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Retrievals panel */}
              {message.retrievals && message.retrievals.length > 0 && (
                <Collapsible
                  open={expandedRetrievals.has(message.id)}
                  onOpenChange={() => toggleRetrievals(message.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-11 text-muted-foreground"
                    >
                      {expandedRetrievals.has(message.id) ? (
                        <ChevronDown className="h-4 w-4 mr-1" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-1" />
                      )}
                      {message.retrievals.length} retrieved passages
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-11 mt-2 space-y-2">
                    {message.retrievals.map(retrieval => (
                      <Card
                        key={retrieval.id}
                        className="p-3 bg-card/50 border-border/50"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <code className="text-xs text-muted-foreground truncate">
                            {retrieval.source}
                          </code>
                          <span className="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                            {(retrieval.score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-sm">{retrieval.passage}</p>
                      </Card>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-3">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-border p-4 bg-card/50">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your knowledge bundles..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2">
          <Info className="h-3 w-3 inline mr-1" />
          Responses are grounded in your active knowledge bundle. All retrieval happens locally.
        </p>
      </div>
    </div>
  );
}
