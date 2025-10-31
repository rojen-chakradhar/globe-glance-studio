import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Plane } from "lucide-react";
import { Link } from "react-router-dom";

const Trips = () => {
  const upcomingTrips = [
    {
      destination: "Santorini, Greece",
      dates: "Jun 15 - Jun 22, 2025",
      status: "Confirmed",
      travelers: 2
    },
    {
      destination: "Bali, Indonesia",
      dates: "Aug 10 - Aug 20, 2025",
      status: "Pending",
      travelers: 3
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-8">
          ← Back to Home
        </Link>
        
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
            {upcomingTrips.map((trip, index) => (
              <Card key={index} className="mb-4 hover:shadow-elevated transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {trip.destination}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {trip.dates}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {trip.status}
                        </span>
                        <span>{trip.travelers} travelers</span>
                      </div>
                    </div>
                    <Button className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-8">
            <Button size="lg" className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
              Plan New Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trips;