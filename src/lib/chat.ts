import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Retrieval {
  id: string;
  passage: string;
  score: number;
  source: string;
}

interface ChatResponse {
  content: string;
  retrievals: Retrieval[];
  model: string;
  tokensUsed: number;
}

// Mock retrieval data for demo purposes
const MOCK_RETRIEVALS: Record<string, Retrieval[]> = {
  default: [
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
  ]
};

export async function sendChatMessage(
  messages: Message[],
  model: string,
  bundleId: string | null,
  userId: string
): Promise<ChatResponse> {
  const userMessage = messages[messages.length - 1].content;
  
  // Build context from retrievals if bundle is selected
  let retrievals: Retrieval[] = [];
  let contextPrompt = "";
  
  if (bundleId) {
    // In a real implementation, this would query the local SQLite FTS index
    // For now, we use mock retrievals
    retrievals = MOCK_RETRIEVALS.default;
    
    contextPrompt = `You are PRISM, an AI assistant that provides grounded responses based on retrieved knowledge passages.

The following passages were retrieved from the user's active knowledge bundle:

${retrievals.map((r, i) => `[${i + 1}] (Score: ${(r.score * 100).toFixed(0)}%) ${r.passage}`).join("\n\n")}

Use these passages to inform your response. Be specific about which information comes from the retrieved passages. If the passages don't contain relevant information, say so honestly.

User question: ${userMessage}`;
  } else {
    contextPrompt = `You are PRISM, an AI assistant for local-first knowledge management.

The user doesn't have an active knowledge bundle selected. Help them understand how to:
1. Import documents to create knowledge bundles
2. Download dataset packs (MS MARCO, BEIR, etc.)
3. Use the chat with active bundles for grounded responses

Be helpful and guide them to get started with PRISM.

User message: ${userMessage}`;
  }

  // Map model names to Lovable AI supported models
  const modelMap: Record<string, string> = {
    "gemini-2.5-flash": "google/gemini-2.5-flash",
    "gemini-2.5-pro": "google/gemini-2.5-pro",
    "gpt-5-mini": "openai/gpt-5-mini",
    "gpt-5": "openai/gpt-5",
  };

  const aiModel = modelMap[model] || "google/gemini-2.5-flash";

  try {
    // Call Lovable AI via edge function
    const { data, error } = await supabase.functions.invoke("chat-completion", {
      body: {
        messages: [
          { role: "system", content: contextPrompt },
          ...messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
        ],
        model: aiModel,
        bundleId,
      },
    });

    if (error) throw error;

    // Save message to database
    await supabase.from("chat_messages").insert([{
      user_id: userId,
      bundle_id: bundleId,
      model: aiModel,
      user_message: userMessage,
      assistant_message: data.content,
      retrieved_passages: JSON.parse(JSON.stringify(retrievals)),
      tokens_used: data.tokensUsed || 0,
    }]);

    return {
      content: data.content,
      retrievals: bundleId ? retrievals : [],
      model: model,
      tokensUsed: data.tokensUsed || 0,
    };
  } catch (error) {
    console.error("Chat error:", error);
    
    // Fallback response if API fails
    const fallbackContent = bundleId
      ? `Based on the retrieved passages from your active bundle, I can help explain PRISM's approach to knowledge management. The system uses deterministic propagation with local-first storage, ensuring your data stays private and results are reproducible.

Would you like me to elaborate on any specific aspect?`
      : `I notice you don't have an active knowledge bundle selected. To get the best experience with PRISM:

1. **Import a bundle** - Upload PDF, DOCX, or TXT files in the Bundles section
2. **Download a dataset pack** - Choose from MS MARCO, BEIR SciFact, or other research datasets

Once you have an active bundle, I'll retrieve relevant passages to ground my responses.`;

    return {
      content: fallbackContent,
      retrievals: bundleId ? retrievals : [],
      model: model,
      tokensUsed: 0,
    };
  }
}
