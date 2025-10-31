import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageCircle, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const TravelBuddy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-8">
          ← Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-ocean mb-6">
            <Users className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Travel Buddy</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with fellow travelers and explore the world together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-elevated transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-ocean mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Match with Travelers</h3>
              <p className="text-muted-foreground">Find companions who share your travel interests and style</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elevated transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-ocean mb-4">
                <MessageCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Chat & Plan</h3>
              <p className="text-muted-foreground">Communicate and plan your adventures together</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elevated transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-ocean mb-4">
                <Globe className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Community</h3>
              <p className="text-muted-foreground">Join a worldwide network of adventure seekers</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
            Start Finding Buddies
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TravelBuddy;