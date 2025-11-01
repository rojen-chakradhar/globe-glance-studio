import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface TourRequest {
  id: string;
  destination: string;
  requirements: string;
  offered_price: number;
  status: string;
  created_at: string;
  interests_count?: number;
}

export default function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<TourRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("my-requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tour_requests",
        },
        () => {
          fetchRequests();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guide_interests",
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: requestsData, error } = await supabase
        .from("tour_requests")
        .select("*")
        .eq("tourist_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch interest counts for each request
      const requestsWithCounts = await Promise.all(
        (requestsData || []).map(async (request) => {
          const { count } = await supabase
            .from("guide_interests")
            .select("*", { count: "exact", head: true })
            .eq("request_id", request.id);

          return { ...request, interests_count: count || 0 };
        })
      );

      setRequests(requestsWithCounts);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      open: "default",
      in_progress: "secondary",
      completed: "outline",
      cancelled: "outline",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Buddy Requests</h1>
          <Button onClick={() => navigate("/find-buddy")}>New Request</Button>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No requests yet. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {request.destination}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        Posted {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      {getStatusBadge(request.status)}
                      <div className="text-2xl font-bold">₹{request.offered_price}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{request.requirements}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {request.interests_count} guide{request.interests_count !== 1 ? "s" : ""} interested
                      </span>
                    </div>
                    
                    {request.interests_count > 0 && request.status === "open" && (
                      <Button
                        onClick={() => navigate(`/interested-guides/${request.id}`)}
                      >
                        View Interested Guides
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
