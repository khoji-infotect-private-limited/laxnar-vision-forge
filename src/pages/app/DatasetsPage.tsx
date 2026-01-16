import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  Download,
  CheckCircle,
  Loader2,
  HardDrive,
  Beaker,
  BookOpen,
  Layers,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Dataset {
  id: string;
  name: string;
  description: string | null;
  category: string;
  has_mini_variant: boolean;
  has_full_variant: boolean;
  mini_size_bytes: number | null;
  full_size_bytes: number | null;
}

interface Pack {
  id: string;
  dataset_id: string;
  variant: string;
  status: string;
  download_progress: number;
}

export default function DatasetsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingPacks, setDownloadingPacks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const [{ data: datasetsData }, { data: packsData }] = await Promise.all([
      supabase.from("datasets").select("*").order("name"),
      supabase.from("packs").select("*"),
    ]);

    setDatasets(datasetsData || []);
    setPacks(packsData || []);
    setIsLoading(false);
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getPackStatus = (datasetId: string, variant: string) => {
    return packs.find(p => p.dataset_id === datasetId && p.variant === variant);
  };

  const handleDownload = async (dataset: Dataset, variant: "mini" | "full") => {
    const packKey = `${dataset.id}-${variant}`;
    setDownloadingPacks(prev => new Set(prev).add(packKey));

    // Create pack record
    const { data: pack, error: packError } = await supabase
      .from("packs")
      .insert({
        user_id: user?.id,
        dataset_id: dataset.id,
        variant,
        status: "downloading",
        download_progress: 0,
        size_bytes: variant === "mini" ? dataset.mini_size_bytes : dataset.full_size_bytes,
      })
      .select()
      .single();

    if (packError) {
      toast({
        title: "Error",
        description: packError.message,
        variant: "destructive",
      });
      setDownloadingPacks(prev => {
        const next = new Set(prev);
        next.delete(packKey);
        return next;
      });
      return;
    }

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(async () => {
      progress += 10 + Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Update pack status to ready and create bundle
        await supabase
          .from("packs")
          .update({ status: "ready", download_progress: 100, verified_at: new Date().toISOString() })
          .eq("id", pack.id);

        // Create associated bundle
        await supabase.from("bundles").insert({
          user_id: user?.id,
          name: `${dataset.name} (${variant})`,
          kind: "dataset_pack",
          pack_id: pack.id,
          description: dataset.description,
          document_count: variant === "mini" ? 1000 : 10000,
          chunk_count: variant === "mini" ? 5000 : 50000,
          size_bytes: variant === "mini" ? dataset.mini_size_bytes : dataset.full_size_bytes,
          is_active: false,
          health_status: "healthy",
        });

        toast({
          title: "Download complete",
          description: `${dataset.name} (${variant}) is ready to use`,
        });

        setDownloadingPacks(prev => {
          const next = new Set(prev);
          next.delete(packKey);
          return next;
        });
        fetchData();
      } else {
        await supabase
          .from("packs")
          .update({ download_progress: Math.floor(progress) })
          .eq("id", pack.id);
        setPacks(prev =>
          prev.map(p =>
            p.id === pack.id ? { ...p, download_progress: Math.floor(progress) } : p
          )
        );
      }
    }, 500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "retrieval":
        return <Database className="h-5 w-5" />;
      case "scientific":
        return <Beaker className="h-5 w-5" />;
      case "health":
        return <BookOpen className="h-5 w-5" />;
      default:
        return <Layers className="h-5 w-5" />;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dataset Packs</h1>
        <p className="text-muted-foreground">
          Download research datasets as local knowledge bundles for retrieval
        </p>
      </div>

      {/* Info banner */}
      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <HardDrive className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Local-First Storage</h3>
              <p className="text-sm text-muted-foreground">
                Dataset packs are stored locally using IndexedDB. Mini variants are perfect for testing,
                while full variants provide complete corpus coverage for production use.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datasets grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {datasets.map(dataset => {
            const miniPack = getPackStatus(dataset.id, "mini");
            const fullPack = getPackStatus(dataset.id, "full");

            return (
              <Card key={dataset.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {getCategoryIcon(dataset.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{dataset.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {dataset.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Badge variant="outline">{dataset.category}</Badge>
                  </div>

                  {/* Variants */}
                  <div className="space-y-3">
                    {/* Mini variant */}
                    {dataset.has_mini_variant && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium text-sm">Mini</div>
                          <div className="text-xs text-muted-foreground">
                            {formatBytes(dataset.mini_size_bytes)}
                          </div>
                        </div>
                        {miniPack?.status === "ready" ? (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Installed
                          </Badge>
                        ) : miniPack?.status === "downloading" ? (
                          <div className="flex items-center gap-2 w-32">
                            <Progress value={miniPack.download_progress} className="h-2" />
                            <span className="text-xs text-muted-foreground w-8">
                              {miniPack.download_progress}%
                            </span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(dataset, "mini")}
                            disabled={downloadingPacks.has(`${dataset.id}-mini`)}
                          >
                            {downloadingPacks.has(`${dataset.id}-mini`) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Full variant */}
                    {dataset.has_full_variant && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium text-sm">Full</div>
                          <div className="text-xs text-muted-foreground">
                            {formatBytes(dataset.full_size_bytes)}
                          </div>
                        </div>
                        {fullPack?.status === "ready" ? (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Installed
                          </Badge>
                        ) : fullPack?.status === "downloading" ? (
                          <div className="flex items-center gap-2 w-32">
                            <Progress value={fullPack.download_progress} className="h-2" />
                            <span className="text-xs text-muted-foreground w-8">
                              {fullPack.download_progress}%
                            </span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(dataset, "full")}
                            disabled={downloadingPacks.has(`${dataset.id}-full`)}
                          >
                            {downloadingPacks.has(`${dataset.id}-full`) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
