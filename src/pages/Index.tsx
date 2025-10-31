import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Plane, Navigation, MessageCircle, Globe, Calendar, Clock, Star, Languages, Home, Car, Sparkles, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import InteractiveMap from "@/components/InteractiveMap";
import TravelChatbot from "@/components/TravelChatbot";
import Footer from "@/components/Footer";
import traveloneLogo from "@/assets/travelone-logo.png";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Index = () => {
  // Map Filters state used in the Map tab (25% sidebar / 75% map)
  const [filters, setFilters] = useState({
    time: "",
    stay: "",
    vehicle: { needed: false, type: "" },
    interests: [] as string[],
  });

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={traveloneLogo} alt="Travelone Logo" className="h-8 w-8 logo-default" />
              <span className="text-xl font-bold text-foreground">Travelone</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/events">
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                  Events
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                  Login
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content with Tabs */}
      <div className="pt-[73px]">
        <Tabs defaultValue="map" className="w-full">
          {/* Tab Buttons */}
          <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 py-3">
              <TabsList className="flex items-center justify-center gap-4 bg-transparent">
                <TabsTrigger value="map" className="text-foreground hover:text-primary transition-colors data-[state=active]:bg-primary/10">
                  <MapPin className="h-4 w-4 mr-2" />
                  Map
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
                    {/* Filter Sidebar */}
                    <Card className="p-6 space-y-6 sticky top-[120px] lg:col-span-1">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Filters
                      </h2>

                      {/* Time Filter */}
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <Label className="text-base font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Duration
                          </Label>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 space-y-2">
                          <RadioGroup value={filters.time} onValueChange={(value) => setFilters(prev => ({ ...prev, time: value }))}>
                            {timeOptions.map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`time-${option}`} />
                                <Label htmlFor={`time-${option}`} className="font-normal cursor-pointer">{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Stay Filter */}
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <Label className="text-base font-medium flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Accommodation
                          </Label>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 space-y-2">
                          <RadioGroup value={filters.stay} onValueChange={(value) => setFilters(prev => ({ ...prev, stay: value }))}>
                            {stayOptions.map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`stay-${option}`} />
                                <Label htmlFor={`stay-${option}`} className="font-normal cursor-pointer">{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Vehicle Filter */}
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <Label className="text-base font-medium flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            Vehicle
                          </Label>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="vehicle-needed" 
                              checked={filters.vehicle.needed}
                              onCheckedChange={(checked) => 
                                setFilters(prev => ({ ...prev, vehicle: { ...prev.vehicle, needed: checked as boolean } }))
                              }
                            />
                            <Label htmlFor="vehicle-needed" className="font-normal cursor-pointer">Vehicle needed</Label>
                          </div>
                          {filters.vehicle.needed && (
                            <RadioGroup 
                              value={filters.vehicle.type} 
                              onValueChange={(value) => setFilters(prev => ({ ...prev, vehicle: { ...prev.vehicle, type: value } }))}
                              className="ml-6"
                            >
                              {vehicleTypes.map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                  <RadioGroupItem value={type} id={`vehicle-${type}`} />
                                  <Label htmlFor={`vehicle-${type}`} className="font-normal cursor-pointer">{type}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          )}
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Interests Filter */}
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <Label className="text-base font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Interests
                          </Label>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 space-y-2">
                          {interestOptions.map((interest) => (
                            <div key={interest} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`interest-${interest}`}
                                checked={filters.interests.includes(interest)}
                                onCheckedChange={() => handleInterestToggle(interest)}
                              />
                              <Label htmlFor={`interest-${interest}`} className="font-normal cursor-pointer">{interest}</Label>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>

                    {/* Map Container */}
                    <div className="lg:col-span-3">
                      <InteractiveMap />
                    </div>
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
