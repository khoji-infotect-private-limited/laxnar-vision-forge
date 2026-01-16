export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bundles: {
        Row: {
          chunk_count: number | null
          created_at: string
          description: string | null
          document_count: number | null
          health_status: string | null
          id: string
          is_active: boolean | null
          kind: Database["public"]["Enums"]["bundle_kind"]
          metadata: Json | null
          name: string
          pack_id: string | null
          size_bytes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chunk_count?: number | null
          created_at?: string
          description?: string | null
          document_count?: number | null
          health_status?: string | null
          id?: string
          is_active?: boolean | null
          kind?: Database["public"]["Enums"]["bundle_kind"]
          metadata?: Json | null
          name: string
          pack_id?: string | null
          size_bytes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chunk_count?: number | null
          created_at?: string
          description?: string | null
          document_count?: number | null
          health_status?: string | null
          id?: string
          is_active?: boolean | null
          kind?: Database["public"]["Enums"]["bundle_kind"]
          metadata?: Json | null
          name?: string
          pack_id?: string | null
          size_bytes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundles_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          assistant_message: string | null
          bundle_id: string | null
          created_at: string
          id: string
          model: string | null
          retrieved_passages: Json | null
          tokens_used: number | null
          user_id: string
          user_message: string
        }
        Insert: {
          assistant_message?: string | null
          bundle_id?: string | null
          created_at?: string
          id?: string
          model?: string | null
          retrieved_passages?: Json | null
          tokens_used?: number | null
          user_id: string
          user_message: string
        }
        Update: {
          assistant_message?: string | null
          bundle_id?: string | null
          created_at?: string
          id?: string
          model?: string | null
          retrieved_passages?: Json | null
          tokens_used?: number | null
          user_id?: string
          user_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          full_size_bytes: number | null
          has_full_variant: boolean | null
          has_mini_variant: boolean | null
          id: string
          metadata: Json | null
          mini_size_bytes: number | null
          name: string
          source_url: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          full_size_bytes?: number | null
          has_full_variant?: boolean | null
          has_mini_variant?: boolean | null
          id?: string
          metadata?: Json | null
          mini_size_bytes?: number | null
          name: string
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          full_size_bytes?: number | null
          has_full_variant?: boolean | null
          has_mini_variant?: boolean | null
          id?: string
          metadata?: Json | null
          mini_size_bytes?: number | null
          name?: string
          source_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      impure_leads: {
        Row: {
          ai_search_confidence: string | null
          ai_search_failed: boolean | null
          cin_found_by_ai: string | null
          company_name: string
          company_name_match_score: number | null
          company_status: string | null
          created_at: string
          director_details: Json | null
          director_name_match: boolean | null
          email: string
          fb_event_id: string | null
          founder_background: string
          founder_name: string
          id: string
          idea: string
          lead_score: number | null
          phone: string
          rejection_reason: string
          revenue_model: string
          usp: string
          verification_error_details: Json | null
          verification_id: string | null
          verified_company_name: string | null
        }
        Insert: {
          ai_search_confidence?: string | null
          ai_search_failed?: boolean | null
          cin_found_by_ai?: string | null
          company_name: string
          company_name_match_score?: number | null
          company_status?: string | null
          created_at?: string
          director_details?: Json | null
          director_name_match?: boolean | null
          email: string
          fb_event_id?: string | null
          founder_background: string
          founder_name: string
          id?: string
          idea: string
          lead_score?: number | null
          phone: string
          rejection_reason: string
          revenue_model: string
          usp: string
          verification_error_details?: Json | null
          verification_id?: string | null
          verified_company_name?: string | null
        }
        Update: {
          ai_search_confidence?: string | null
          ai_search_failed?: boolean | null
          cin_found_by_ai?: string | null
          company_name?: string
          company_name_match_score?: number | null
          company_status?: string | null
          created_at?: string
          director_details?: Json | null
          director_name_match?: boolean | null
          email?: string
          fb_event_id?: string | null
          founder_background?: string
          founder_name?: string
          id?: string
          idea?: string
          lead_score?: number | null
          phone?: string
          rejection_reason?: string
          revenue_model?: string
          usp?: string
          verification_error_details?: Json | null
          verification_id?: string | null
          verified_company_name?: string | null
        }
        Relationships: []
      }
      marketplace_bundles: {
        Row: {
          author_id: string
          bundle_id: string
          category: string | null
          description: string | null
          download_count: number | null
          id: string
          is_featured: boolean | null
          metadata: Json | null
          price_cents: number | null
          published_at: string
          rating: number | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          bundle_id: string
          category?: string | null
          description?: string | null
          download_count?: number | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          price_cents?: number | null
          published_at?: string
          rating?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          bundle_id?: string
          category?: string | null
          description?: string | null
          download_count?: number | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          price_cents?: number | null
          published_at?: string
          rating?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_bundles_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          job_type: string
          pack_id: string
          progress: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["job_status"]
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_type: string
          pack_id: string
          progress?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_type?: string
          pack_id?: string
          progress?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_jobs_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      packs: {
        Row: {
          built_at: string | null
          created_at: string
          dataset_id: string
          download_progress: number | null
          error_message: string | null
          id: string
          size_bytes: number | null
          status: Database["public"]["Enums"]["pack_status"]
          storage_path: string | null
          updated_at: string
          user_id: string
          variant: string
          verified_at: string | null
        }
        Insert: {
          built_at?: string | null
          created_at?: string
          dataset_id: string
          download_progress?: number | null
          error_message?: string | null
          id?: string
          size_bytes?: number | null
          status?: Database["public"]["Enums"]["pack_status"]
          storage_path?: string | null
          updated_at?: string
          user_id: string
          variant: string
          verified_at?: string | null
        }
        Update: {
          built_at?: string | null
          created_at?: string
          dataset_id?: string
          download_progress?: number | null
          error_message?: string | null
          id?: string
          size_bytes?: number | null
          status?: Database["public"]["Enums"]["pack_status"]
          storage_path?: string | null
          updated_at?: string
          user_id?: string
          variant?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packs_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          preferences: Json | null
          storage_limit_bytes: number | null
          storage_used_bytes: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          preferences?: Json | null
          storage_limit_bytes?: number | null
          storage_used_bytes?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          preferences?: Json | null
          storage_limit_bytes?: number | null
          storage_used_bytes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      pure_conversions: {
        Row: {
          ai_search_confidence: string | null
          cin_found_by_ai: string
          cin_status: string | null
          company_name: string
          company_name_match_score: number | null
          company_status: string | null
          conversion_value: number | null
          created_at: string
          director_details: Json | null
          director_name_match: boolean | null
          email: string
          fb_event_id: string | null
          founder_background: string
          founder_name: string
          id: string
          idea: string
          incorporation_country: string | null
          incorporation_date: string | null
          matched_director_name: string | null
          phone: string
          reference_id: string | null
          registration_number: string | null
          revenue_model: string
          usp: string
          verification_id: string | null
          verified_company_name: string
        }
        Insert: {
          ai_search_confidence?: string | null
          cin_found_by_ai: string
          cin_status?: string | null
          company_name: string
          company_name_match_score?: number | null
          company_status?: string | null
          conversion_value?: number | null
          created_at?: string
          director_details?: Json | null
          director_name_match?: boolean | null
          email: string
          fb_event_id?: string | null
          founder_background: string
          founder_name: string
          id?: string
          idea: string
          incorporation_country?: string | null
          incorporation_date?: string | null
          matched_director_name?: string | null
          phone: string
          reference_id?: string | null
          registration_number?: string | null
          revenue_model: string
          usp: string
          verification_id?: string | null
          verified_company_name: string
        }
        Update: {
          ai_search_confidence?: string | null
          cin_found_by_ai?: string
          cin_status?: string | null
          company_name?: string
          company_name_match_score?: number | null
          company_status?: string | null
          conversion_value?: number | null
          created_at?: string
          director_details?: Json | null
          director_name_match?: boolean | null
          email?: string
          fb_event_id?: string | null
          founder_background?: string
          founder_name?: string
          id?: string
          idea?: string
          incorporation_country?: string | null
          incorporation_date?: string | null
          matched_director_name?: string | null
          phone?: string
          reference_id?: string | null
          registration_number?: string | null
          revenue_model?: string
          usp?: string
          verification_id?: string | null
          verified_company_name?: string
        }
        Relationships: []
      }
      room_members: {
        Row: {
          id: string
          joined_at: string
          role: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          member_count: number | null
          metadata: Json | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          member_count?: number | null
          metadata?: Json | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          member_count?: number | null
          metadata?: Json | null
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          cin: string
          cin_status: string | null
          company_name: string
          company_status: string | null
          created_at: string
          director_details: Json | null
          email: string
          founder_background: string
          founder_name: string
          id: string
          idea: string
          incorporation_country: string | null
          incorporation_date: string | null
          phone: string
          reference_id: string | null
          registration_number: string | null
          revenue_model: string
          usp: string
          verification_id: string | null
          verified_company_name: string | null
          verified_email: string | null
        }
        Insert: {
          cin?: string
          cin_status?: string | null
          company_name?: string
          company_status?: string | null
          created_at?: string
          director_details?: Json | null
          email: string
          founder_background?: string
          founder_name?: string
          id?: string
          idea: string
          incorporation_country?: string | null
          incorporation_date?: string | null
          phone?: string
          reference_id?: string | null
          registration_number?: string | null
          revenue_model?: string
          usp?: string
          verification_id?: string | null
          verified_company_name?: string | null
          verified_email?: string | null
        }
        Update: {
          cin?: string
          cin_status?: string | null
          company_name?: string
          company_status?: string | null
          created_at?: string
          director_details?: Json | null
          email?: string
          founder_background?: string
          founder_name?: string
          id?: string
          idea?: string
          incorporation_country?: string | null
          incorporation_date?: string | null
          phone?: string
          reference_id?: string | null
          registration_number?: string | null
          revenue_model?: string
          usp?: string
          verification_id?: string | null
          verified_company_name?: string | null
          verified_email?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      bundle_kind: "user_import" | "dataset_pack" | "marketplace"
      job_status: "queued" | "running" | "ready" | "failed"
      pack_status: "pending" | "downloading" | "ready" | "failed" | "corrupted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      bundle_kind: ["user_import", "dataset_pack", "marketplace"],
      job_status: ["queued", "running", "ready", "failed"],
      pack_status: ["pending", "downloading", "ready", "failed", "corrupted"],
    },
  },
} as const
