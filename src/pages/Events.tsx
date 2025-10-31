import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

interface Event {
  date: Date;
  title: string;
  location: string;
  description: string;
  category: string;
}

const nepalEvents: Event[] = [
  {
    date: new Date(2025, 10, 15), // November 15, 2025
    title: "Tihar Festival",
    location: "Nationwide",
    description: "Festival of Lights celebrating the bond between humans and animals",
    category: "Festival"
  },
  {
    date: new Date(2025, 11, 25), // December 25, 2025
    title: "Tamu Lhosar",
    location: "Kathmandu Valley",
    description: "Gurung New Year celebration with traditional dances and feasts",
    category: "Cultural"
  },
  {
    date: new Date(2025, 9, 1), // October 1, 2025
    title: "Dashain Festival",
    location: "Nationwide",
    description: "Biggest Hindu festival in Nepal celebrating good over evil",
    category: "Festival"
  },
  {
    date: new Date(2025, 8, 15), // September 15, 2025
    title: "Indra Jatra",
    location: "Kathmandu",
    description: "Festival honoring Indra, the king of heaven and god of rain",
    category: "Festival"
  }
];

const Events = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const eventsOnSelectedDate = nepalEvents.filter(
    event => selectedDate && 
    event.date.toDateString() === selectedDate.toDateString()
  );

  const eventDates = nepalEvents.map(event => event.date);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Nepal Events Calendar</h1>
          <p className="text-muted-foreground">
            Discover festivals and cultural events happening across Nepal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select a Date</CardTitle>
                <CardDescription>Click on a date to view events</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasEvent: eventDates
                  }}
                  modifiersStyles={{
                    hasEvent: {
                      fontWeight: 'bold',
                      textDecoration: 'underline'
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                {selectedDate ? `Events on ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 'All Upcoming Events'}
              </h2>
              
              {eventsOnSelectedDate.length > 0 ? (
                eventsOnSelectedDate.map((event, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{event.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{event.description}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No events scheduled for this date. Select a date with underlined numbers to view events.
                  </CardContent>
                </Card>
              )}

              {!selectedDate && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mt-8">All Upcoming Events</h3>
                  {nepalEvents.sort((a, b) => a.date.getTime() - b.date.getTime()).map((event, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            <CardDescription className="flex items-center mt-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {event.location} • {event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">{event.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{event.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
