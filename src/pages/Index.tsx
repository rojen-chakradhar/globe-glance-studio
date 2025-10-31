import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Plane, Navigation, MessageCircle, Globe, Calendar, Clock, Star, Languages } from "lucide-react";
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
                  <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg shadow-elevated mb-8 overflow-hidden">
                    {/* Map-like background with markers */}
                    <div className="absolute inset-0 opacity-20">
                      <svg className="w-full h-full" viewBox="0 0 800 600">
                        <path d="M 100 300 Q 200 200 300 300 T 500 300 T 700 300" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M 150 150 Q 250 100 350 150 T 550 150 T 750 150" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M 50 450 Q 150 400 250 450 T 450 450 T 650 450" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    </div>
                    
                    {/* Location markers */}
                    <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                      <MapPin className="h-8 w-8 text-primary fill-primary animate-pulse" />
                    </div>
                    <div className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                      <MapPin className="h-8 w-8 text-primary fill-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>
                    <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <MapPin className="h-8 w-8 text-primary fill-primary animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                    
                    {/* Center overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center bg-background/80 backdrop-blur-sm p-6 rounded-lg">
                        <Navigation className="h-12 w-12 text-primary mx-auto mb-4" />
                        <p className="text-foreground text-lg font-semibold">Explore Travel Destinations</p>
                        <p className="text-muted-foreground text-sm mt-2">Interactive map coming soon</p>
                      </div>
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
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Tourist Guides</h1>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Connect with experienced local guides for authentic travel experiences
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  {/* Guide 1 */}
                  <Card className="hover:shadow-elevated transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Maria Santos" />
                          <AvatarFallback>MS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Maria Santos</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Paris, France</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">4.9</span>
                            <span className="text-sm text-muted-foreground">(127 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Expert in art history and French cuisine. 8 years experience showing travelers the hidden gems of Paris.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, French, Spanish
                        </Badge>
                      </div>
                      <Button className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90">
                        Contact Guide
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Guide 2 */}
                  <Card className="hover:shadow-elevated transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Kenji Tanaka" />
                          <AvatarFallback>KT</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Kenji Tanaka</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Tokyo, Japan</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">5.0</span>
                            <span className="text-sm text-muted-foreground">(98 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Specializing in traditional Japanese culture and modern Tokyo. Certified tour guide with 10+ years experience.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, Japanese, Mandarin
                        </Badge>
                      </div>
                      <Button className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90">
                        Contact Guide
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Guide 3 */}
                  <Card className="hover:shadow-elevated transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" alt="Sofia Rodriguez" />
                          <AvatarFallback>SR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Sofia Rodriguez</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Barcelona, Spain</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">4.8</span>
                            <span className="text-sm text-muted-foreground">(156 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Architecture enthusiast and food lover. I'll show you the best tapas bars and Gaudí's masterpieces.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, Spanish, Catalan
                        </Badge>
                      </div>
                      <Button className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90">
                        Contact Guide
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Guide 4 */}
                  <Card className="hover:shadow-elevated transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="Marco Rossi" />
                          <AvatarFallback>MR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Marco Rossi</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Rome, Italy</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">4.9</span>
                            <span className="text-sm text-muted-foreground">(203 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        History professor and Rome native. Let me take you through 2000 years of fascinating Roman history.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, Italian, German
                        </Badge>
                      </div>
                      <Button className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90">
                        Contact Guide
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Guide 5 */}
                  <Card className="hover:shadow-elevated transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Emma Wilson" />
                          <AvatarFallback>EW</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Emma Wilson</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>London, UK</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">4.7</span>
                            <span className="text-sm text-muted-foreground">(89 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Royal history expert and theater enthusiast. Discover London's rich cultural heritage and West End magic.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, French
                        </Badge>
                      </div>
                      <Button className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90">
                        Contact Guide
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Guide 6 */}
                  <Card className="hover:shadow-elevated transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="Ahmed Hassan" />
                          <AvatarFallback>AH</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Ahmed Hassan</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Cairo, Egypt</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">5.0</span>
                            <span className="text-sm text-muted-foreground">(142 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Egyptologist with 15 years experience. Unlock the mysteries of ancient Egypt and the pyramids.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, Arabic, French
                        </Badge>
                      </div>
                      <Button className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90">
                        Contact Guide
                      </Button>
                    </CardContent>
                  </Card>
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
