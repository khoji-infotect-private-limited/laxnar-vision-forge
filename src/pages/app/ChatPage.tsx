import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { sendChatMessage } from "@/lib/chat";
import { messageBubble, staggerContainerFast, fadeInUp } from "@/lib/animations";
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
      const activeBundle = data.find(b => b.kind === "dataset_pack") || data[0];
      if (activeBundle) setSelectedBundle(activeBundle.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const messageHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      messageHistory.push({ role: "user", content: userMessage.content });

      const response = await sendChatMessage(
        messageHistory,
        selectedModel,
        selectedBundle,
        user.id
      );

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.content,
        retrievals: response.retrievals.length > 0 ? response.retrievals : undefined,
        model: MODELS.find(m => m.id === selectedModel)?.name,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-[calc(100vh-3.5rem)] flex flex-col"
    >
      {/* Controls bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="border-b border-border p-4 flex flex-wrap gap-4 items-center bg-muted/30"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
          </motion.div>
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
      </motion.div>

      {/* Messages area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 && (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-xl font-semibold mb-2">Welcome to PRISM Chat</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start a conversation to explore your knowledge bundles. 
                  Retrieved passages will appear alongside responses for full transparency.
                </p>
              </motion.div>
            )}

            {messages.map((message, index) => (
              <motion.div 
                key={message.id}
                variants={messageBubble}
                initial="hidden"
                animate="visible"
                layout
                className="space-y-2"
              >
                <div
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                      className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                    >
                      <Bot className="h-4 w-4 text-primary" />
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
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
                  </motion.div>
                  {message.role === "user" && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                      className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0"
                    >
                      <User className="h-4 w-4" />
                    </motion.div>
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
                        <motion.div
                          animate={{ rotate: expandedRetrievals.has(message.id) ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-4 w-4 mr-1" />
                        </motion.div>
                        {message.retrievals.length} retrieved passages
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainerFast}
                        className="ml-11 mt-2 space-y-2"
                      >
                        {message.retrievals.map((retrieval, i) => (
                          <motion.div
                            key={retrieval.id}
                            variants={fadeInUp}
                          >
                            <Card className="p-3 bg-card/50 border-border/50">
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
                          </motion.div>
                        ))}
                      </motion.div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border-t border-border p-4 bg-card/50"
      >
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-[60px] w-[60px]">
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2">
          <Info className="h-3 w-3 inline mr-1" />
          Responses are grounded in your active knowledge bundle. All retrieval happens locally.
        </p>
      </motion.div>
    </motion.div>
  );
}
