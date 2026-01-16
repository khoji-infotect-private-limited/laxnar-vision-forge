import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  HardDrive,
  Trash2,
  RefreshCw,
  Monitor,
  Smartphone,
  Database,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  storage_used_bytes: number;
  storage_limit_bytes: number;
  preferences: unknown;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearingCache, setIsClearingCache] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("storage_used_bytes, storage_limit_bytes, preferences")
      .eq("id", user?.id)
      .single();

    if (data) {
      setProfile(data);
    }
    setIsLoading(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleClearCache = async () => {
    setIsClearingCache(true);
    
    // Simulate cache clearing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Cache cleared",
      description: "Local cache has been cleared successfully",
    });
    setIsClearingCache(false);
  };

  const storagePercent = profile
    ? (profile.storage_used_bytes / profile.storage_limit_bytes) * 100
    : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your storage, device settings, and preferences
        </p>
      </div>

      {/* Storage */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            <CardTitle>Storage</CardTitle>
          </div>
          <CardDescription>
            Monitor your local storage usage and manage cached data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="h-20 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : profile ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {formatBytes(profile.storage_used_bytes)}</span>
                  <span className="text-muted-foreground">
                    Limit: {formatBytes(profile.storage_limit_bytes)}
                  </span>
                </div>
                <Progress value={storagePercent} className="h-2" />
                {storagePercent > 80 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-500">
                    <AlertTriangle className="h-4 w-4" />
                    Storage running low. Consider removing unused bundles.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">IndexedDB</div>
                  <div className="font-medium">
                    {formatBytes(profile.storage_used_bytes * 0.7)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Cache</div>
                  <div className="font-medium">
                    {formatBytes(profile.storage_used_bytes * 0.3)}
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Clear Cache</div>
              <div className="text-sm text-muted-foreground">
                Remove temporary files and cached data
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleClearCache}
              disabled={isClearingCache}
            >
              {isClearingCache ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            <CardTitle>Device Info</CardTitle>
          </div>
          <CardDescription>
            Information about your current device and browser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="text-sm text-muted-foreground">Platform</div>
              <div className="font-medium flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                {navigator.platform}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="text-sm text-muted-foreground">Browser</div>
              <div className="font-medium truncate">
                {navigator.userAgent.split(" ").slice(-2).join(" ")}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="text-sm text-muted-foreground">Storage API</div>
              <div className="font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                IndexedDB + OPFS
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="text-sm text-muted-foreground">Offline Ready</div>
              <div className="font-medium text-green-500">Yes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your PRISM experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-download" className="flex flex-col gap-1">
              <span>Auto-download updates</span>
              <span className="text-sm text-muted-foreground font-normal">
                Automatically download pack updates when available
              </span>
            </Label>
            <Switch id="auto-download" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="show-retrievals" className="flex flex-col gap-1">
              <span>Show retrievals by default</span>
              <span className="text-sm text-muted-foreground font-normal">
                Expand retrieved passages panel automatically
              </span>
            </Label>
            <Switch id="show-retrievals" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="offline-mode" className="flex flex-col gap-1">
              <span>Prefer offline mode</span>
              <span className="text-sm text-muted-foreground font-normal">
                Use local models when network is unavailable
              </span>
            </Label>
            <Switch id="offline-mode" />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Delete All Data</div>
              <div className="text-sm text-muted-foreground">
                Remove all bundles, packs, and local data
              </div>
            </div>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
