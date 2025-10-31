import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Shield, AlertTriangle, Phone, MapPin, Bell, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Safety = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-[73px] py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-ocean mb-4">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Safety Center</h1>
            <p className="text-muted-foreground">Your safety is our top priority</p>
          </div>

          {/* Emergency Contact */}
          <Card className="bg-destructive text-destructive-foreground">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Emergency Contact</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-white text-destructive hover:bg-white/90">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Nepal Police
                </Button>
                <Button variant="secondary" className="flex-1">
                  <MapPin className="mr-2 h-5 w-5" />
                  Share My Location
                </Button>
              </div>
              <p className="text-sm mt-4 opacity-90">Nepal Police Emergency: 100</p>
            </CardContent>
          </Card>

          {/* Safety Features */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold">Safety Features</h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Verified Travel Buddies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  All our travel buddies go through a thorough verification process including background checks, ID verification, and reference checks.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Identity verification required</li>
                  <li>✓ Background checks completed</li>
                  <li>✓ Reviewed by our safety team</li>
                  <li>✓ Rated by previous travelers</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Share your real-time location with trusted contacts during your trips for added peace of mind.
                </p>
                <Button variant="outline">Enable Location Sharing</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Safety Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Receive instant notifications about safety concerns, travel advisories, and important updates for your destination.
                </p>
                <Button variant="outline">Manage Alert Settings</Button>
              </CardContent>
            </Card>
          </div>

          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Essential Safety Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Before Your Trip</h4>
                <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                  <li>• Research your destination thoroughly</li>
                  <li>• Share your itinerary with family or friends</li>
                  <li>• Check travel advisories and local laws</li>
                  <li>• Ensure you have appropriate insurance</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">During Your Trip</h4>
                <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                  <li>• Stay in public, well-lit areas when meeting new people</li>
                  <li>• Keep your belongings secure at all times</li>
                  <li>• Trust your instincts - if something feels wrong, it probably is</li>
                  <li>• Stay in regular contact with trusted contacts</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">If You Feel Unsafe</h4>
                <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                  <li>• Contact local authorities immediately</li>
                  <li>• Use our emergency contact feature</li>
                  <li>• Move to a safe, public location</li>
                  <li>• Report the incident to our safety team</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Safety;
