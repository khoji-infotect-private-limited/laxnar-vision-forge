import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/app/AppLayout";

// Public pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DocsPage from "./pages/DocsPage";
import Projects from "./pages/Projects";
import HerSafeZone from "./pages/HerSafeZone";
import Landing from "./pages/Landing";
import SubmitIdea from "./pages/SubmitIdea";
import ThankYou from "./pages/ThankYou";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SemanticResonator from "./pages/SemanticResonator";
import ReptileCursor from "./components/ReptileCursor";

// App pages
import ChatPage from "./pages/app/ChatPage";
import BundlesPage from "./pages/app/BundlesPage";
import DatasetsPage from "./pages/app/DatasetsPage";
import SettingsPage from "./pages/app/SettingsPage";
import MarketplacePage from "./pages/app/MarketplacePage";
import RoomsPage from "./pages/app/RoomsPage";
import JobsPage from "./pages/app/JobsPage";
import CompetitionsPage from "./pages/app/CompetitionsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ReptileCursor />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/hersafezone" element={<HerSafeZone />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/submit-idea" element={<SubmitIdea />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/semantic-resonator" element={<SemanticResonator />} />

            {/* Protected app routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/chat" replace />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="bundles" element={<BundlesPage />} />
              <Route path="datasets" element={<DatasetsPage />} />
              <Route path="marketplace" element={<MarketplacePage />} />
              <Route path="rooms" element={<RoomsPage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="competitions" element={<CompetitionsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
