import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, ChevronDown, Calendar as CalendarIcon } from "lucide-react";

interface Event {
  date: Date;
  title: string;
  location: string;
  description: string;
  category: string;
  longDescription: string;
  images: string[];
  videos?: string[];
}

const nepalEvents: Event[] = [
  {
    date: new Date(2025, 10, 15), // November 15, 2025
    title: "Tihar Festival",
    location: "Nationwide",
    description: "Festival of Lights celebrating the bond between humans and animals",
    category: "Festival",
    longDescription: "Tihar is a five-day Hindu festival celebrated in Nepal. Also known as Deepawali and Yamapanchak, it's the second biggest festival after Dashain. The festival honors different animals and deities each day, including crows, dogs, cows, and oxen. Homes are decorated with oil lamps, candles, and colorful rangoli patterns.",
    images: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop"
    ]
  },
  {
    date: new Date(2025, 11, 25), // December 25, 2025
    title: "Tamu Lhosar",
    location: "Kathmandu Valley",
    description: "Gurung New Year celebration with traditional dances and feasts",
    category: "Cultural",
    longDescription: "Tamu Lhosar marks the Gurung New Year, celebrated with great enthusiasm by the Gurung community. The festival features traditional Ghatu dances, cultural performances, and elaborate feasts. People dress in traditional attire and gather to celebrate their heritage and welcome the new year.",
    images: [
      "https://images.unsplash.com/photo-1533094602577-198d3beab8ea?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop"
    ]
  },
  {
    date: new Date(2025, 9, 1), // October 1, 2025
    title: "Dashain Festival",
    location: "Nationwide",
    description: "Biggest Hindu festival in Nepal celebrating good over evil",
    category: "Festival",
    longDescription: "Dashain is the longest and most auspicious festival in Nepal, lasting 15 days. It celebrates the victory of goddess Durga over the evil demon Mahishasura. Families gather to receive blessings from elders (tika and jamara), fly kites, and enjoy swings. It's a time of family reunions, feasting, and celebration.",
    images: [
      "https://images.unsplash.com/photo-1609552918725-680e1fb1f00e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop"
    ]
  },
  {
    date: new Date(2025, 8, 15), // September 15, 2025
    title: "Indra Jatra",
    location: "Kathmandu",
    description: "Festival honoring Indra, the king of heaven and god of rain",
    category: "Festival",
    longDescription: "Indra Jatra is one of the most exciting and revered festivals of Kathmandu Valley. The week-long festival features masked dancers, chariot processions of the living goddess Kumari, and dramatic performances. The festival combines both Hindu and Buddhist traditions and commemorates the victory of good over evil.",
    images: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532521750440-9c85e0143afa?w=800&auto=format&fit=crop"
    ]
  }
];

const Events = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  
  const eventsInSelectedMonth = nepalEvents.filter(
    event => selectedDate && 
    event.date.getMonth() === selectedDate.getMonth() &&
    event.date.getFullYear() === selectedDate.getFullYear()
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
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <CalendarIcon className="h-6 w-6" />
                {selectedDate ? `Events in ${selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : 'All Upcoming Events'}
              </h2>
              
              {eventsInSelectedMonth.length > 0 ? (
                eventsInSelectedMonth.sort((a, b) => a.date.getTime() - b.date.getTime()).map((event, index) => (
                  <Collapsible 
                    key={index}
                    open={expandedEvent === index}
                    onOpenChange={(open) => setExpandedEvent(open ? index : null)}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CollapsibleTrigger className="w-full">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="text-left">
                              <CardTitle className="text-xl flex items-center gap-2">
                                {event.title}
                                <ChevronDown className={`h-5 w-5 transition-transform ${expandedEvent === index ? 'rotate-180' : ''}`} />
                              </CardTitle>
                              <CardDescription className="flex items-center mt-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {event.location} • {event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary">{event.category}</Badge>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CardContent>
                        <p className="text-muted-foreground">{event.description}</p>
                        
                        <CollapsibleContent className="mt-4 space-y-4">
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">About This Event</h4>
                            <p className="text-muted-foreground">{event.longDescription}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-3">Event Gallery</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {event.images.map((image, imgIndex) => (
                                <img 
                                  key={imgIndex}
                                  src={image} 
                                  alt={`${event.title} - Image ${imgIndex + 1}`}
                                  className="rounded-lg w-full h-48 object-cover"
                                />
                              ))}
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full" 
                            size="lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to travel buddy booking
                              window.location.href = '/travel-buddy';
                            }}
                          >
                            Book a Travel Buddy for This Event
                          </Button>
                        </CollapsibleContent>
                      </CardContent>
                    </Card>
                  </Collapsible>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No events scheduled for this month. Select a different month to view events.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
