import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Plane, Navigation, MessageCircle, Globe, Calendar, Clock, Star, Languages, Home, Car, Sparkles, ChevronDown, Search, CalendarDays, Menu, X, User, Settings, HelpCircle, Gift, Shield, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import InteractiveMap from "@/components/InteractiveMap";
import TravelChatbot from "@/components/TravelChatbot";
import Footer from "@/components/Footer";
import ScheduleView from "@/components/ScheduleView";
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

const Index = () => {
  // Map Filters state used in the Map tab (25% sidebar / 75% map)
  const [filters, setFilters] = useState({
    time: "",
    stay: "",
    vehicle: { needed: false, type: "" },
    interests: [] as string[],
    duration: 4, // hours
  });
  
  const [searchLocation, setSearchLocation] = useState("");
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleLocationSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchLocation.trim()) {
      setShowMobileMap(true);
    }
  };

  const timeOptions = ["1 hour", "Few hours (2-4)", "Half day", "Full day", "2-3 days", "Week+"];
  const stayOptions = ["No stay needed", "Homestay", "Hotel", "Hostel", "Resort"];
  const vehicleTypes = ["Bike/Scooter", "Car", "SUV", "Bus", "Jeep"];
  const interestOptions = ["Nature", "Culture", "Tradition", "Local areas", "Adventure", "Food", "Religious sites"];

  const handleInterestToggle = (interest: string) => {
    setFilters((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
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

          {/* Map Tab Content */}
          <TabsContent value="map" className="m-0">
            <section className="py-12 px-4 min-h-screen">
              <div className="container mx-auto">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold mb-2">Live Guide Tracking</h2>
                    <p className="text-muted-foreground">
                      Green markers show available guides. Click on any guide to see their details and request them.
                    </p>
                  </div>

                  {/* Sidebar (25%) + Map (75%) */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    {/* Mobile Search and Filter - Only visible on mobile */}
                    <div className="lg:hidden space-y-4 mb-4">
                      {/* Location Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="text" 
                          placeholder="Where to?" 
                          className="w-full pl-10"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          onKeyDown={handleLocationSearch}
                        />
                      </div>
                      
                      {/* Filter Button */}
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            variant="default"
                            className="w-full"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Show Filters
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto z-[1100]">
                          <div className="space-y-6 pt-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                              <Sparkles className="h-5 w-5 text-primary" />
                              Filters
                            </h2>

                            {/* Duration Filter */}
                            <Collapsible defaultOpen>
                              <CollapsibleTrigger className="flex items-center justify-between w-full">
                                <h3 className="font-medium text-foreground">Guide Duration</h3>
                                <ChevronDown className="h-4 w-4" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pt-4 space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-foreground">Hours needed</Label>
                                    <span className="text-sm font-semibold text-primary">{filters.duration}h</span>
                                  </div>
                                  <Slider
                                    value={[filters.duration]}
                                    onValueChange={(value) => setFilters({ ...filters, duration: value[0] })}
                                    min={1}
                                    max={24}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>1h</span>
                                    <span>24h</span>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Vehicle */}
                            <Collapsible defaultOpen>
                              <CollapsibleTrigger className="flex items-center justify-between w-full">
                                <h3 className="font-medium text-foreground">Vehicle</h3>
                                <ChevronDown className="h-4 w-4" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pt-4 space-y-4">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="mobile-vehicle-needed"
                                    checked={filters.vehicle.needed}
                                    onCheckedChange={(checked) =>
                                      setFilters({
                                        ...filters,
                                        vehicle: { ...filters.vehicle, needed: checked as boolean },
                                      })
                                    }
                                  />
                                  <Label htmlFor="mobile-vehicle-needed" className="text-foreground">Vehicle Needed</Label>
                                </div>
                                {filters.vehicle.needed && (
                                  <RadioGroup
                                    value={filters.vehicle.type}
                                    onValueChange={(value) =>
                                      setFilters({
                                        ...filters,
                                        vehicle: { ...filters.vehicle, type: value },
                                      })
                                    }
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="car" id="mobile-car" />
                                      <Label htmlFor="mobile-car" className="text-foreground">Car</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="bike" id="mobile-bike" />
                                      <Label htmlFor="mobile-bike" className="text-foreground">Bike</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="van" id="mobile-van" />
                                      <Label htmlFor="mobile-van" className="text-foreground">Van</Label>
                                    </div>
                                  </RadioGroup>
                                )}
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Interests */}
                            <Collapsible defaultOpen>
                              <CollapsibleTrigger className="flex items-center justify-between w-full">
                                <h3 className="font-medium text-foreground">Interests</h3>
                                <ChevronDown className="h-4 w-4" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pt-4 space-y-2">
                                {["Cultural", "Adventure", "Food", "History", "Nature", "Shopping"].map((interest) => (
                                  <div key={interest} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`mobile-${interest.toLowerCase()}`}
                                      checked={filters.interests.includes(interest)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setFilters({
                                            ...filters,
                                            interests: [...filters.interests, interest],
                                          });
                                        } else {
                                          setFilters({
                                            ...filters,
                                            interests: filters.interests.filter((i) => i !== interest),
                                          });
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`mobile-${interest.toLowerCase()}`} className="text-foreground">{interest}</Label>
                                  </div>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Apply Filter Button */}
                            <Button 
                              className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90"
                              onClick={() => {
                                console.log("Filtering with:", filters);
                              }}
                            >
                              Apply Filters
                            </Button>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>

                    {/* Mobile Map - Shows only when location is searched */}
                    {showMobileMap && (
                      <div className="lg:hidden relative z-0 mb-4">
                        <InteractiveMap filters={filters} searchLocation={searchLocation} showBuddies={true} />
                      </div>
                    )}

                    {/* Map Container - Left side on desktop, hidden on mobile */}
                    <div className="lg:col-span-3 relative z-0 hidden lg:block">
                      <InteractiveMap filters={filters} searchLocation={searchLocation} showBuddies={!!searchLocation} />
                    </div>

                    {/* Filter Sidebar - Right side on desktop, hidden on mobile */}
                    <Card className="p-6 space-y-6 sticky top-[120px] lg:col-span-1 hidden lg:block">
                      {/* Desktop Location Search */}
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-2 block">Search Location</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="text" 
                            placeholder="Where to?" 
                            className="w-full pl-10"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            onKeyDown={handleLocationSearch}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Filters
                        </h2>
                      </div>

                      {/* Duration Filter */}
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <h3 className="font-medium text-foreground">Guide Duration</h3>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4 space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-foreground">Hours needed</Label>
                              <span className="text-sm font-semibold text-primary">{filters.duration}h</span>
                            </div>
                            <Slider
                              value={[filters.duration]}
                              onValueChange={(value) => setFilters({ ...filters, duration: value[0] })}
                              min={1}
                              max={24}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>1h</span>
                              <span>24h</span>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Vehicle */}
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <h3 className="font-medium text-foreground">Vehicle</h3>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4 space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="vehicle-needed"
                              checked={filters.vehicle.needed}
                              onCheckedChange={(checked) =>
                                setFilters({
                                  ...filters,
                                  vehicle: { ...filters.vehicle, needed: checked as boolean },
                                })
                              }
                            />
                            <Label htmlFor="vehicle-needed" className="text-foreground">Vehicle Needed</Label>
                          </div>
                          {filters.vehicle.needed && (
                            <RadioGroup
                              value={filters.vehicle.type}
                              onValueChange={(value) =>
                                setFilters({
                                  ...filters,
                                  vehicle: { ...filters.vehicle, type: value },
                                })
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="car" id="car" />
                                <Label htmlFor="car" className="text-foreground">Car</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="bike" id="bike" />
                                <Label htmlFor="bike" className="text-foreground">Bike</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="van" id="van" />
                                <Label htmlFor="van" className="text-foreground">Van</Label>
                              </div>
                            </RadioGroup>
                          )}
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Interests */}
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <h3 className="font-medium text-foreground">Interests</h3>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4 space-y-2">
                          {["Cultural", "Adventure", "Food", "History", "Nature", "Shopping"].map((interest) => (
                            <div key={interest} className="flex items-center space-x-2">
                              <Checkbox
                                id={interest.toLowerCase()}
                                checked={filters.interests.includes(interest)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFilters({
                                      ...filters,
                                      interests: [...filters.interests, interest],
                                    });
                                  } else {
                                    setFilters({
                                      ...filters,
                                      interests: filters.interests.filter((i) => i !== interest),
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor={interest.toLowerCase()} className="text-foreground">{interest}</Label>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Apply Filter Button */}
                      <Button 
                        className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90"
                        onClick={() => {
                          console.log("Filtering with:", filters);
                        }}
                      >
                        Apply Filters
                      </Button>
                    </Card>
                  </div>

                  <div className="text-center mt-8">
                    <p className="text-sm text-muted-foreground mb-4">
                      All guides are licensed and certified by Nepal Tourism Board
                    </p>
                  </div>
                </div>

                {/* About Us Section */}
                <div className="container mx-auto mt-16 px-4">
                  <div className="max-w-4xl mx-auto bg-card rounded-lg p-8 shadow-md">
                    <h2 className="text-3xl font-bold text-center mb-6">About Us</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        Welcome to Travelone - your premier platform for discovering the wonders of Nepal with certified local guides. 
                        We connect travelers from around the world with experienced, licensed guides who know Nepal's hidden gems and cultural treasures.
                      </p>
                      <p>
                        Founded by a team of travel enthusiasts and technology experts, our mission is to make Nepal more accessible 
                        to tourists while supporting local guide communities. Every guide on our platform is certified by the Nepal Tourism Board 
                        and has undergone rigorous training in safety, cultural sensitivity, and hospitality.
                      </p>
                      <p>
                        Whether you're looking to trek the Himalayas, explore ancient temples, taste authentic Nepali cuisine, or experience 
                        the vibrant culture of Kathmandu, our guides are here to make your journey unforgettable. With real-time tracking, 
                        multilingual support, and 24/7 customer service, we ensure your safety and satisfaction throughout your adventure.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">500+</div>
                          <div className="text-sm">Certified Guides</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                          <div className="text-sm">Happy Travelers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
                          <div className="text-sm">Average Rating</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Schedule Tab Content */}
          <TabsContent value="schedule" className="m-0">
            <ScheduleView />
          </TabsContent>

          {/* Trips Tab Content */}
          <TabsContent value="trips" className="m-0">
            <section className="py-12 px-4 min-h-screen">
              <div className="container mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-ocean mb-6">
                    <Plane className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">My Trips</h1>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    View and manage all your upcoming and past travel adventures
                  </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Upcoming Trips</h2>
                    <Card className="mb-4 hover:shadow-elevated transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-primary" />
                              Santorini, Greece
                            </h3>
                            <div className="flex flex-wrap gap-4 text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Jun 15 - Jun 22, 2025
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Confirmed
                              </span>
                              <span>2 travelers</span>
                            </div>
                          </div>
                          <Button className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="mb-4 hover:shadow-elevated transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-primary" />
                              Bali, Indonesia
                            </h3>
                            <div className="flex flex-wrap gap-4 text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Aug 10 - Aug 20, 2025
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Pending
                              </span>
                              <span>3 travelers</span>
                            </div>
                          </div>
                          <Button className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center pt-8">
                    <Button size="lg" className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                      Plan New Trip
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chatbot */}
      <TravelChatbot />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
