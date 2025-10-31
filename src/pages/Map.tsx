import { useState } from "react";
import { MapPin, Clock, Home, Car, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import InteractiveMap from "@/components/InteractiveMap";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const Map = () => {
  const [filters, setFilters] = useState({
    time: "",
    stay: "",
    vehicle: { needed: false, type: "" },
    interests: [] as string[],
  });

  const timeOptions = ["1 hour", "Few hours (2-4)", "Half day", "Full day", "2-3 days", "Week+"];
  const stayOptions = ["No stay needed", "Homestay", "Hotel", "Hostel", "Resort"];
  const vehicleTypes = ["Bike/Scooter", "Car", "SUV", "Bus", "Jeep"];
  const interestOptions = ["Nature", "Culture", "Tradition", "Local areas", "Adventure", "Food", "Religious sites"];

  const handleInterestToggle = (interest: string) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

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
            Discover amazing travel destinations around the world with our interactive map
          </p>
        </div>

        <div className="max-w-7xl mx-auto flex gap-6">
          {/* Filter Sidebar */}
          <Card className="w-80 h-fit p-6 space-y-6 sticky top-24">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Filters
            </h2>

            {/* Time Filter */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration
                </Label>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2">
                <RadioGroup value={filters.time} onValueChange={(value) => setFilters(prev => ({ ...prev, time: value }))}>
                  {timeOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`time-${option}`} />
                      <Label htmlFor={`time-${option}`} className="font-normal cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CollapsibleContent>
            </Collapsible>

            {/* Stay Filter */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Accommodation
                </Label>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2">
                <RadioGroup value={filters.stay} onValueChange={(value) => setFilters(prev => ({ ...prev, stay: value }))}>
                  {stayOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`stay-${option}`} />
                      <Label htmlFor={`stay-${option}`} className="font-normal cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CollapsibleContent>
            </Collapsible>

            {/* Vehicle Filter */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle
                </Label>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vehicle-needed" 
                    checked={filters.vehicle.needed}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, vehicle: { ...prev.vehicle, needed: checked as boolean } }))
                    }
                  />
                  <Label htmlFor="vehicle-needed" className="font-normal cursor-pointer">Vehicle needed</Label>
                </div>
                
                {filters.vehicle.needed && (
                  <RadioGroup 
                    value={filters.vehicle.type} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, vehicle: { ...prev.vehicle, type: value } }))}
                    className="ml-6"
                  >
                    {vehicleTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={`vehicle-${type}`} />
                        <Label htmlFor={`vehicle-${type}`} className="font-normal cursor-pointer">{type}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Interests Filter */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <Label className="text-base font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Interests
                </Label>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2">
                {interestOptions.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`interest-${interest}`}
                      checked={filters.interests.includes(interest)}
                      onCheckedChange={() => handleInterestToggle(interest)}
                    />
                    <Label htmlFor={`interest-${interest}`} className="font-normal cursor-pointer">{interest}</Label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Map Container */}
          <div className="flex-1">
            <InteractiveMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;