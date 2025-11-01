import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const STANDARD_PRICE = 500;
const PRICE_INCREMENT = 10;

export default function FindBuddy() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [requirements, setRequirements] = useState("");
  const [price, setPrice] = useState(STANDARD_PRICE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePriceChange = (increment: boolean) => {
    setPrice((prev) => {
      const newPrice = increment ? prev + PRICE_INCREMENT : prev - PRICE_INCREMENT;
      return Math.max(0, newPrice);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to find a buddy");
        navigate("/auth");
        return;
      }

      // Get user's current location
      let lat = null;
      let lng = null;
      
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        } catch (error) {
          console.log("Location not available");
        }
      }

      const { error } = await supabase.from("tour_requests").insert({
        tourist_id: user.id,
        destination,
        requirements,
        offered_price: price,
        tourist_location_lat: lat,
        tourist_location_lng: lng,
      });

      if (error) throw error;

      toast.success("Request posted! Guides will start showing interest soon.");
      navigate("/my-requests");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Find Your Travel Buddy</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="destination">Where do you want to go?</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Pokhara, Chitwan, Kathmandu"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">What are you looking for?</Label>
                <Textarea
                  id="requirements"
                  placeholder="Describe what activities you want, language preferences, any special requirements..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  required
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Your Budget (NPR per day)</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePriceChange(false)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold">₹{price}</div>
                    <div className="text-sm text-muted-foreground">
                      Standard: ₹{STANDARD_PRICE}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePriceChange(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Adjust in ₹{PRICE_INCREMENT} increments
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Find Buddy"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
