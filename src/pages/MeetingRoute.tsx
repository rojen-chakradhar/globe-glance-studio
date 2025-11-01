import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

interface RequestData {
  destination: string;
  tourist_location_lat: number | null;
  tourist_location_lng: number | null;
  guide_profiles: {
    full_name: string;
    location: string;
  };
}

export default function MeetingRoute() {
  const { requestId } = useParams();
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    fetchRequestData();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [requestId]);

  useEffect(() => {
    if (requestData && mapContainer.current && !mapInstance.current) {
      initializeMap();
    }
  }, [requestData]);

  const fetchRequestData = async () => {
    try {
      const { data, error } = await supabase
        .from("tour_requests")
        .select(`
          destination,
          tourist_location_lat,
          tourist_location_lng,
          guide_profiles!tour_requests_selected_guide_id_fkey(
            full_name,
            location
          )
        `)
        .eq("id", requestId)
        .single();

      if (error) throw error;

      setRequestData(data as any);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = async () => {
    if (!requestData || !mapContainer.current) return;

    // Get current location
    let userLat = requestData.tourist_location_lat || 27.7172;
    let userLng = requestData.tourist_location_lng || 85.3240;

    if (!requestData.tourist_location_lat && navigator.geolocation) {
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

    // For demo, use a nearby location as guide location
    // In production, this should come from guide_profiles table
    const guideLat = userLat + 0.02;
    const guideLng = userLng + 0.02;

    const map = L.map(mapContainer.current).setView([userLat, userLng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Custom icons
    const touristIcon = L.divIcon({
      className: "custom-marker",
      html: '<div style="background: #10b981; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">T</div>',
      iconSize: [30, 30],
    });

    const guideIcon = L.divIcon({
      className: "custom-marker",
      html: '<div style="background: #3b82f6; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">G</div>',
      iconSize: [30, 30],
    });

    // Add markers
    L.marker([userLat, userLng], { icon: touristIcon })
      .addTo(map)
      .bindPopup("<b>Your Location</b>");

    L.marker([guideLat, guideLng], { icon: guideIcon })
      .addTo(map)
      .bindPopup(`<b>${requestData.guide_profiles.full_name}</b><br>Guide Location`);

    // Add routing
    (L as any).Routing.control({
      waypoints: [
        L.latLng(userLat, userLng),
        L.latLng(guideLat, guideLng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: "#3b82f6", opacity: 0.8, weight: 6 }],
      },
      createMarker: () => null, // Don't create default markers
    }).addTo(map);

    mapInstance.current = map;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading route...</div>
      </div>
    );
  }

  if (!requestData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Request not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 left-4 z-[1000]">
        <Link
          to="/my-requests"
          className="inline-flex items-center gap-2 bg-background/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg text-foreground hover:bg-background"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Requests
        </Link>
      </div>

      <div className="absolute top-4 right-4 z-[1000]">
        <Card className="w-80">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Meeting Route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">Destination</div>
                <div className="text-muted-foreground">{requestData.destination}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0" />
              <div>
                <div className="font-medium">Guide</div>
                <div className="text-muted-foreground">{requestData.guide_profiles.full_name}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0" />
              <div>
                <div className="font-medium">You</div>
                <div className="text-muted-foreground">Your current location</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div ref={mapContainer} className="w-full h-screen" />
    </div>
  );
}
