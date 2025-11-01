import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft, Star, MapPin } from "lucide-react";

interface TourRequest {
  id: string;
  destination: string;
  requirements: string;
  offered_price: number;
  duration_hours: number;
  status: string;
  created_at: string;
}

interface GuideInterest {
  id: string;
  counter_offer_price: number;
  message: string;
  created_at: string;
  guide_profiles: {
    full_name: string;
    profile_image_url: string | null;
    rating: number;
    experience_years: number;
    specializations: string[];
    languages: string[];
    bio: string;
    location: string;
    user_id: string;
  };
}

export default function InterestedGuides() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [interests, setInterests] = useState<GuideInterest[]>([]);
  const [request, setRequest] = useState<TourRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterests();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("interested-guides")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guide_interests",
          filter: `request_id=eq.${requestId}`,
        },
        () => {
          fetchInterests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  const fetchInterests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch request details
      const { data: requestData } = await supabase
        .from("tour_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (requestData?.tourist_id !== user.id) {
        toast.error("Unauthorized");
        navigate("/my-requests");
        return;
      }

      setRequest(requestData);

      // Fetch interests
      const { data: interestsData, error } = await supabase
        .from("guide_interests")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch guide profiles for each interest
      const interestsWithProfiles = await Promise.all(
        (interestsData || []).map(async (interest) => {
          const { data: profile } = await supabase
            .from("guide_profiles")
            .select("*")
            .eq("user_id", interest.guide_id)
            .single();

          return {
            ...interest,
            guide_profiles: profile!,
          };
        })
      );

      setInterests(interestsWithProfiles);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGuide = async (interest: GuideInterest) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update the request with selected guide
      const { error } = await supabase
        .from("tour_requests")
        .update({
          selected_guide_id: interest.guide_profiles.user_id,
          status: "in_progress",
        })
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Guide selected! Preparing your meeting route...");
      navigate(`/meeting-route/${requestId}`);
    } catch (error: any) {
      toast.error(error.message);
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
        <Link to="/my-requests" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to My Requests
        </Link>

        <h1 className="text-3xl font-bold mb-6">Interested Guides</h1>

        {request && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-semibold">Destination:</span> {request.destination}
              </div>
              <div>
                <span className="font-semibold">Duration:</span> {request.duration_hours} hours
              </div>
              <div>
                <span className="font-semibold">Your Budget:</span> ₹{request.offered_price}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <Badge variant={request.status === "open" ? "default" : "secondary"}>
                  {request.status}
                </Badge>
              </div>
              {request.requirements && (
                <div>
                  <span className="font-semibold">Requirements:</span>
                  <p className="mt-1 text-muted-foreground">{request.requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {interests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No guides have shown interest yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {interests.map((interest) => (
              <Card key={interest.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={interest.guide_profiles.profile_image_url || ""} />
                      <AvatarFallback>
                        {interest.guide_profiles.full_name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="mb-1">{interest.guide_profiles.full_name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {interest.guide_profiles.rating.toFixed(1)}
                        </div>
                        <div>{interest.guide_profiles.experience_years} years exp</div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {interest.guide_profiles.location}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {interest.guide_profiles.languages.map((lang) => (
                          <Badge key={lang} variant="secondary">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">₹{interest.counter_offer_price}</div>
                      <div className="text-sm text-muted-foreground">per day</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {interest.guide_profiles.bio && (
                    <p className="text-sm text-muted-foreground">{interest.guide_profiles.bio}</p>
                  )}

                  {interest.guide_profiles.specializations.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Specializations:</div>
                      <div className="flex flex-wrap gap-2">
                        {interest.guide_profiles.specializations.map((spec) => (
                          <Badge key={spec} variant="outline">{spec}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {interest.message && (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-sm font-medium mb-1">Guide's Message:</div>
                      <p className="text-sm">{interest.message}</p>
                    </div>
                  )}

                  <Button onClick={() => handleSelectGuide(interest)} className="w-full">
                    Select This Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
