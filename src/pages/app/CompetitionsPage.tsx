import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Calendar, Users, Award } from "lucide-react";

const MOCK_COMPETITIONS = [
  {
    id: "1",
    title: "PRISM Retrieval Challenge 2024",
    description: "Build the most accurate retrieval system on the BEIR benchmark",
    prize: "$10,000",
    participants: 234,
    endDate: "March 31, 2024",
    progress: 65,
    status: "active",
  },
  {
    id: "2",
    title: "Knowledge Bundle Hackathon",
    description: "Create innovative knowledge bundles for specialized domains",
    prize: "$5,000",
    participants: 89,
    endDate: "February 28, 2024",
    progress: 80,
    status: "active",
  },
  {
    id: "3",
    title: "Efficiency Challenge",
    description: "Optimize retrieval latency while maintaining accuracy",
    prize: "$7,500",
    participants: 156,
    endDate: "January 15, 2024",
    progress: 100,
    status: "completed",
  },
];

export default function CompetitionsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Competitions</h1>
        <p className="text-muted-foreground">
          Participate in challenges and win prizes
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_COMPETITIONS.map(comp => (
          <Card key={comp.id} className={comp.status === "completed" ? "opacity-75" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {comp.title}
                    {comp.status === "completed" && (
                      <Badge variant="secondary">Completed</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {comp.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary font-bold">
                    <Award className="h-4 w-4" />
                    {comp.prize}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {comp.participants} participants
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Ends {comp.endDate}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{comp.progress}%</span>
                </div>
                <Progress value={comp.progress} className="h-2" />
              </div>

              {comp.status === "active" && (
                <Button size="sm" className="w-full">
                  Join Competition
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-muted/30">
        <CardContent className="py-6 text-center">
          <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            More competitions coming soon. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
