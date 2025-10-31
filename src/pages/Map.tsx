import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const Map = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-8">
          ← Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-ocean mb-6">
            <MapPin className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Destinations</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover amazing travel destinations around the world on our interactive map
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-card rounded-lg shadow-elevated p-8">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Navigation className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Interactive map coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;