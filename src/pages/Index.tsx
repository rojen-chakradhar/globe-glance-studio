import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Plane, Navigation, MessageCircle, Globe, Calendar, Clock, Star, Languages, Home, Car, Sparkles, ChevronDown, CalendarDays, Menu, X, User, Settings, HelpCircle, Gift, Shield, LogOut, DollarSign, FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import TravelChatbot from "@/components/TravelChatbot";
import Footer from "@/components/Footer";
import { useCurrency } from "@/contexts/CurrencyContext";
import Map from "./Map";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const bookingSchema = z.object({
  start_date: z.string().min(1, "Date is required"),
  group_size: z.number().min(1, "At least 1 person required"),
  special_requests: z.string().max(500, "Maximum 500 characters"),
});

const scheduleSchema = z.object({
  destination: z.string().min(1, "Destination is required").max(100, "Maximum 100 characters"),
  start_date: z.string().min(1, "Date is required"),
  duration_hours: z.number().min(1, "At least 1 hour required").max(72, "Maximum 72 hours"),
  group_size: z.number().min(1, "At least 1 person required"),
  budget: z.number().min(0, "Budget must be positive"),
  special_requests: z.string().max(1000, "Maximum 1000 characters"),
});

const Index = () => {
  const { currency, setCurrency } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Trips/Bookings state
  const [bookings, setBookings] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [guides, setGuides] = useState<Record<string, any>>({});
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tripsLoading, setTripsLoading] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    start_date: "",
    group_size: 1,
    special_requests: "",
  });

  const [scheduleData, setScheduleData] = useState({
    destination: "",
    start_date: "",
    duration_hours: 4,
    group_size: 1,
    budget: 0,
    special_requests: "",
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTripsData();
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const fetchTripsData = async () => {
    if (!user) return;
    
    try {
      setTripsLoading(true);
      
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('tourist_id', user.id)
        .order('start_date', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch available tours
      const { data: toursData, error: toursError } = await supabase
        .from('tours')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (toursError) throw toursError;

      // Fetch guide profiles
      const allGuideIds = [
        ...new Set([
          ...(bookingsData?.map(b => b.guide_id).filter(Boolean) || []),
          ...(toursData?.map(t => t.guide_id) || [])
        ])
      ];

      if (allGuideIds.length > 0) {
        const { data: guidesData, error: guidesError } = await supabase
          .from('guide_profiles')
          .select('*')
          .in('user_id', allGuideIds);

        if (guidesError) throw guidesError;

        const guidesMap: Record<string, any> = {};
        guidesData?.forEach(guide => {
          guidesMap[guide.user_id] = guide;
        });

        setGuides(guidesMap);
      }

      setBookings(bookingsData || []);
      setTours(toursData || []);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setTripsLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to book a tour",
          variant: "destructive",
        });
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
          tourist_id: user.id,
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
      fetchTripsData();
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

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create a schedule request",
          variant: "destructive",
        });
        return;
      }

      scheduleSchema.parse({
        ...scheduleData,
        duration_hours: Number(scheduleData.duration_hours),
        group_size: Number(scheduleData.group_size),
        budget: Number(scheduleData.budget),
      });

      const { error } = await supabase
        .from('bookings')
        .insert([{
          tourist_id: user.id,
          guide_id: null,
          tour_id: null,
          destination: scheduleData.destination,
          start_date: new Date(scheduleData.start_date).toISOString(),
          duration_hours: scheduleData.duration_hours,
          total_amount: scheduleData.budget,
          special_requests: scheduleData.special_requests || null,
          status: 'pending',
        }]);

      if (error) throw error;

      toast({
        title: "Schedule request sent!",
        description: "Guides can now view and accept your custom trip request.",
      });

      setScheduleData({
        destination: "",
        start_date: "",
        duration_hours: 4,
        group_size: 1,
        budget: 0,
        special_requests: "",
      });
      fetchTripsData();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Failed to create request",
          description: error.message,
          variant: "destructive",
        });
      }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-ocean">
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Travelone</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
            {user ? (
                <>
              <Link to="/map">
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Buddy on Map
                </Button>
              </Link>
                  <Link to="/my-requests">
                    <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                      My Requests
                    </Button>
                  </Link>
                  <Link to="/events">
                    <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                      Events
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <div className="h-8 w-8 rounded-full bg-gradient-ocean flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 z-[1100] bg-background">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/discounts" className="cursor-pointer">
                          <Gift className="mr-2 h-4 w-4" />
                          Discounts & Gifts
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/safety" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          Safety
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/support" className="cursor-pointer">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Support
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link to="/events">
                    <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                      Events
                    </Button>
                  </Link>
                  <Link to="/guide/auth?mode=signup">
                    <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                      Become a Guide
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth?mode=signup">
                    <Button className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] z-[1100]">
                <div className="flex flex-col gap-4 mt-8">
                  {user ? (
                    <>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary transition-colors">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </Link>
                      <Link to="/map" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary transition-colors">
                          <Users className="mr-2 h-4 w-4" />
                          Find Buddy on Map
                        </Button>
                      </Link>
                      <Link to="/my-requests" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary transition-colors">
                          <FileText className="mr-2 h-4 w-4" />
                          My Requests
                        </Button>
                      </Link>
                      <Link to="/events" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary transition-colors">
                          Events
                        </Button>
                      </Link>
                      <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary transition-colors">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </Link>
                      <Link to="/discounts" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary transition-colors">
                          <Gift className="mr-2 h-4 w-4" />
                          Discounts & Gifts
                        </Button>
                      </Link>
                      <Link to="/safety" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary transition-colors">
                          <Shield className="mr-2 h-4 w-4" />
                          Safety
                        </Button>
                      </Link>
                      <Link to="/support" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary transition-colors">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Support
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-foreground hover:text-primary transition-colors"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/events" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary transition-colors">
                          Events
                        </Button>
                      </Link>
                      <Link to="/guide/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary transition-colors">
                          Become a Guide
                        </Button>
                      </Link>
                      <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary transition-colors">
                          Login
                        </Button>
                      </Link>
                      <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Content with Tabs */}
      <div className="pt-[73px]">
        <Tabs defaultValue="map" className="w-full">
          {/* Tab Buttons */}
          <div className="sticky top-[73px] z-[900] bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 py-3">
              <TabsList className="flex items-center justify-center gap-4 bg-transparent">
                <TabsTrigger value="map" className="text-foreground hover:text-primary transition-colors data-[state=active]:bg-primary/10">
                  <Users className="h-4 w-4 mr-2" />
                  Find Buddies
                </TabsTrigger>
                <TabsTrigger value="schedule" className="text-foreground hover:text-primary transition-colors data-[state=active]:bg-primary/10">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="trips" className="text-foreground hover:text-primary transition-colors data-[state=active]:bg-primary/10">
                  <Plane className="h-4 w-4 mr-2" />
                  Trips
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Find Buddies Tab Content */}
          <TabsContent value="map" className="m-0">
            <Map />
          </TabsContent>

          {/* Schedule Tab Content */}
          <TabsContent value="schedule" className="m-0">
            <section className="py-12 px-4 min-h-screen">
              <div className="container mx-auto max-w-2xl">
                {user ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Request Custom Trip</CardTitle>
                      <p className="text-muted-foreground">Create a custom trip request and guides will be able to view and accept it</p>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleScheduleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="destination">Destination</Label>
                          <Input
                            id="destination"
                            name="destination"
                            value={scheduleData.destination}
                            onChange={(e) => setScheduleData({ ...scheduleData, destination: e.target.value })}
                            placeholder="e.g., Pokhara, Chitwan, Lumbini"
                            required
                          />
                          {errors.destination && <p className="text-sm text-destructive">{errors.destination}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="schedule_start_date">Start Date</Label>
                          <Input
                            id="schedule_start_date"
                            name="start_date"
                            type="date"
                            value={scheduleData.start_date}
                            onChange={(e) => setScheduleData({ ...scheduleData, start_date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                          {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="duration_hours">Duration (hours)</Label>
                          <Input
                            id="duration_hours"
                            name="duration_hours"
                            type="number"
                            value={scheduleData.duration_hours}
                            onChange={(e) => setScheduleData({ ...scheduleData, duration_hours: parseInt(e.target.value) })}
                            min="1"
                            max="72"
                            required
                          />
                          {errors.duration_hours && <p className="text-sm text-destructive">{errors.duration_hours}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="schedule_group_size">Number of People</Label>
                          <Input
                            id="schedule_group_size"
                            name="group_size"
                            type="number"
                            value={scheduleData.group_size}
                            onChange={(e) => setScheduleData({ ...scheduleData, group_size: parseInt(e.target.value) })}
                            min="1"
                            required
                          />
                          {errors.group_size && <p className="text-sm text-destructive">{errors.group_size}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="budget">Budget (NPR)</Label>
                          <Input
                            id="budget"
                            name="budget"
                            type="number"
                            value={scheduleData.budget}
                            onChange={(e) => setScheduleData({ ...scheduleData, budget: parseFloat(e.target.value) })}
                            min="0"
                            placeholder="Your estimated budget"
                            required
                          />
                          {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="schedule_special_requests">Trip Details & Preferences</Label>
                          <Textarea
                            id="schedule_special_requests"
                            name="special_requests"
                            value={scheduleData.special_requests}
                            onChange={(e) => setScheduleData({ ...scheduleData, special_requests: e.target.value })}
                            placeholder="Describe what you'd like to do, places to visit, preferences..."
                            rows={4}
                            maxLength={1000}
                          />
                          {errors.special_requests && <p className="text-sm text-destructive">{errors.special_requests}</p>}
                        </div>

                        <Button type="submit" className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90">
                          <Plus className="h-4 w-4 mr-2" />
                          Send Request
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                    <p className="text-muted-foreground mb-6">Please log in to create custom trip requests</p>
                    <Link to="/auth">
                      <Button className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                        Go to Login
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>

          {/* Trips Tab Content */}
          <TabsContent value="trips" className="m-0">
            <section className="py-12 px-4 min-h-screen">
              <div className="container mx-auto">
                {user ? (
                  <>
                    <div className="mb-8">
                      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">My Trips</h1>
                      <p className="text-muted-foreground">Browse tours and manage your bookings</p>
                    </div>

                    {tripsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <Tabs defaultValue="tours" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 max-w-full sm:max-w-2xl h-auto">
                          <TabsTrigger value="tours" className="text-xs sm:text-sm">Tours</TabsTrigger>
                          <TabsTrigger value="all" className="text-xs sm:text-sm">All Bookings</TabsTrigger>
                          <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
                          <TabsTrigger value="confirmed" className="text-xs sm:text-sm">Confirmed</TabsTrigger>
                          <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed</TabsTrigger>
                        </TabsList>

                        <TabsContent value="tours" className="space-y-4">
                          {tours.length === 0 ? (
                            <Card>
                              <CardContent className="py-12 text-center text-muted-foreground">
                                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No tours available at the moment</p>
                                <p className="text-sm mt-2">Check back soon for new tours!</p>
                              </CardContent>
                            </Card>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Plane className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                    <p className="text-muted-foreground mb-6">Please log in to view and book tours</p>
                    <Link to="/auth">
                      <Button className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                        Go to Login
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chatbot */}
      <TravelChatbot />
      
      {/* Footer */}
      <Footer />

      {/* Booking Dialog */}
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

    </div>
  );
};

export default Index;
