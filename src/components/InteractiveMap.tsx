import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, MapPin, Star, Phone } from 'lucide-react';

interface Guide {
  id: number;
  name: string;
  location: [number, number];
  rating: number;
  languages: string[];
  available: boolean;
  specialty: string;
}

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Mock guide data - in production, this would come from a database
  const guides: Guide[] = [
    { id: 1, name: 'Ramesh Sharma', location: [85.324, 27.7172], rating: 4.8, languages: ['English', 'Hindi', 'Nepali'], available: true, specialty: 'Cultural Tours' },
    { id: 2, name: 'Sita Gurung', location: [85.340, 27.7100], rating: 4.9, languages: ['English', 'Nepali', 'Japanese'], available: true, specialty: 'Mountain Trekking' },
    { id: 3, name: 'Krishna Thapa', location: [85.310, 27.7200], rating: 4.7, languages: ['English', 'Nepali', 'French'], available: false, specialty: 'Historical Sites' },
    { id: 4, name: 'Maya Rai', location: [85.360, 27.7150], rating: 5.0, languages: ['English', 'Nepali', 'German'], available: true, specialty: 'Food & Culture' },
    { id: 5, name: 'Bikash Lama', location: [85.295, 27.7180], rating: 4.6, languages: ['English', 'Nepali', 'Chinese'], available: true, specialty: 'Adventure Tours' },
  ];

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [85.324, 27.7172], // Kathmandu, Nepal
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    // Add guide markers
    guides.forEach((guide) => {
      const el = document.createElement('div');
      el.className = 'guide-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = guide.available ? '#10b981' : '#6b7280';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(guide.location)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedGuide(guide);
        map.current?.flyTo({
          center: guide.location,
          zoom: 15,
          duration: 1000,
        });
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  const handleRequestGuide = (guide: Guide) => {
    alert(`Request sent to ${guide.name}! They will contact you shortly.`);
    setSelectedGuide(null);
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      {!mapboxToken ? (
        <Card className="absolute inset-0 flex items-center justify-center p-6 z-10 bg-background/95">
          <div className="max-w-md text-center space-y-4">
            <h3 className="text-lg font-semibold">Enter Mapbox Token</h3>
            <p className="text-sm text-muted-foreground">
              To use the live guide tracking map, please enter your Mapbox public token.
              Get one at{' '}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <input
              type="text"
              placeholder="pk.eyJ1..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </Card>
      ) : null}

      {selectedGuide && (
        <Card className="absolute top-4 left-4 z-10 p-4 max-w-sm bg-background/95 backdrop-blur">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedGuide.available ? 'bg-green-500' : 'bg-gray-500'}`}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedGuide.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{selectedGuide.rating}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGuide(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Kathmandu, Nepal</span>
              </div>
              <div>
                <p className="font-medium">{selectedGuide.specialty}</p>
                <p className="text-muted-foreground">Languages: {selectedGuide.languages.join(', ')}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${selectedGuide.available ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className={selectedGuide.available ? 'text-green-600' : 'text-muted-foreground'}>
                  {selectedGuide.available ? 'Available Now' : 'Currently Busy'}
                </span>
              </div>
            </div>

            {selectedGuide.available && (
              <Button 
                className="w-full bg-gradient-ocean text-primary-foreground"
                onClick={() => handleRequestGuide(selectedGuide)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Request This Guide
              </Button>
            )}
          </div>
        </Card>
      )}

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default InteractiveMap;
