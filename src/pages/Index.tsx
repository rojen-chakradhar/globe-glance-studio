import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, Plane, Shield, Award, HeadphonesIcon } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-travel.jpg";
import santoriniImage from "@/assets/destination-santorini.jpg";
import baliImage from "@/assets/destination-bali.jpg";
import alpsImage from "@/assets/destination-alps.jpg";
import parisImage from "@/assets/destination-paris.jpg";

const Index = () => {
  const destinations = [
    {
      name: "Santorini, Greece",
      image: santoriniImage,
      price: "$1,299",
      duration: "7 Days"
    },
    {
      name: "Bali, Indonesia",
      image: baliImage,
      price: "$899",
      duration: "10 Days"
    },
    {
      name: "Swiss Alps",
      image: alpsImage,
      price: "$1,599",
      duration: "5 Days"
    },
    {
      name: "Paris, France",
      image: parisImage,
      price: "$1,199",
      duration: "6 Days"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Best Price Guarantee",
      description: "We guarantee the best prices on all our travel packages"
    },
    {
      icon: Award,
      title: "Award Winning Service",
      description: "Recognized as the top travel agency for 3 consecutive years"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Our travel experts are available around the clock"
    }
  ];

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
            <div className="hidden md:flex items-center gap-8">
              <Link to="/map">
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                  Map
                </Button>
              </Link>
              <Link to="/travelbuddy">
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                  TravelBuddy
                </Button>
              </Link>
              <Link to="/trips">
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                  Trips
                </Button>
              </Link>
              <Button className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 drop-shadow-lg">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground mb-12 drop-shadow-md">
            Explore the world's most breathtaking destinations with us
          </p>
          
          {/* Search Box */}
          <Card className="max-w-4xl mx-auto shadow-elevated">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Where to?" 
                    className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="When?" 
                    className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Travelers" 
                    className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  />
                </div>
                <Button className="bg-gradient-ocean text-primary-foreground hover:opacity-90 h-full">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Destinations */}
      <section id="destinations" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-muted-foreground text-lg">
              Handpicked destinations for unforgettable experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <Card 
                key={index} 
                className="group overflow-hidden cursor-pointer hover:shadow-elevated transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-primary-foreground mb-2">
                      {destination.name}
                    </h3>
                    <div className="flex items-center justify-between text-primary-foreground">
                      <span className="text-sm">From {destination.price}</span>
                      <span className="text-sm">{destination.duration}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section id="packages" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Packages</h2>
            <p className="text-muted-foreground text-lg">
              All-inclusive packages designed for your comfort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Beach Paradise",
                description: "Relax on pristine beaches with luxury accommodations",
                price: "$999",
                features: ["5-Star Hotels", "All Meals Included", "Water Sports", "Airport Transfers"]
              },
              {
                title: "Cultural Explorer",
                description: "Immerse yourself in rich history and local traditions",
                price: "$1,299",
                features: ["Guided Tours", "Museum Passes", "Local Cuisine", "Cultural Shows"]
              },
              {
                title: "Adventure Seeker",
                description: "Thrilling activities for the adventurous spirit",
                price: "$1,499",
                features: ["Hiking Expeditions", "Adventure Sports", "Camping", "Expert Guides"]
              }
            ].map((pkg, index) => (
              <Card key={index} className="hover:shadow-elevated transition-shadow">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                    <p className="text-muted-foreground mb-4">{pkg.description}</p>
                    <div className="text-4xl font-bold text-primary mb-4">
                      {pkg.price}
                      <span className="text-sm text-muted-foreground font-normal">/person</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90">
                    Book Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Wanderlust</h2>
            <p className="text-muted-foreground text-lg">
              Your trusted partner for unforgettable journeys
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-elevated transition-shadow">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-ocean mb-4">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-ocean">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Book your dream vacation today and create memories that last a lifetime
          </p>
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6"
          >
            Explore All Destinations
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Wanderlust</span>
              </div>
              <p className="text-muted-foreground">
                Your gateway to extraordinary adventures around the world.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Destinations</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Packages</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cancellation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Email: info@wanderlust.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Travel Street, Adventure City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Wanderlust Travel Agency. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
