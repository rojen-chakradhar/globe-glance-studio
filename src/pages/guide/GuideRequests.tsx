import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, MapPin, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface TourRequest {
  id: string;
  destination: string;
  requirements: string;
  offered_price: number;
  created_at: string;
  has_shown_interest?: boolean;
}

export default function GuideRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<TourRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TourRequest | null>(null);
  const [counterPrice, setCounterPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkGuideAccess();
    fetchRequests();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("guide-requests")
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkGuideAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/guide/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (!roles?.some((r) => r.role === "guide")) {
      navigate("/guide/auth");
    }
  };

  const fetchRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: requestsData, error } = await supabase
        .from("tour_requests")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Check which requests the guide has already shown interest in
      const { data: interests } = await supabase
        .from("guide_interests")
        .select("request_id")
        .eq("guide_id", user.id);

      const interestRequestIds = new Set(interests?.map((i) => i.request_id) || []);

      const requestsWithInterestStatus = (requestsData || []).map((request) => ({
        ...request,
        has_shown_interest: interestRequestIds.has(request.id),
      }));

      setRequests(requestsWithInterestStatus);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowInterest = (request: TourRequest) => {
    setSelectedRequest(request);
    setCounterPrice(request.offered_price);
    setMessage("");
  };

  const handleSubmitInterest = async () => {
    if (!selectedRequest) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("guide_interests").insert({
        request_id: selectedRequest.id,
        guide_id: user.id,
        counter_offer_price: counterPrice,
        message,
      });

      if (error) throw error;

      toast.success("Interest submitted! Tourist will see your offer.");
      setSelectedRequest(null);
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
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
        <Link to="/guide" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">Incoming Buddy Requests</h1>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No requests available at the moment.</p>
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
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-2xl font-bold">
                        <DollarSign className="h-5 w-5" />
                        ₹{request.offered_price}
                      </div>
                      <div className="text-sm text-muted-foreground">per day</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Requirements:</Label>
                    <p className="text-muted-foreground mt-1">{request.requirements}</p>
                  </div>

                  {request.has_shown_interest ? (
                    <Badge variant="secondary">Already Shown Interest</Badge>
                  ) : (
                    <Button onClick={() => handleShowInterest(request)} className="w-full">
                      Show Interest
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Show Interest</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Your Price Offer (NPR per day)</Label>
                <Input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  min="0"
                  step="10"
                />
                <p className="text-xs text-muted-foreground">
                  Tourist's budget: ₹{selectedRequest?.offered_price}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Message (Optional)</Label>
                <Textarea
                  placeholder="Tell them why you're the perfect guide for their trip..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSubmitInterest}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Interest"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
