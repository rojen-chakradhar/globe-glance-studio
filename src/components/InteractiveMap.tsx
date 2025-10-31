import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  const map = useRef<L.Map | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Mock guide data
  const guides: Guide[] = [
    { id: 1, name: 'Ramesh Sharma', location: [27.7172, 85.324], rating: 4.8, languages: ['English', 'Hindi', 'Nepali'], available: true, specialty: 'Cultural Tours' },
    { id: 2, name: 'Sita Gurung', location: [27.7100, 85.340], rating: 4.9, languages: ['English', 'Nepali', 'Japanese'], available: true, specialty: 'Mountain Trekking' },
    { id: 3, name: 'Krishna Thapa', location: [27.7200, 85.310], rating: 4.7, languages: ['English', 'Nepali', 'French'], available: false, specialty: 'Historical Sites' },
    { id: 4, name: 'Maya Rai', location: [27.7150, 85.360], rating: 5.0, languages: ['English', 'Nepali', 'German'], available: true, specialty: 'Food & Culture' },
    { id: 5, name: 'Bikash Lama', location: [27.7180, 85.295], rating: 4.6, languages: ['English', 'Nepali', 'Chinese'], available: true, specialty: 'Adventure Tours' },
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([27.7172, 85.324], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Create custom icon HTML
    const createGuideIcon = (available: boolean) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: ${available ? '#10b981' : '#6b7280'};
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    };

    // Add guide markers
    guides.forEach((guide) => {
      const marker = L.marker(guide.location, {
        icon: createGuideIcon(guide.available),
      }).addTo(map.current!);

      marker.on('click', () => {
        setSelectedGuide(guide);
        map.current?.flyTo(guide.location, 15, {
          duration: 1,
        });
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  const handleRequestGuide = (guide: Guide) => {
    alert(`Request sent to ${guide.name}! They will contact you shortly.`);
    setSelectedGuide(null);
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden z-0">
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
