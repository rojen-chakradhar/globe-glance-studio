import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Minus, Plus, ArrowLeft, MapPin, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useCurrency } from "@/contexts/CurrencyContext";

const STANDARD_HOURLY_RATE = 50;
const PRICE_INCREMENT = 5;
const MIN_HOURS = 1;
const MAX_HOURS = 24;

interface GuideInterest {
  id: string;
  guide_id: string;
  counter_offer_price: number;
  message: string;
  guide_profiles: {
    full_name: string;
    location: string;
    user_id: string;
    hourly_rate: number;
  };
}

export default function Map() {
  const { formatPrice, currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [requirements, setRequirements] = useState("");
  const [hourlyRate, setHourlyRate] = useState(STANDARD_HOURLY_RATE);
  const [durationHours, setDurationHours] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [interestedGuides, setInterestedGuides] = useState<GuideInterest[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routingControl = useRef<any>(null);
  const guideMarkers = useRef<L.Marker[]>([]);
  const npcMarkers = useRef<L.Marker[]>([]);

  // Mock NPC guides data
  const npcGuides = [
    { id: 'npc1', name: 'Ramesh Sharma', specialty: 'Cultural Tours', rating: 4.8 },
    { id: 'npc2', name: 'Sita Gurung', specialty: 'Mountain Trekking', rating: 4.9 },
    { id: 'npc3', name: 'Krishna Thapa', specialty: 'Historical Sites', rating: 4.7 },
    { id: 'npc4', name: 'Maya Rai', specialty: 'Food & Culture', rating: 5.0 },
    { id: 'npc5', name: 'Bikash Lama', specialty: 'Adventure Tours', rating: 4.6 },
  ];

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      initializeMap();
    }

    return () => {
      if (mapInstance.current) {
        npcMarkers.current.forEach(marker => marker.remove());
        guideMarkers.current.forEach(marker => marker.remove());
        if (routingControl.current && mapInstance.current) {
          try {
            mapInstance.current.removeControl(routingControl.current);
          } catch (e) {
            // Control might already be removed
          }
        }
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      mapInstance.current?.invalidateSize();
    };
    window.addEventListener('resize', handler);
    window.addEventListener('orientationchange', handler);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('orientationchange', handler);
    };
  }, []);
  useEffect(() => {
    if (requestId) {
      fetchInterestedGuides();
      
      const channel = supabase
        .channel('guide_interests_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'guide_interests',
            filter: `request_id=eq.${requestId}`
          },
          () => {
            fetchInterestedGuides();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [requestId]);

  useEffect(() => {
    if (interestedGuides.length > 0 && mapInstance.current) {
      updateMapMarkers();
    }
  }, [interestedGuides, selectedGuide]);

  const initializeMap = async () => {
    if (!mapContainer.current) return;

    let userLat = 27.7172;
    let userLng = 85.3240;

    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
      } catch (error) {
        console.log("Using default location");
      }
    }

    const map = L.map(mapContainer.current).setView([userLat, userLng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add user location marker
    const touristIcon = L.divIcon({
      className: "custom-marker",
      html: '<div style="background: #10b981; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 12px rgba(16,185,129,0.5); animation: pulse 2s infinite;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg></div><style>@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }</style>',
      iconSize: [40, 40],
    });

    L.marker([userLat, userLng], { icon: touristIcon })
      .addTo(map)
      .bindPopup("<b>Your Location</b>");

    mapInstance.current = map;
    
    // Ensure Leaflet recalculates size after mount (helps on mobile)
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
    
    // Add NPC guides around tourist immediately on map load
    setTimeout(() => {
      addNpcGuides(userLat, userLng);
    }, 100);
  };

  const addNpcGuides = (userLat: number, userLng: number) => {
    if (!mapInstance.current) return;

    // Clear existing NPC markers
    npcMarkers.current.forEach(marker => marker.remove());
    npcMarkers.current = [];

    const npcIcon = L.divIcon({
      className: "custom-marker",
      html: '<div style="background: hsl(var(--accent)); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); cursor: pointer;">\n        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n          <path d="M12 2l2.39 4.85L20 8l-4 3.9L17 18l-5-2.6L7 18l1-6.1L4 8l5.61-1.15L12 2z"/>\n        </svg>\n      </div>',
      iconSize: [36, 36],
    });

    // Scatter NPC guides around the tourist location
    npcGuides.forEach((guide, index) => {
      const angle = (360 / npcGuides.length) * index;
      const distance = 0.015 + (Math.random() * 0.01); // Random distance between 0.015 and 0.025
      const npcLat = userLat + (distance * Math.sin(angle * Math.PI / 180));
      const npcLng = userLng + (distance * Math.cos(angle * Math.PI / 180));

      const marker = L.marker([npcLat, npcLng], { icon: npcIcon })
        .addTo(mapInstance.current!)
        .bindPopup(`<b>${guide.name}</b><br>${guide.specialty}<br>⭐ ${guide.rating}`);

      npcMarkers.current.push(marker);
    });
  };

  const updateMapMarkers = async () => {
    if (!mapInstance.current) return;

    // Clear existing guide markers
    guideMarkers.current.forEach(marker => marker.remove());
    guideMarkers.current = [];

    // Get current user location
    let userLat = 27.7172;
    let userLng = 85.3240;

    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
      } catch (error) {
        console.log("Using stored location");
      }
    }

    // Hide NPC guides when real guides show interest
    if (interestedGuides.length > 0) {
      npcMarkers.current.forEach(marker => marker.remove());
      npcMarkers.current = [];
    } else {
      // Show NPC guides if no real guides yet
      addNpcGuides(userLat, userLng);
    }

    const guideIcon = L.divIcon({
      className: "custom-marker",
      html: '<div style="background: #3b82f6; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 12px rgba(59,130,246,0.5); cursor: pointer; position: relative;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); background: white; color: #3b82f6; padding: 2px 8px; border-radius: 12px; font-size: 10px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-weight: 600;">Viewing Interest</div></div>',
      iconSize: [40, 40],
    });

    // Add guide markers (simulated locations near user)
    interestedGuides.forEach((guide, index) => {
      const guideLat = userLat + (0.01 * (index + 1));
      const guideLng = userLng + (0.01 * (index + 1));

      const marker = L.marker([guideLat, guideLng], { icon: guideIcon })
        .addTo(mapInstance.current!)
        .bindPopup(`<b>${guide.guide_profiles.full_name}</b><br>${formatPrice(guide.counter_offer_price)}/hour<br><span style="color: #3b82f6; font-weight: 600;">📍 Viewing Interest</span>`);

      marker.on('click', () => {
        setSelectedGuide(guide.guide_id);
        showRoute(userLat, userLng, guideLat, guideLng);
      });

      guideMarkers.current.push(marker);
    });

    // Show route if guide is selected
    if (selectedGuide) {
      const guide = interestedGuides.find(g => g.guide_id === selectedGuide);
      if (guide) {
        const index = interestedGuides.indexOf(guide);
        const guideLat = userLat + (0.01 * (index + 1));
        const guideLng = userLng + (0.01 * (index + 1));
        showRoute(userLat, userLng, guideLat, guideLng);
      }
    }
  };

  const showRoute = (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
    if (!mapInstance.current) return;

    // Remove existing routing control
    if (routingControl.current) {
      mapInstance.current.removeControl(routingControl.current);
    }

    // Add new routing
    routingControl.current = (L as any).Routing.control({
      waypoints: [
        L.latLng(fromLat, fromLng),
        L.latLng(toLat, toLng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: "#3b82f6", opacity: 0.8, weight: 6 }],
      },
      createMarker: () => null,
    }).addTo(mapInstance.current);
  };

  const fetchInterestedGuides = async () => {
    if (!requestId) return;

    try {
      const { data, error } = await supabase
        .from("guide_interests")
        .select(`
          id,
          guide_id,
          counter_offer_price,
          message,
          guide_profiles!guide_interests_guide_id_fkey (
            full_name,
            location,
            user_id,
            hourly_rate
          )
        `)
        .eq("request_id", requestId)
        .eq("status", "pending");

      if (error) throw error;

      setInterestedGuides(data as any || []);
    } catch (error: any) {
      console.error("Error fetching guides:", error);
    }
  };

  const handleHourlyRateChange = (increment: boolean) => {
    setHourlyRate((prev) => {
      const newRate = increment ? prev + PRICE_INCREMENT : prev - PRICE_INCREMENT;
      return Math.max(PRICE_INCREMENT, newRate);
    });
  };

  const handleDurationChange = (increment: boolean) => {
    setDurationHours((prev) => {
      const newDuration = increment ? prev + 1 : prev - 1;
      return Math.max(MIN_HOURS, Math.min(MAX_HOURS, newDuration));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to find a buddy");
        navigate("/auth");
        return;
      }

      let lat = null;
      let lng = null;
      
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        } catch (error) {
          console.log("Location not available");
        }
      }

      const { data, error } = await supabase.from("tour_requests").insert({
        tourist_id: user.id,
        destination,
        requirements,
        offered_price: hourlyRate,
        duration_hours: durationHours,
        tourist_location_lat: lat,
        tourist_location_lng: lng,
      }).select().single();

      if (error) throw error;

      setRequestId(data.id);
      toast.success("Request posted! Guides nearby will start showing interest.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectGuide = async () => {
    if (!selectedGuide || !requestId) return;

    try {
      const { error } = await supabase
        .from("tour_requests")
        .update({ 
          selected_guide_id: selectedGuide,
          status: 'in_progress'
        })
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Guide selected! Check the route on the map.");
      navigate(`/meeting-route/${requestId}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-card md:border-r border-border overflow-y-auto p-4 space-y-4 max-h-screen md:max-h-none">

        <Card className={requestId ? "transition-all" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Find Your Travel Buddy</CardTitle>
              {requestId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRequestId(null);
                      setInterestedGuides([]);
                      setDestination("");
                      setRequirements("");
                      setHourlyRate(STANDARD_HOURLY_RATE);
                      setDurationHours(4);
                    }}
                  >
                    New Search
                  </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!requestId && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Where do you want to go?</Label>
                    <Input
                      id="destination"
                      placeholder="e.g., Pokhara, Chitwan, Kathmandu"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">What are you looking for?</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Describe activities, language preferences, special requirements..."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      required
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Duration (hours)</Label>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleDurationChange(false)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{durationHours}h</div>
                        <div className="text-xs text-muted-foreground">
                          {MIN_HOURS}-{MAX_HOURS} hours
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleDurationChange(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Hourly Rate</Label>
                      {/* Currency Selector */}
                      <div className="flex items-center gap-1 p-0.5 bg-muted rounded">
                        <Button
                          variant={currency === 'NPR' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setCurrency('NPR')}
                          className="h-6 px-2 text-xs"
                        >
                          NPR
                        </Button>
                        <Button
                          variant={currency === 'USD' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setCurrency('USD')}
                          className="h-6 px-2 text-xs"
                        >
                          USD
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleHourlyRateChange(false)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{formatPrice(hourlyRate)}/hr</div>
                        <div className="text-xs text-muted-foreground">
                          Standard: {formatPrice(STANDARD_HOURLY_RATE)}/hr
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleHourlyRateChange(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground text-center pt-1">
                      Total: {formatPrice(hourlyRate * durationHours)} for {durationHours}h
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Searching..." : "Search Guides"}
                  </Button>
                </>
              )}
              
              {requestId && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><span className="font-semibold">Destination:</span> {destination}</p>
                  <p><span className="font-semibold">Duration:</span> {durationHours} hours</p>
                  <p><span className="font-semibold">Hourly Rate:</span> {formatPrice(hourlyRate)}/hr</p>
                  <p><span className="font-semibold">Total Budget:</span> {formatPrice(hourlyRate * durationHours)}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {requestId && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Destination</span>
                  <span>{destination}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="font-semibold">Requirements</span>
                  <span className="text-right text-sm text-muted-foreground">{requirements}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Duration</span>
                  <span className="font-bold">{durationHours} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Hourly Rate</span>
                  <span className="text-primary font-bold">{formatPrice(hourlyRate)}/hr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Budget</span>
                  <span className="text-primary font-bold">{formatPrice(hourlyRate * durationHours)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-semibold">Status</span>
                  <Badge variant="secondary">
                    {interestedGuides.length > 0 ? `${interestedGuides.length} interested` : "Waiting for guides..."}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {interestedGuides.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Interested Guides ({interestedGuides.length})
                </CardTitle>
                {/* Currency Selector */}
                <div className="flex items-center gap-1 p-0.5 bg-muted rounded">
                  <Button
                    variant={currency === 'NPR' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrency('NPR')}
                    className="h-6 px-2 text-xs"
                  >
                    NPR
                  </Button>
                  <Button
                    variant={currency === 'USD' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrency('USD')}
                    className="h-6 px-2 text-xs"
                  >
                    USD
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {interestedGuides.map((guide) => {
                const totalCost = guide.counter_offer_price * durationHours;
                return (
                  <div
                    key={guide.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedGuide === guide.guide_id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedGuide(guide.guide_id)}
                  >
                    <div className="font-semibold">{guide.guide_profiles.full_name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {guide.guide_profiles.location || "Nearby"}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm font-semibold text-primary flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatPrice(guide.counter_offer_price)}/hr
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total: {formatPrice(totalCost)}
                      </div>
                    </div>
                    {guide.message && (
                      <div className="text-xs text-muted-foreground mt-2 italic">
                        "{guide.message}"
                      </div>
                    )}
                  </div>
                );
              })}

              {selectedGuide && (
                <Button onClick={handleSelectGuide} className="w-full">
                  Select This Guide
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative h-[70svh] md:h-screen min-h-[50vh] order-first md:order-last">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
}