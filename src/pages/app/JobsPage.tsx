import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, ExternalLink } from "lucide-react";

const MOCK_JOBS = [
  {
    id: "1",
    title: "ML Engineer - Knowledge Systems",
    company: "Laxnar AI",
    location: "Remote",
    type: "Full-time",
    posted: "2 days ago",
    tags: ["Python", "PyTorch", "NLP"],
  },
  {
    id: "2",
    title: "Research Scientist - Information Retrieval",
    company: "Tech Corp",
    location: "San Francisco, CA",
    type: "Full-time",
    posted: "1 week ago",
    tags: ["Research", "IR", "Dense Retrieval"],
  },
  {
    id: "3",
    title: "Senior Frontend Developer",
    company: "AI Startup",
    location: "Remote",
    type: "Contract",
    posted: "3 days ago",
    tags: ["React", "TypeScript", "WebAssembly"],
  },
];

export default function JobsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <p className="text-muted-foreground">
          Career opportunities in AI and knowledge systems
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_JOBS.map(job => (
          <Card key={job.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span>{job.company}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.posted}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant="outline">{job.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {job.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-muted/30">
        <CardContent className="py-6 text-center">
          <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            Jobs board coming soon. Check back for opportunities!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
