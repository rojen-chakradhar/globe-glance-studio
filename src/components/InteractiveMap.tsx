import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenSubmitted, setTokenSubmitted] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !tokenSubmitted || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566], // Paris coordinates
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add directions control
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      alternatives: true,
      controls: {
        inputs: true,
        instructions: true,
        profileSwitcher: true,
      },
    });

    map.current.addControl(directions, 'top-left');

    // Add popular destinations markers
    const destinations = [
      { name: 'Eiffel Tower', coords: [2.2945, 48.8584] },
      { name: 'Louvre Museum', coords: [2.3376, 48.8606] },
      { name: 'Arc de Triomphe', coords: [2.2950, 48.8738] },
      { name: 'Notre-Dame', coords: [2.3499, 48.8530] },
    ];

    destinations.forEach((dest) => {
      const marker = new mapboxgl.Marker({ color: '#6366f1' })
        .setLngLat(dest.coords as [number, number])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3 class="font-semibold">${dest.name}</h3>`)
        )
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [tokenSubmitted, mapboxToken]);

  if (!tokenSubmitted) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-4">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Enter Mapbox Token</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To use the interactive map with routing, please enter your Mapbox public token.
              Get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
            </p>
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="pk.eyJ1..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="w-full"
            />
            <Button 
              onClick={() => setTokenSubmitted(true)}
              disabled={!mapboxToken}
              className="w-full bg-gradient-ocean text-primary-foreground"
            >
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-elevated">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default InteractiveMap;
