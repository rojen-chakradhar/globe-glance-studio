import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, Clock, MapPin, Plane, User, Car, ChevronDown, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import traveloneLogo from "@/assets/travelone-logo.png";

interface TripBuddy {
  name: string;
  avatar: string;
  bio: string;
  rating: number;
  tripsCompleted: number;
}

interface Trip {
  id: string;
  title: string;
  destination: string;
  duration: string;
  dates: string;
  createdBy: TripBuddy;
  vehicleAvailable: boolean;
  groupSize: number;
  price: number;
  description: string;
  highlights: string[];
}

const Trips = () => {
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);

  const availableTrips: Trip[] = [
    {
      id: "1",
      title: "Everest Base Camp Trek",
      destination: "Everest Region, Nepal",
      duration: "12 Days",
      dates: "Dec 15 - Dec 27, 2025",
      createdBy: {
        name: "Ramesh Sharma",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        bio: "Experienced mountain guide with 10+ years in the Himalayas",
        rating: 4.9,
        tripsCompleted: 87
      },
      vehicleAvailable: true,
      groupSize: 8,
      price: 1200,
      description: "Join us for an unforgettable journey to the base of the world's highest peak. Experience breathtaking mountain views, Sherpa culture, and the thrill of high-altitude trekking.",
      highlights: ["Namche Bazaar", "Tengboche Monastery", "Kala Patthar viewpoint", "Sherpa villages"]
    },
    {
      id: "2",
      title: "Annapurna Circuit Adventure",
      destination: "Annapurna Region, Nepal",
      duration: "15 Days",
      dates: "Jan 10 - Jan 25, 2026",
      createdBy: {
        name: "Sita Gurung",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        bio: "Local guide passionate about sharing Nepal's natural beauty",
        rating: 4.8,
        tripsCompleted: 65
      },
      vehicleAvailable: true,
      groupSize: 10,
      price: 1400,
      description: "Trek through diverse landscapes from subtropical forests to high mountain passes. Cross Thorong La pass and experience the incredible diversity of the Annapurna region.",
      highlights: ["Thorong La Pass (5,416m)", "Muktinath Temple", "Hot springs at Tatopani", "Poon Hill sunrise"]
    },
    {
      id: "3",
      title: "Pokhara Valley Explorer",
      destination: "Pokhara, Nepal",
      duration: "5 Days",
      dates: "Feb 5 - Feb 10, 2026",
      createdBy: {
        name: "Bikash Thapa",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        bio: "Adventure enthusiast and certified paragliding instructor",
        rating: 4.7,
        tripsCompleted: 42
      },
      vehicleAvailable: true,
      groupSize: 6,
      price: 450,
      description: "Explore the adventure capital of Nepal. Enjoy paragliding, boating on Phewa Lake, and stunning views of the Annapurna range.",
      highlights: ["Paragliding", "World Peace Pagoda", "Davis Falls", "Phewa Lake boating"]
    },
    {
      id: "4",
      title: "Chitwan Jungle Safari",
      destination: "Chitwan National Park, Nepal",
      duration: "4 Days",
      dates: "Mar 12 - Mar 16, 2026",
      createdBy: {
        name: "Arjun Rai",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
        bio: "Wildlife expert and nature conservation advocate",
        rating: 4.9,
        tripsCompleted: 93
      },
      vehicleAvailable: false,
      groupSize: 12,
      price: 380,
      description: "Experience Nepal's wildlife in one of Asia's best-preserved national parks. Spot rhinos, elephants, and if lucky, the elusive Bengal tiger.",
      highlights: ["Elephant safari", "Jungle walk", "Canoe ride", "Tharu cultural show"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <div className="bg-gradient-ocean shadow-md">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
            <img src={traveloneLogo} alt="Travelone Logo" className="h-10 w-10" />
            Travelone
          </Link>
          <div className="flex gap-6 text-primary-foreground">
            <Link to="/map" className="hover:opacity-80 transition-opacity">Map</Link>
            <Link to="/trips" className="hover:opacity-80 transition-opacity font-semibold">Trips</Link>
            <Link to="/events" className="hover:opacity-80 transition-opacity">Events</Link>
          </div>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-ocean mb-6">
            <Plane className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Available Trips</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse trips created by experienced travel buddies and join adventures across Nepal
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {availableTrips.map((trip) => (
            <Collapsible
              key={trip.id}
              open={expandedTrip === trip.id}
              onOpenChange={(isOpen) => setExpandedTrip(isOpen ? trip.id : null)}
            >
              <Card className="hover:shadow-elevated transition-shadow">
                <CardContent className="p-6">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 text-left">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">{trip.title}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground mb-3">
                              <MapPin className="h-4 w-4" />
                              <span>{trip.destination}</span>
                            </div>
                          </div>
                          <ChevronDown className={`h-6 w-6 transition-transform ${expandedTrip === trip.id ? 'rotate-180' : ''}`} />
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {trip.dates}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {trip.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Max {trip.groupSize} people
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant={trip.vehicleAvailable ? "default" : "secondary"}>
                            <Car className="h-3 w-3 mr-1" />
                            {trip.vehicleAvailable ? "Vehicle Included" : "No Vehicle"}
                          </Badge>
                          <Badge variant="outline" className="font-semibold">
                            ${trip.price} per person
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="mt-6 pt-6 border-t space-y-6">
                      {/* Guide Profile */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Your Guide
                        </h4>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={trip.createdBy.avatar} alt={trip.createdBy.name} />
                            <AvatarFallback>{trip.createdBy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h5 className="font-semibold text-lg">{trip.createdBy.name}</h5>
                            <p className="text-sm text-muted-foreground mb-2">{trip.createdBy.bio}</p>
                            <div className="flex gap-4 text-sm">
                              <span className="font-medium">⭐ {trip.createdBy.rating}/5.0</span>
                              <span className="text-muted-foreground">{trip.createdBy.tripsCompleted} trips completed</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Trip Description */}
                      <div>
                        <h4 className="font-semibold mb-2">About This Trip</h4>
                        <p className="text-muted-foreground">{trip.description}</p>
                      </div>

                      {/* Highlights */}
                      <div>
                        <h4 className="font-semibold mb-2">Trip Highlights</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {trip.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                              <span className="text-primary">✓</span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button className="flex-1 bg-gradient-ocean text-primary-foreground hover:opacity-90">
                          Join This Trip
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Contact Guide
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trips;