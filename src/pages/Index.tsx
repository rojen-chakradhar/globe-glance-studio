import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Plane, Navigation, MessageCircle, Globe, Calendar, Clock, Star, Languages } from "lucide-react";
import { Link } from "react-router-dom";
import InteractiveMap from "@/components/InteractiveMap";
import TravelChatbot from "@/components/TravelChatbot";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Plane className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Nepal Travel Guide</span>
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
                  <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold mb-2">Live Guide Tracking</h2>
                    <p className="text-muted-foreground">
                      Green markers show available guides. Click on any guide to see their details and request them.
                    </p>
                  </div>
                  <InteractiveMap />
                  
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
                        Welcome to Nepal Travel Guide - your premier platform for discovering the wonders of Nepal with certified local guides. 
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

          {/* TravelBuddy Tab Content */}
          <TabsContent value="travelbuddy" className="m-0">
            <section className="py-12 px-4 min-h-screen">
              <div className="container mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-ocean mb-6">
                    <Users className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Nepal Tourist Guides</h1>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Connect with certified local guides for an authentic Nepali experience
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  {/* Guide 1 */}
                  <Card className="hover:shadow-elevated transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh" alt="Ramesh Sharma" />
                          <AvatarFallback>RS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Ramesh Sharma</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Kathmandu, Nepal</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">4.8</span>
                            <span className="text-sm text-muted-foreground">(143 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Cultural heritage expert. Specialized in Kathmandu Valley temples and monasteries.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, Hindi, Nepali
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
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sita" alt="Sita Gurung" />
                          <AvatarFallback>SG</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Sita Gurung</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Pokhara, Nepal</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">4.9</span>
                            <span className="text-sm text-muted-foreground">(167 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Mountain trekking specialist. 15+ years experience guiding Annapurna trails.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, Nepali, Japanese
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
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Krishna" alt="Krishna Thapa" />
                          <AvatarFallback>KT</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Krishna Thapa</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Bhaktapur, Nepal</span>
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
                        Medieval architecture enthusiast. Expert in Newari culture and traditions.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, Nepali, French
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
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" alt="Maya Rai" />
                          <AvatarFallback>MR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Maya Rai</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Kathmandu, Nepal</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">5.0</span>
                            <span className="text-sm text-muted-foreground">(201 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Food and culture specialist. Authentic Nepali cuisine and cooking class tours.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, Nepali, German
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
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bikash" alt="Bikash Lama" />
                          <AvatarFallback>BL</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Bikash Lama</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Chitwan, Nepal</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">4.6</span>
                            <span className="text-sm text-muted-foreground">(76 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Wildlife and nature expert. Specialized in jungle safaris and bird watching.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, Nepali, Chinese
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
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pasang" alt="Pasang Sherpa" />
                          <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">Pasang Sherpa</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Lukla, Nepal</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">5.0</span>
                            <span className="text-sm text-muted-foreground">(234 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Everest Base Camp expert. Mountaineering guide with 20+ successful summits.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          English, Nepali, Tibetan
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

      {/* Chatbot */}
      <TravelChatbot />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
