import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Compass, Calendar, DollarSign, Star, LogOut, User, Settings, Menu, X, Clock, MapPin, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const GuideDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [guideProfile, setGuideProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [showKycBanner, setShowKycBanner] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (kycStatus !== 'approved') {
      e.preventDefault();
      e.stopPropagation();
      setShowVerifyModal(true);
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchData();
    checkKycStatus();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/guide/auth");
      return;
    }

    // Check if user has guide role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'guide')
      .single();

    if (!roles) {
      navigate("/guide/auth");
      return;
    }

    setUser(session.user);
  };

  const checkKycStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: kyc, error } = await supabase
        .from("kyc_verifications")
        .select("verification_status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching KYC status:", error);
        return;
      }

      if (!kyc) {
        setShowKycBanner(true);
        setKycStatus(null);
      } else {
        setKycStatus(kyc.verification_status);
        setShowKycBanner(kyc.verification_status !== 'approved');
      }
    } catch (error) {
      console.error("Error checking KYC status:", error);
    }
  };

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch guide profile
      const { data: profile } = await supabase
        .from('guide_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      setGuideProfile(profile);

      // Fetch bookings
      const { data: bookingData } = await supabase
        .from('bookings')
        .select('*')
        .eq('guide_id', session.user.id)
        .order('start_date', { ascending: false });

      setBookings(bookingData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/guide/auth");
  };

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    totalEarnings: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.total_amount), 0),
    rating: guideProfile?.rating || 0,
  };

  const groupBookingsByMonth = () => {
    const upcomingBookings = bookings.filter(b => 
      ['confirmed', 'pending'].includes(b.status) && 
      new Date(b.start_date) >= new Date()
    );
    
    const grouped: Record<string, any[]> = {};
    
    upcomingBookings.forEach(booking => {
      const date = new Date(booking.start_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(booking);
    });

    return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
  };

  const renderSchedule = () => {
    const groupedBookings = groupBookingsByMonth();

    if (groupedBookings.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-bold mb-2 text-foreground">No Upcoming Tours</h3>
            <p className="text-muted-foreground mb-4">You don't have any scheduled tours yet.</p>
            <Link to="/guide/bookings">
              <Button className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                View All Bookings
              </Button>
            </Link>
          </CardContent>
        </Card>
      );
    }

    return (
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
                            <p className="text-xs text-muted-foreground">Amount</p>
                            <p className="text-lg font-bold text-foreground">
                              NPR {Number(booking.total_amount).toLocaleString()}
                            </p>
                          </div>
                          <Link to="/guide/bookings">
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </Link>
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
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Compass className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Verify Account Modal */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Verify Your Account Now</DialogTitle>
            <DialogDescription>
              You need to complete KYC verification to access the guide dashboard and start accepting bookings.
            </DialogDescription>
          </DialogHeader>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              setShowVerifyModal(false);
              navigate('/guide/kyc');
            }}
            className="w-full"
          >
            Go to KYC Verification
          </Button>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
              <div className="h-10 w-10 rounded-full bg-gradient-ocean flex items-center justify-center">
                <Compass className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Travelone Buddies</h1>
                <p className="text-xs text-muted-foreground">Guide Dashboard</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={(e) => handleNavClick(e, "/guide/tours")}>
                <Calendar className="h-4 w-4 mr-2" />
                My Tours
              </Button>
              <Button variant="ghost" size="sm" onClick={(e) => handleNavClick(e, "/guide/bookings")}>
                <Calendar className="h-4 w-4 mr-2" />
                Bookings
              </Button>
              <Button variant="ghost" size="sm" onClick={(e) => handleNavClick(e, "/guide/profile")}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, "/guide/tours");
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                My Tours
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, "/guide/bookings");
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Bookings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, "/guide/profile");
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* KYC Verification Banner */}
        {showKycBanner && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Account Verification Required</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span>
                {kycStatus === 'pending' 
                  ? "Your KYC verification is under review. You'll be notified once approved."
                  : kycStatus === 'rejected'
                  ? "Your KYC verification was rejected. Please resubmit with correct information."
                  : "Please verify your account to start accepting bookings and tours."}
              </span>
              {!kycStatus && (
                <Button 
                  variant="outline" 
                  className="shrink-0"
                  onClick={() => navigate("/guide/kyc")}
                >
                  Verify Now
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
            Welcome back, {guideProfile?.full_name || 'Guide'}!
          </h2>
          <p className="text-muted-foreground">Here's your activity overview</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">All time bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Pending</CardTitle>
                  <Calendar className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.pendingBookings}</div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">NPR {stats.totalEarnings.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">From completed tours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Rating</CardTitle>
                  <Star className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.rating.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">{guideProfile?.total_reviews || 0} reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No bookings yet</p>
                    <p className="text-sm">Your upcoming tours will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{booking.destination}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.start_date).toLocaleDateString()} • {booking.duration_hours}h
                          </p>
                        </div>
                        <div className="flex items-center gap-3 sm:text-right">
                          <div>
                            <p className="font-semibold text-foreground">NPR {booking.total_amount}</p>
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            {renderSchedule()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GuideDashboard;
