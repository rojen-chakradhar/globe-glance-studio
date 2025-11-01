import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NPCGuide {
  id: string;
  name: string;
  specialty: string;
  rating: number;
}

const DEFAULT_CENTER: [number, number] = [85.3240, 27.7172]; // [lng, lat] Kathmandu

const npcGuides: NPCGuide[] = [
  { id: 'npc1', name: 'Ramesh Sharma', specialty: 'Cultural Tours', rating: 4.8 },
  { id: 'npc2', name: 'Sita Gurung', specialty: 'Mountain Trekking', rating: 4.9 },
  { id: 'npc3', name: 'Krishna Thapa', specialty: 'Historical Sites', rating: 4.7 },
  { id: 'npc4', name: 'Maya Rai', specialty: 'Food & Culture', rating: 5.0 },
  { id: 'npc5', name: 'Bikash Lama', specialty: 'Adventure Tours', rating: 4.6 },
];

const MapboxBuddyMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState<string>(() => {
    return (
      (import.meta as any).env?.VITE_MAPBOX_PUBLIC_TOKEN ||
      localStorage.getItem("MAPBOX_PUBLIC_TOKEN") ||
      ""
    );
  });
  const [input, setInput] = useState(token);

  useEffect(() => {
    if (!containerRef.current || !token) return;

    mapboxgl.accessToken = token;

    // Determine start center using geolocation if possible
    const init = async () => {
      let center: [number, number] = DEFAULT_CENTER;
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) =>
            navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true })
          );
          center = [pos.coords.longitude, pos.coords.latitude];
        } catch {}
      }

      const map = new mapboxgl.Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center,
        zoom: 13,
        pitch: 45,
        bearing: 0,
      });

      mapRef.current = map;

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

      map.on("load", () => {
        // Add a subtle fog for depth on vector tiles
        try {
          (map as any).setFog({
            color: "rgb(255,255,255)",
            "high-color": "rgb(200, 200, 225)",
            "horizon-blend": 0.2,
          });
        } catch {}

        addUserMarker(center);
        addNpcMarkers(center);

        // Force a resize after mount (mobile fix)
        setTimeout(() => map.resize(), 250);
      });

      const onResize = () => map.resize();
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
        map.remove();
        mapRef.current = null;
      };
    };

    const cleanup = init();
    return () => {
      // If init returned a cleanup function
      if (typeof (cleanup as any) === "function") (cleanup as any)();
    };
  }, [token]);

  const saveToken = () => {
    localStorage.setItem("MAPBOX_PUBLIC_TOKEN", input.trim());
    setToken(input.trim());
  };

  const addUserMarker = ([lng, lat]: [number, number]) => {
    if (!mapRef.current) return;
    const el = document.createElement("div");
    el.style.width = "40px";
    el.style.height = "40px";
    el.style.borderRadius = "50%";
    el.style.background = "hsl(var(--primary))";
    el.style.border = "3px solid white";
    el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.innerHTML = `
      <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
        <circle cx='12' cy='10' r='3'/>
        <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/>
      </svg>`;

    new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).setPopup(
      new mapboxgl.Popup({ offset: 12 }).setHTML("<b>Your Location</b>")
    ).addTo(mapRef.current);
  };

  const addNpcMarkers = ([lng, lat]: [number, number]) => {
    if (!mapRef.current) return;

    npcGuides.forEach((guide, index) => {
      const angle = (360 / npcGuides.length) * index;
      const distance = 0.015 + Math.random() * 0.01; // degrees-ish
      const npcLng = lng + distance * Math.cos((angle * Math.PI) / 180);
      const npcLat = lat + distance * Math.sin((angle * Math.PI) / 180);

      const el = document.createElement("div");
      el.style.width = "36px";
      el.style.height = "36px";
      el.style.borderRadius = "50%";
      el.style.background = "hsl(var(--accent))";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.cursor = "pointer";
      el.innerHTML = `
        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
          <path d='M12 2l2.39 4.85L20 8l-4 3.9L17 18l-5-2.6L7 18l1-6.1L4 8l5.61-1.15L12 2z'/>
        </svg>`;

      new mapboxgl.Marker({ element: el })
        .setLngLat([npcLng, npcLat])
        .setPopup(
          new mapboxgl.Popup({ offset: 12 }).setHTML(
            `<b>${guide.name}</b><br/>${guide.specialty}<br/>⭐ ${guide.rating}`
          )
        )
        .addTo(mapRef.current!);
    });
  };

  return (
    <div className="absolute inset-0">
      {!token && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Map Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Please enter your Mapbox public token (starts with "pk.") to load the map.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="pk.XXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button onClick={saveToken}>Save</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: We can also store this as a project secret later so you don’t need to paste it here again.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div ref={containerRef} className="w-full h-full rounded-lg shadow" />
    </div>
  );
};

export default MapboxBuddyMap;
