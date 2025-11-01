import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Minus, Plus, ArrowLeft, MapPin, Users, DollarSign, Star, Languages } from "lucide-react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const STANDARD_PRICE = 500;
const PRICE_INCREMENT = 10;

interface GuideInterest {
  id: string;
  guide_id: string;
  counter_offer_price: number;
  message: string;
  guide_profiles: {
    full_name: string;
    location: string;
    user_id: string;
    bio: string;
    rating: number;
    total_reviews: number;
    languages: string[];
    specializations: string[];
    profile_image_url: string;
    experience_years: number;
  };
}

export default function FindBuddy() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [requirements, setRequirements] = useState("");
  const [price, setPrice] = useState(STANDARD_PRICE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [interestedGuides, setInterestedGuides] = useState<GuideInterest[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routingControl = useRef<any>(null);
  const guideMarkers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      initializeMap();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
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

    const touristIcon = L.divIcon({
      className: "custom-marker",
      html: '<div style="background: #10b981; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 12px rgba(16,185,129,0.5); animation: pulse 2s infinite;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg></div><style>@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }</style>',
      iconSize: [40, 40],
    });

    L.marker([userLat, userLng], { icon: touristIcon })
      .addTo(map)
      .bindPopup("<b>Your Location</b>");

    mapInstance.current = map;
  };

  const updateMapMarkers = async () => {
    if (!mapInstance.current) return;

    guideMarkers.current.forEach(marker => marker.remove());
    guideMarkers.current = [];

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

    const guideIcon = L.divIcon({
      className: "custom-marker",
      html: '<div style="background: #3b82f6; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 12px rgba(59,130,246,0.5); cursor: pointer;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>',
      iconSize: [40, 40],
    });

    interestedGuides.forEach((guide, index) => {
      const guideLat = userLat + (0.01 * (index + 1));
      const guideLng = userLng + (0.01 * (index + 1));

      const marker = L.marker([guideLat, guideLng], { icon: guideIcon })
        .addTo(mapInstance.current!)
        .bindPopup(`<b>${guide.guide_profiles.full_name}</b><br>₹${guide.counter_offer_price}/day`);

      marker.on('click', () => {
        setSelectedGuide(guide.guide_id);
        showRoute(userLat, userLng, guideLat, guideLng);
      });

      guideMarkers.current.push(marker);
    });

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

    if (routingControl.current) {
      mapInstance.current.removeControl(routingControl.current);
    }

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
            bio,
            rating,
            total_reviews,
            languages,
            specializations,
            profile_image_url,
            experience_years
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

  const handlePriceChange = (increment: boolean) => {
    setPrice((prev) => {
      const newPrice = increment ? prev + PRICE_INCREMENT : prev - PRICE_INCREMENT;
      return Math.max(0, newPrice);
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
        offered_price: price,
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
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-[500px] bg-card border-r border-border overflow-y-auto">
        <div className="p-4 space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Find Your Travel Buddy</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Where do you want to go?</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Pokhara, Chitwan, Kathmandu"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    disabled={!!requestId}
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
                    disabled={!!requestId}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Your Budget (₹ per day)</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handlePriceChange(false)}
                      disabled={!!requestId}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="text-2xl font-bold">₹{price}</div>
                      <div className="text-xs text-muted-foreground">
                        Standard: ₹{STANDARD_PRICE}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handlePriceChange(true)}
                      disabled={!!requestId}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {!requestId && (
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Searching..." : "Search Guides"}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {interestedGuides.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Interested Guides ({interestedGuides.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interestedGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedGuide === guide.guide_id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/50 hover:shadow"
                    }`}
                    onClick={() => {
                      setSelectedGuide(guide.guide_id);
                      setExpandedGuide(expandedGuide === guide.guide_id ? null : guide.guide_id);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={guide.guide_profiles.profile_image_url} />
                        <AvatarFallback>{guide.guide_profiles.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-semibold truncate">{guide.guide_profiles.full_name}</h3>
                          <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                            <DollarSign className="h-4 w-4" />
                            ₹{guide.counter_offer_price}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{guide.guide_profiles.rating || 0}</span>
                            <span>({guide.guide_profiles.total_reviews || 0})</span>
                          </div>
                          {guide.guide_profiles.experience_years && (
                            <span>• {guide.guide_profiles.experience_years}y exp</span>
                          )}
                        </div>

                        {expandedGuide === guide.guide_id && (
                          <div className="space-y-2 mt-3 pt-3 border-t">
                            {guide.guide_profiles.bio && (
                              <p className="text-sm text-muted-foreground">{guide.guide_profiles.bio}</p>
                            )}
                            
                            {guide.guide_profiles.languages?.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <Languages className="h-4 w-4 text-muted-foreground" />
                                {guide.guide_profiles.languages.map((lang) => (
                                  <Badge key={lang} variant="secondary" className="text-xs">
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {guide.guide_profiles.specializations?.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-muted-foreground">Specializations:</span>
                                {guide.guide_profiles.specializations.map((spec) => (
                                  <Badge key={spec} variant="outline" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {guide.guide_profiles.location && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {guide.guide_profiles.location}
                              </div>
                            )}

                            {guide.message && (
                              <div className="mt-2 p-2 bg-muted/50 rounded text-sm italic">
                                "{guide.message}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {selectedGuide && (
                  <Button onClick={handleSelectGuide} className="w-full mt-4">
                    Select This Guide & View Route
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative h-96 lg:h-screen">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
}
