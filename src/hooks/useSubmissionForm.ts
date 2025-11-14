import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const submissionSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  ideaDescription: z.string().trim().min(10, "Please describe your idea in at least 10 characters").max(2000),
  traction: z.string().trim().max(500).optional(),
  whatsappNumber: z.string().trim().min(10, "Please enter a valid WhatsApp number").max(20),
  pitchDeck: z.instanceof(File).optional(),
});

type FormData = {
  name: string;
  email: string;
  ideaDescription: string;
  traction: string;
  whatsappNumber: string;
  pitchDeck: File | null;
};

export const useSubmissionForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    ideaDescription: "",
    traction: "",
    whatsappNumber: "",
    pitchDeck: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((p) => ({ ...p, pitchDeck: file }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Validate form data
      submissionSchema.parse({
        ...formData,
        traction: formData.traction || undefined,
        pitchDeck: formData.pitchDeck || undefined,
      });

      let pitchDeckUrl = null;

      // Upload pitch deck if provided
      if (formData.pitchDeck) {
        const fileExt = formData.pitchDeck.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("pitch-decks")
          .upload(filePath, formData.pitchDeck);

        if (uploadError) throw uploadError;
        pitchDeckUrl = filePath;
      }

      // Insert submission
      const { error: insertError } = await supabase.from("submissions").insert({
        name: formData.name,
        email: formData.email,
        idea_description: formData.ideaDescription,
        traction: formData.traction || null,
        whatsapp_number: formData.whatsappNumber,
        pitch_deck_url: pitchDeckUrl,
      });

      if (insertError) throw insertError;

      navigate("/thank-you");
    } catch (err: any) {
      console.error("Submission error:", err);
      toast({
        title: "Submission failed",
        description: err.message || "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, isSubmitting, handleChange, handleFileChange, handleSubmit };
};
