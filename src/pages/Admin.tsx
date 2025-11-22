import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";

interface Submission {
  id: string;
  company_name: string;
  founder_name: string;
  founder_background: string;
  idea: string;
  revenue_model: string;
  usp: string;
  email: string;
  phone: string;
  cin: string;
  created_at: string;
  verified_company_name?: string;
  company_status?: string;
  verification_id?: string;
}

const Admin = () => {
  const [passcode, setPasscode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('get-submissions', {
        body: { passcode }
      });

      if (error) {
        toast({
          title: "Access Denied",
          description: "Invalid passcode",
          variant: "destructive"
        });
        return;
      }

      setIsVerified(true);
      setSubmissions(data.submissions || []);
      toast({
        title: "Access Granted",
        description: `Loaded ${data.submissions?.length || 0} submissions`
      });
    } catch (error) {
      console.error('[ADMIN] Error:', error);
      toast({
        title: "Error",
        description: "Failed to verify passcode",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter passcode to view submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode">Passcode</Label>
                <Input
                  id="passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Access Panel"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Submissions Database</h1>
          <p className="text-muted-foreground mt-2">
            Total submissions: {submissions.length}
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">S.No</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Founder Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>CIN</TableHead>
                    <TableHead>Idea</TableHead>
                    <TableHead>Revenue Model</TableHead>
                    <TableHead>USP</TableHead>
                    <TableHead>Background</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission, index) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{submission.company_name || '-'}</TableCell>
                      <TableCell>{submission.founder_name || '-'}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.phone}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {submission.cin || '-'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {submission.idea}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {submission.revenue_model}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {submission.usp}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {submission.founder_background}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          submission.company_status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {submission.company_status || 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(submission.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {submissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                        No submissions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
