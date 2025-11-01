import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, DollarSign, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import traveloneLogo from "@/assets/travelone-logo.png";

const Trips = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchBookings();
  }, []);

  const checkAuthAndFetchBookings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to view your bookings",
        });
        navigate("/auth");
        return;
      }

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('tourist_id', session.user.id)
        .order('start_date', { ascending: false });

      if (bookingsError) throw bookingsError;

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

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings;
    return bookings.filter(b => b.status === status);
  };

  const renderBookings = (filteredBookings: any[]) => {
    if (filteredBookings.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bookings found</p>
            <Button 
              onClick={() => navigate("/tours")}
              className="mt-4 bg-gradient-ocean text-primary-foreground hover:opacity-90"
            >
              Browse Tours
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {filteredBookings.map((booking) => {
          const guide = guides[booking.guide_id];
          return (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl mb-2 text-foreground">
                      {booking.destination}
                    </CardTitle>
                    {guide && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <User className="h-4 w-4" />
                        <span>Guide: {guide.full_name}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(booking.start_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {booking.duration_hours}h
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      booking.status === 'confirmed'
                        ? 'default'
                        : booking.status === 'pending'
                        ? 'secondary'
                        : booking.status === 'completed'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {booking.special_requests && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1 text-foreground flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Special Requests
                      </h4>
                      <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">
                        NPR {Number(booking.total_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <div className="bg-gradient-ocean shadow-md">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
            <img src={traveloneLogo} alt="Travelone Logo" className="h-10 w-10 logo-footer" />
            Travelone
          </Link>
          <div className="flex gap-6 text-primary-foreground">
            <Link to="/map" className="hover:opacity-80 transition-opacity">Map</Link>
            <Link to="/tours" className="hover:opacity-80 transition-opacity">Tours</Link>
            <Link to="/trips" className="hover:opacity-80 transition-opacity font-semibold">My Bookings</Link>
            <Link to="/events" className="hover:opacity-80 transition-opacity">Events</Link>
          </div>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your tour bookings</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-full sm:max-w-md h-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
            <TabsTrigger value="confirmed" className="text-xs sm:text-sm">Confirmed</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {renderBookings(filterBookings('all'))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {renderBookings(filterBookings('pending'))}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            {renderBookings(filterBookings('confirmed'))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {renderBookings(filterBookings('completed'))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Trips;