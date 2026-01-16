import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Search, Package, Download, Star, TrendingUp } from "lucide-react";

const MOCK_BUNDLES = [
  {
    id: "1",
    title: "Medical Q&A Corpus",
    description: "Curated medical knowledge base with 50k+ verified Q&A pairs",
    category: "Health",
    downloads: 1240,
    rating: 4.8,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Legal Document Templates",
    description: "Comprehensive legal document collection for contract analysis",
    category: "Legal",
    downloads: 890,
    rating: 4.6,
    isFeatured: true,
  },
  {
    id: "3",
    title: "Technical Documentation Hub",
    description: "Software engineering documentation and best practices",
    category: "Tech",
    downloads: 2100,
    rating: 4.9,
    isFeatured: false,
  },
  {
    id: "4",
    title: "Academic Paper Summaries",
    description: "ML/AI research paper summaries from top conferences",
    category: "Research",
    downloads: 560,
    rating: 4.5,
    isFeatured: false,
  },
];

export default function MarketplacePage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bundle Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and download community-created knowledge bundles
          </p>
        </div>
        <Button variant="outline">
          <Package className="h-4 w-4 mr-2" />
          Publish Bundle
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search bundles..."
          className="pl-10"
        />
      </div>

      {/* Featured */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Featured Bundles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_BUNDLES.filter(b => b.isFeatured).map(bundle => (
            <Card key={bundle.id} className="border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{bundle.title}</CardTitle>
                    <CardDescription>{bundle.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{bundle.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {bundle.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      {bundle.rating}
                    </span>
                  </div>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Install
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All bundles */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Bundles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_BUNDLES.map(bundle => (
            <Card key={bundle.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{bundle.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">{bundle.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2 text-sm">
                  {bundle.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {bundle.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      {bundle.rating}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coming soon notice */}
      <Card className="mt-8 bg-muted/30">
        <CardContent className="py-6 text-center">
          <Store className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            The marketplace is currently in preview. More bundles coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
