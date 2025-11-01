import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Clock, Users, DollarSign, User, Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Footer from "@/components/Footer";

const bookingSchema = z.object({
  start_date: z.string().min(1, "Date is required"),
  group_size: z.number().min(1, "At least 1 person required"),
  special_requests: z.string().max(500, "Maximum 500 characters"),
});

const BrowseTours = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [guides, setGuides] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bookingData, setBookingData] = useState({
    start_date: "",
    group_size: 1,
    special_requests: "",
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const { data: toursData, error: toursError } = await supabase
        .from('tours')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (toursError) throw toursError;

      if (toursData && toursData.length > 0) {
        const guideIds = [...new Set(toursData.map(t => t.guide_id))];
        
        const { data: guidesData, error: guidesError } = await supabase
          .from('guide_profiles')
          .select('*')
          .in('user_id', guideIds);

        if (guidesError) throw guidesError;

        const guidesMap: Record<string, any> = {};
        guidesData?.forEach(guide => {
          guidesMap[guide.user_id] = guide;
        });

        setGuides(guidesMap);
      }

      setTours(toursData || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        title: "Error",
        description: "Failed to load tours",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to book a tour",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      bookingSchema.parse({
        ...bookingData,
        group_size: Number(bookingData.group_size),
      });

      const totalAmount = selectedTour.price_per_person * bookingData.group_size;

      const { error } = await supabase
        .from('bookings')
        .insert([{
          tourist_id: session.user.id,
          guide_id: selectedTour.guide_id,
          tour_id: selectedTour.id,
          destination: selectedTour.destination,
          start_date: new Date(bookingData.start_date).toISOString(),
          duration_hours: selectedTour.duration_hours,
          total_amount: totalAmount,
          special_requests: bookingData.special_requests || null,
          status: 'pending',
        }]);

      if (error) throw error;

      toast({
        title: "Booking request sent!",
        description: "The guide will review your booking request.",
      });

      setDialogOpen(false);
      setBookingData({ start_date: "", group_size: 1, special_requests: "" });
      navigate("/trips");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Booking failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const openBookingDialog = (tour: any) => {
    setSelectedTour(tour);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Discover Amazing Tours
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse tours offered by our experienced local guides
            </p>
          </div>

          {tours.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-12 text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tours available at the moment</p>
                <p className="text-sm mt-2">Check back soon for new tours!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour) => {
                const guide = guides[tour.guide_id];
                return (
                  <Card key={tour.id} className="hover:shadow-xl transition-shadow flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-xl text-foreground">{tour.title}</CardTitle>
                      {guide && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>by {guide.full_name}</span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                        {tour.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{tour.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>{tour.duration_hours} hours</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>Max {tour.max_group_size} people</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground font-bold text-lg">
                          <DollarSign className="h-5 w-5 flex-shrink-0" />
                          <span>NPR {tour.price_per_person}/person</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => openBookingDialog(tour)}
                        className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90 mt-4"
                      >
                        Book This Tour
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book: {selectedTour?.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Tour Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={bookingData.start_date}
                onChange={(e) => setBookingData({ ...bookingData, start_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="group_size">Number of People</Label>
              <Input
                id="group_size"
                name="group_size"
                type="number"
                value={bookingData.group_size}
                onChange={(e) => setBookingData({ ...bookingData, group_size: parseInt(e.target.value) })}
                min="1"
                max={selectedTour?.max_group_size || 10}
                required
              />
              {errors.group_size && <p className="text-sm text-destructive">{errors.group_size}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="special_requests">Special Requests (Optional)</Label>
              <Textarea
                id="special_requests"
                name="special_requests"
                value={bookingData.special_requests}
                onChange={(e) => setBookingData({ ...bookingData, special_requests: e.target.value })}
                placeholder="Any special requirements or preferences..."
                rows={3}
                maxLength={500}
              />
              {errors.special_requests && <p className="text-sm text-destructive">{errors.special_requests}</p>}
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount:</span>
                <span className="text-xl font-bold text-foreground">
                  NPR {selectedTour && (selectedTour.price_per_person * bookingData.group_size).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-ocean text-primary-foreground hover:opacity-90">
                Confirm Booking
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default BrowseTours;