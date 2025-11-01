import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import ReviewForm from "@/components/ReviewForm";
import { format } from "date-fns";

interface Booking {
  id: string;
  destination: string;
  start_date: string;
  duration_hours: number;
  total_amount: number;
  status: string;
  guide_id: string | null;
  guide_profiles: {
    full_name: string;
    user_id: string;
  } | null;
  reviews: Array<{ id: string }>;
}

export default function MyBookings() {
  const { formatPrice } = useCurrency();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to view bookings");
        return;
      }

      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .eq("tourist_id", user.id)
        .order("created_at", { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch guide profiles and reviews separately
      const bookingsWithDetails = await Promise.all(
        (bookingsData || []).map(async (booking) => {
          let guideProfile = null;
          let reviews = [];

          if (booking.guide_id) {
            const { data: profileData } = await supabase
              .from("guide_profiles")
              .select("full_name, user_id")
              .eq("user_id", booking.guide_id)
              .single();
            guideProfile = profileData;
          }

          const { data: reviewsData } = await supabase
            .from("reviews")
            .select("id")
            .eq("booking_id", booking.id);
          reviews = reviewsData || [];

          return {
            ...booking,
            guide_profiles: guideProfile,
            reviews,
          };
        })
      );

      setBookings(bookingsWithDetails);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "confirmed":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
          <p className="text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">
                No bookings yet. Start exploring tours!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{booking.destination}</CardTitle>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {booking.guide_profiles && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Guide:</span>
                        <span>{booking.guide_profiles.full_name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(booking.start_date), "PPP 'at' p")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.duration_hours} hours</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-primary">
                        {formatPrice(Number(booking.total_amount))}
                      </span>
                    </div>

                    {booking.status === "completed" && (
                      <>
                        {booking.reviews && booking.reviews.length > 0 ? (
                          <div className="pt-2 border-t">
                            <div className="flex items-center gap-2 text-green-600">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm font-medium">
                                Review submitted
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-2 border-t">
                            <Button
                              onClick={() =>
                                setShowReviewForm(
                                  showReviewForm === booking.id ? null : booking.id
                                )
                              }
                              variant="outline"
                              className="w-full"
                            >
                              <Star className="w-4 h-4 mr-2" />
                              {showReviewForm === booking.id
                                ? "Cancel Review"
                                : "Write a Review"}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {showReviewForm === booking.id &&
                  booking.guide_profiles &&
                  booking.status === "completed" && (
                    <ReviewForm
                      bookingId={booking.id}
                      guideId={booking.guide_profiles.user_id}
                      guideName={booking.guide_profiles.full_name}
                      onSuccess={() => {
                        setShowReviewForm(null);
                        fetchBookings();
                      }}
                    />
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
