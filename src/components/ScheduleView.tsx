import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ScheduleView = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [guides, setGuides] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchBookings();
  }, []);

  const checkAuthAndFetchBookings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('tourist_id', session.user.id)
        .in('status', ['confirmed', 'pending'])
        .order('start_date', { ascending: true });

      if (bookingsError) throw bookingsError;

      // Fetch guide profiles
      if (bookingsData && bookingsData.length > 0) {
        const guideIds = [...new Set(bookingsData.map(b => b.guide_id))];
        
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

      setBookings(bookingsData || []);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const groupBookingsByMonth = () => {
    const grouped: Record<string, any[]> = {};
    
    bookings.forEach(booking => {
      const date = new Date(booking.start_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(booking);
    });

    return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
  };

  if (loading) {
    return (
      <section className="py-12 px-4 min-h-screen">
        <div className="container mx-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="py-12 px-4 min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-bold mb-2 text-foreground">View Your Schedule</h2>
              <p className="text-muted-foreground mb-6">
                Log in to see your upcoming tours and bookings
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-gradient-ocean text-primary-foreground hover:opacity-90"
              >
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (bookings.length === 0) {
    return (
      <section className="py-12 px-4 min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-bold mb-2 text-foreground">No Scheduled Tours</h2>
              <p className="text-muted-foreground mb-6">
                You don't have any upcoming tours yet. Browse available tours to get started!
              </p>
              <Button 
                onClick={() => navigate("/trips")}
                className="bg-gradient-ocean text-primary-foreground hover:opacity-90"
              >
                Browse Tours
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const groupedBookings = groupBookingsByMonth();

  return (
    <section className="py-12 px-4 min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">My Schedule</h1>
          <p className="text-muted-foreground">Your upcoming tours and bookings</p>
        </div>

        <div className="space-y-8">
          {groupedBookings.map(([monthKey, monthBookings]) => {
            const [year, month] = monthKey.split('-');
            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            });

            return (
              <div key={monthKey} className="space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {monthName}
                </h2>

                <div className="space-y-4">
                  {monthBookings.map((booking) => {
                    const guide = guides[booking.guide_id];
                    const bookingDate = new Date(booking.start_date);
                    
                    return (
                      <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="text-3xl font-bold text-primary">
                                  {bookingDate.getDate()}
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs text-muted-foreground uppercase">
                                    {bookingDate.toLocaleDateString('en-US', { weekday: 'long' })}
                                  </div>
                                  <CardTitle className="text-lg text-foreground">
                                    {booking.destination}
                                  </CardTitle>
                                </div>
                              </div>
                              
                              {guide && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                  <User className="h-4 w-4" />
                                  <span>Guide: {guide.full_name}</span>
                                </div>
                              )}
                            </div>
                            
                            <Badge
                              variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                              className="self-start"
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{booking.duration_hours} hours</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.destination}</span>
                            </div>
                          </div>

                          {booking.special_requests && (
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                              <p className="text-xs font-semibold text-foreground mb-1">Special Requests:</p>
                              <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
                            </div>
                          )}

                          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                            <div>
                              <p className="text-xs text-muted-foreground">Total Amount</p>
                              <p className="text-lg font-bold text-foreground">
                                NPR {Number(booking.total_amount).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate("/trips")}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScheduleView;
