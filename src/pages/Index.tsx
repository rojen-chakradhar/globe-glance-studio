import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Plane, Navigation, MessageCircle, Globe, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Plane className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Wanderlust</span>
            </Link>
            <div className="flex items-center gap-4">
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
                <TabsTrigger value="travelbuddy" className="text-foreground hover:text-primary transition-colors data-[state=active]:bg-primary/10">
                  <Users className="h-4 w-4 mr-2" />
                  TravelBuddy
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
                <div className="max-w-6xl mx-auto">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center shadow-elevated mb-8">
                    <div className="text-center">
                      <Navigation className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg">Interactive map view</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Link to="/auth">
                      <Button size="lg" className="bg-gradient-ocean text-primary-foreground hover:opacity-90 text-lg px-8 py-6">
                        Need a travel buddy?
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* TravelBuddy Tab Content */}
          <TabsContent value="travelbuddy" className="m-0">
            <section className="py-12 px-4 min-h-screen">
              <div className="container mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-ocean mb-6">
                    <Users className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Travel Buddy</h1>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Connect with fellow travelers and explore the world together
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  <Card className="hover:shadow-elevated transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-ocean mb-4">
                        <Users className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">Match with Travelers</h3>
                      <p className="text-muted-foreground">Find companions who share your travel interests and style</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-elevated transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-ocean mb-4">
                        <MessageCircle className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">Chat & Plan</h3>
                      <p className="text-muted-foreground">Communicate and plan your adventures together</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-elevated transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-ocean mb-4">
                        <Globe className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">Global Community</h3>
                      <p className="text-muted-foreground">Join a worldwide network of adventure seekers</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center mt-12">
                  <Link to="/auth">
                    <Button size="lg" className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                      Start Finding Buddies
                    </Button>
                  </Link>
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
    </div>
  );
};

export default Index;
