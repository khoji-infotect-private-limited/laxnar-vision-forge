-- Create enums for status types
CREATE TYPE public.pack_status AS ENUM ('pending', 'downloading', 'ready', 'failed', 'corrupted');
CREATE TYPE public.job_status AS ENUM ('queued', 'running', 'ready', 'failed');
CREATE TYPE public.bundle_kind AS ENUM ('user_import', 'dataset_pack', 'marketplace');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Datasets registry (global catalog of available datasets)
CREATE TABLE public.datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT DEFAULT 'general',
  has_mini_variant BOOLEAN DEFAULT true,
  has_full_variant BOOLEAN DEFAULT true,
  mini_size_bytes BIGINT,
  full_size_bytes BIGINT,
  source_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dataset packs (user's downloaded/installed packs)
CREATE TABLE public.packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dataset_id UUID NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
  variant TEXT NOT NULL CHECK (variant IN ('mini', 'full')),
  status pack_status NOT NULL DEFAULT 'pending',
  storage_path TEXT,
  size_bytes BIGINT,
  download_progress INTEGER DEFAULT 0,
  error_message TEXT,
  verified_at TIMESTAMPTZ,
  built_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, dataset_id, variant)
);

-- Pack jobs (background job queue for pack operations)
CREATE TABLE public.pack_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  status job_status NOT NULL DEFAULT 'queued',
  progress INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User bundles (knowledge bundles - imported or from packs)
CREATE TABLE public.bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind bundle_kind NOT NULL DEFAULT 'user_import',
  pack_id UUID REFERENCES public.packs(id) ON DELETE SET NULL,
  description TEXT,
  document_count INTEGER DEFAULT 0,
  chunk_count INTEGER DEFAULT 0,
  size_bytes BIGINT DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  health_status TEXT DEFAULT 'healthy',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rooms (community chat rooms)
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Room members
CREATE TABLE public.room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'moderator', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Marketplace bundles (shared bundles)
CREATE TABLE public.marketplace_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  price_cents INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  storage_used_bytes BIGINT DEFAULT 0,
  storage_limit_bytes BIGINT DEFAULT 5368709120, -- 5GB default
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles (separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Chat messages (for retrieval history)
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bundle_id UUID REFERENCES public.bundles(id) ON DELETE SET NULL,
  model TEXT,
  user_message TEXT NOT NULL,
  assistant_message TEXT,
  retrieved_passages JSONB DEFAULT '[]',
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies

-- Datasets: Public read, admin write
CREATE POLICY "Anyone can view datasets" ON public.datasets FOR SELECT USING (true);
CREATE POLICY "Admins can manage datasets" ON public.datasets FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Packs: Users own their packs
CREATE POLICY "Users can view own packs" ON public.packs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own packs" ON public.packs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own packs" ON public.packs FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own packs" ON public.packs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Pack jobs: Users own their jobs
CREATE POLICY "Users can view own pack jobs" ON public.pack_jobs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own pack jobs" ON public.pack_jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pack jobs" ON public.pack_jobs FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Bundles: Users own their bundles
CREATE POLICY "Users can view own bundles" ON public.bundles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bundles" ON public.bundles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bundles" ON public.bundles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bundles" ON public.bundles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Rooms: Public rooms visible to all, private only to members
CREATE POLICY "Anyone can view public rooms" ON public.rooms FOR SELECT USING (is_public = true);
CREATE POLICY "Members can view private rooms" ON public.rooms FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.room_members WHERE room_id = id AND user_id = auth.uid()));
CREATE POLICY "Authenticated users can create rooms" ON public.rooms FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update rooms" ON public.rooms FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete rooms" ON public.rooms FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- Room members
CREATE POLICY "Anyone can view room members" ON public.room_members FOR SELECT USING (true);
CREATE POLICY "Users can join rooms" ON public.room_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave rooms" ON public.room_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Marketplace: Public read, authors can manage their own
CREATE POLICY "Anyone can view marketplace bundles" ON public.marketplace_bundles FOR SELECT USING (true);
CREATE POLICY "Authors can create marketplace bundles" ON public.marketplace_bundles FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own marketplace bundles" ON public.marketplace_bundles FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own marketplace bundles" ON public.marketplace_bundles FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Profiles: Users own their profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- User roles: Only viewable by self or admin
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Chat messages: Users own their messages
CREATE POLICY "Users can view own messages" ON public.chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own messages" ON public.chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger for auto-creating profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)));
  
  -- Give new users the 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_datasets_updated_at BEFORE UPDATE ON public.datasets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_packs_updated_at BEFORE UPDATE ON public.packs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON public.bundles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_marketplace_bundles_updated_at BEFORE UPDATE ON public.marketplace_bundles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial datasets
INSERT INTO public.datasets (name, description, category, mini_size_bytes, full_size_bytes) VALUES
  ('MS MARCO', 'Microsoft Machine Reading Comprehension dataset for passage ranking', 'retrieval', 52428800, 8589934592),
  ('BEIR SciFact', 'Scientific fact verification dataset from BEIR benchmark', 'scientific', 10485760, 104857600),
  ('BEIR NFCorpus', 'Nutrition and fitness corpus from BEIR benchmark', 'health', 5242880, 52428800),
  ('The Pile', 'Large-scale diverse text corpus for language modeling', 'general', 104857600, 85899345920);