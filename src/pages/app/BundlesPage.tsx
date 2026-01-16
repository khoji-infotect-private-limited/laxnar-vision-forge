import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Package,
  Plus,
  Upload,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
  HardDrive,
  MoreVertical,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Bundle {
  id: string;
  name: string;
  kind: string;
  description: string | null;
  document_count: number;
  chunk_count: number;
  size_bytes: number;
  is_active: boolean;
  health_status: string;
  created_at: string;
}

export default function BundlesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("bundles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bundles",
        variant: "destructive",
      });
    } else {
      setBundles(data || []);
    }
    setIsLoading(false);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    // Sanitize filename for bundle name
    const bundleName = file.name
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special chars
      .trim()
      .slice(0, 50);

    // Simulate import (in real app, would process file and create chunks)
    setTimeout(async () => {
      const { error } = await supabase.from("bundles").insert({
        user_id: user?.id,
        name: bundleName,
        kind: "user_import",
        description: `Imported from ${file.name}`,
        document_count: 1,
        chunk_count: Math.floor(file.size / 1000), // Rough estimate
        size_bytes: file.size,
        is_active: bundles.length === 0,
        health_status: "healthy",
      });

      if (error) {
        toast({
          title: "Import failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Bundle created",
          description: `"${bundleName}" has been imported successfully`,
        });
        fetchBundles();
      }

      setIsImporting(false);
      setImportDialogOpen(false);
    }, 2000);
  };

  const handleSetActive = async (bundleId: string) => {
    // Deactivate all, then activate selected
    await supabase.from("bundles").update({ is_active: false }).neq("id", "");
    await supabase.from("bundles").update({ is_active: true }).eq("id", bundleId);
    
    toast({ title: "Active bundle updated" });
    fetchBundles();
  };

  const handleDelete = async (bundleId: string) => {
    const { error } = await supabase.from("bundles").delete().eq("id", bundleId);
    
    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Bundle deleted" });
      fetchBundles();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getKindLabel = (kind: string) => {
    switch (kind) {
      case "user_import":
        return "Imported";
      case "dataset_pack":
        return "Dataset";
      case "marketplace":
        return "Marketplace";
      default:
        return kind;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Bundles</h1>
          <p className="text-muted-foreground">
            Manage your local knowledge bundles for deterministic retrieval
          </p>
        </div>

        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Import Bundle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Document</DialogTitle>
              <DialogDescription>
                Upload a PDF, DOCX, or TXT file to create a new knowledge bundle.
                Documents will be chunked using MS-MARCO-like passage sizing (~56 tokens).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                {isImporting ? (
                  <div className="flex flex-col items-center gap-2">
                    <Progress value={66} className="w-32" />
                    <span className="text-sm text-muted-foreground">Processing...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PDF, DOCX, or TXT
                    </span>
                  </>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileImport}
                  disabled={isImporting}
                />
              </label>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bundles grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : bundles.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bundles yet</h3>
            <p className="text-muted-foreground mb-4">
              Import a document or download a dataset pack to get started
            </p>
            <Button onClick={() => setImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import Your First Bundle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bundles.map(bundle => (
            <Card
              key={bundle.id}
              className={bundle.is_active ? "ring-2 ring-primary" : ""}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate flex items-center gap-2">
                      {bundle.name}
                      {bundle.is_active && (
                        <Star className="h-4 w-4 text-primary fill-primary" />
                      )}
                    </CardTitle>
                    <CardDescription className="truncate">
                      {bundle.description || "No description"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!bundle.is_active && (
                        <DropdownMenuItem onClick={() => handleSetActive(bundle.id)}>
                          <Star className="h-4 w-4 mr-2" />
                          Set as Active
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(bundle.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{getKindLabel(bundle.kind)}</Badge>
                  <Badge
                    variant={bundle.health_status === "healthy" ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {bundle.health_status === "healthy" ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {bundle.health_status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {bundle.document_count} docs
                  </div>
                  <div className="text-muted-foreground">
                    {bundle.chunk_count} chunks
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <HardDrive className="h-3 w-3" />
                    {formatBytes(bundle.size_bytes)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
