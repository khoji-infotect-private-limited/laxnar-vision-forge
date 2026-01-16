import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, MessageSquare, Globe, Lock, Plus } from "lucide-react";

const MOCK_ROOMS = [
  {
    id: "1",
    name: "PRISM Development",
    description: "Official room for PRISM development discussions",
    members: 156,
    isPublic: true,
    lastActive: "2 min ago",
  },
  {
    id: "2",
    name: "ML Research Papers",
    description: "Discuss latest ML/AI research papers and implementations",
    members: 89,
    isPublic: true,
    lastActive: "15 min ago",
  },
  {
    id: "3",
    name: "Knowledge Engineering",
    description: "Best practices for building knowledge bundles",
    members: 45,
    isPublic: true,
    lastActive: "1 hour ago",
  },
  {
    id: "4",
    name: "Private Team Room",
    description: "Team collaboration space",
    members: 8,
    isPublic: false,
    lastActive: "5 min ago",
  },
];

export default function RoomsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Community Rooms</h1>
          <p className="text-muted-foreground">
            Join discussions and collaborate with other PRISM users
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Room
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search rooms..."
          className="pl-10"
        />
      </div>

      {/* Rooms list */}
      <div className="space-y-4">
        {MOCK_ROOMS.map(room => (
          <Card key={room.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  {room.isPublic ? (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <Badge variant={room.isPublic ? "secondary" : "outline"}>
                  {room.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
              <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {room.members} members
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Active {room.lastActive}
                  </span>
                </div>
                <Button size="sm">Join</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming soon notice */}
      <Card className="mt-8 bg-muted/30">
        <CardContent className="py-6 text-center">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            Community rooms are currently in preview. Real-time chat coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
