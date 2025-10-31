import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Gift, Percent, Tag, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Discounts = () => {
  const discounts = [
    {
      title: "First Trip Discount",
      description: "Get 20% off your first booking with us",
      code: "FIRST20",
      expiry: "Valid until Dec 31, 2025",
      type: "new",
    },
    {
      title: "Refer a Friend",
      description: "Earn $50 credit for each friend who books a trip",
      code: "REFER50",
      expiry: "No expiry",
      type: "referral",
    },
    {
      title: "Summer Special",
      description: "15% off on all beach destinations",
      code: "SUMMER15",
      expiry: "Valid until Sep 30, 2025",
      type: "seasonal",
    },
    {
      title: "Loyalty Reward",
      description: "25% off for members with 5+ trips",
      code: "LOYAL25",
      expiry: "Valid for eligible members",
      type: "loyalty",
    },
  ];

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
              <Gift className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Discounts & Gifts</h1>
            <p className="text-muted-foreground">Exclusive offers and rewards for our travelers</p>
          </div>

          {/* Points Summary */}
          <Card className="mb-8 bg-gradient-ocean text-primary-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Your Reward Points</h3>
                  <p className="text-sm opacity-90">Keep traveling to earn more rewards</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold flex items-center gap-2">
                    <Star className="h-8 w-8" />
                    1,250
                  </div>
                  <p className="text-sm opacity-90">points available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Discounts */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Available Offers</h2>
            
            {discounts.map((discount, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        {discount.type === "new" && <Tag className="h-5 w-5 text-primary" />}
                        {discount.type === "referral" && <Gift className="h-5 w-5 text-primary" />}
                        {discount.type === "seasonal" && <Percent className="h-5 w-5 text-primary" />}
                        {discount.type === "loyalty" && <Star className="h-5 w-5 text-primary" />}
                        {discount.title}
                      </CardTitle>
                      <p className="text-muted-foreground">{discount.description}</p>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {discount.code}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{discount.expiry}</p>
                    <Button size="sm" className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                      Apply Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How to Earn More */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How to Earn More Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Plane className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Book Trips</h4>
                  <p className="text-sm text-muted-foreground">Earn 100 points for every trip booked</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Gift className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Refer Friends</h4>
                  <p className="text-sm text-muted-foreground">Get 500 points when a friend books their first trip</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Leave Reviews</h4>
                  <p className="text-sm text-muted-foreground">Earn 50 points for every review you write</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Discounts;
