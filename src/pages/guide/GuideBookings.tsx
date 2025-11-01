import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Calendar, ArrowLeft, CheckCircle, XCircle, Clock, MapPin, Users, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const GuideBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [scheduleRequests, setScheduleRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchBookings();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/guide/auth");
    }
  };

  const fetchBookings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch bookings assigned to this guide
      const { data: assignedBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('guide_id', session.user.id)
        .order('start_date', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch schedule requests (bookings without guide_id or tour_id)
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('bookings')
        .select('*')
        .is('guide_id', null)
        .is('tour_id', null)
        .eq('status', 'pending')
        .order('start_date', { ascending: false });

      if (scheduleError) throw scheduleError;

      setBookings(assignedBookings || []);
      setScheduleRequests(scheduleData || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const finalizeBooking = async (bookingId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('finalize-booking', {
        body: { booking_id: bookingId },
      });

      if (error) throw error;

      toast({
        title: "Booking accepted",
        description: "Commission deducted from your token balance.",
      });

      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Unable to accept booking. If your token balance is low, please recharge.",
        variant: "destructive",
      });
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    if (status === 'confirmed') {
      return finalizeBooking(bookingId);
    }
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking updated",
        description: `Booking ${status} successfully.`,
      });

      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const acceptScheduleRequest = async (bookingId: string) => {
    try {
      await finalizeBooking(bookingId);
    } catch (error) {
      // finalizeBooking already handles toasts
    }
  };

  const declineScheduleRequest = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Request declined",
        description: "The trip request has been declined.",
      });

      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings;
    return bookings.filter(b => b.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Compass className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/guide" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">My Bookings</h1>
          <p className="text-muted-foreground">Manage your tour bookings</p>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 max-w-full sm:max-w-2xl h-auto">
            <TabsTrigger value="requests" className="text-xs sm:text-sm">
              Schedule Requests
              {scheduleRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2">{scheduleRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
            <TabsTrigger value="confirmed" className="text-xs sm:text-sm">Confirmed</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            {renderScheduleRequests()}
          </TabsContent>

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

  function renderBookings(filteredBookings: any[]) {
    if (filteredBookings.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bookings found</p>
          </CardContent>
        </Card>
      );
    }

    return filteredBookings.map((booking) => (
      <Card key={booking.id}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-lg sm:text-xl mb-2 text-foreground">{booking.destination}</CardTitle>
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
                <h4 className="font-semibold text-sm mb-1 text-foreground">Special Requests</h4>
                <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">NPR {booking.total_amount}</p>
              </div>

              {booking.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-ocean text-primary-foreground hover:opacity-90"
                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </div>
              )}

              {booking.status === 'confirmed' && (
                <Button
                  size="sm"
                  className="bg-gradient-ocean text-primary-foreground hover:opacity-90"
                  onClick={() => updateBookingStatus(booking.id, 'completed')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  }

  function renderScheduleRequests() {
    if (scheduleRequests.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No custom trip requests at the moment</p>
            <p className="text-sm mt-2">Tourists can request custom trips that you can accept</p>
          </CardContent>
        </Card>
      );
    }

    return scheduleRequests.map((request) => (
      <Card key={request.id} className="border-primary/30">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-lg sm:text-xl mb-2 text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {request.destination}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(request.start_date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {request.duration_hours}h
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {request.group_size || 1} people
                </span>
              </div>
            </div>
            <Badge variant="secondary">Custom Request</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {request.special_requests && (
              <div>
                <h4 className="font-semibold text-sm mb-1 text-foreground">Trip Details</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.special_requests}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">Tourist Budget</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-1">
                  <DollarSign className="h-5 w-5" />
                  NPR {Number(request.total_amount).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => declineScheduleRequest(request.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-ocean text-primary-foreground hover:opacity-90"
                  onClick={() => acceptScheduleRequest(request.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept Request
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  }
};

export default GuideBookings;
