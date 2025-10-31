import { Button } from "@/components/ui/button";
import { MapPin, Users, Plane, Navigation } from "lucide-react";
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

      {/* Navigation Buttons */}
      <div className="fixed top-[73px] left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-4">
            <Link to="/map">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                <MapPin className="h-4 w-4 mr-2" />
                Map
              </Button>
            </Link>
            <Link to="/travelbuddy">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                <Users className="h-4 w-4 mr-2" />
                TravelBuddy
              </Button>
            </Link>
            <Link to="/trips">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                <Plane className="h-4 w-4 mr-2" />
                Trips
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="pt-[130px] pb-12 px-4 min-h-screen">
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
    </div>
  );
};

export default Index;
