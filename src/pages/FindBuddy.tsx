import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FindBuddy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Find Buddies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Use the interactive map to search for nearby guides, see their offers, and choose who to meet.
            </p>
            <Link to="/map">
              <Button className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                Find Buddy on Map
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}