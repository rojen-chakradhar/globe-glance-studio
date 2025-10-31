import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plane, HelpCircle, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-ocean">
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Travelone</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-[73px] py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-ocean mb-4">
              <HelpCircle className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Support Center</h1>
            <p className="text-muted-foreground">We're here to help you with any questions</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">support@travelone.com</p>
                <p className="text-xs text-muted-foreground">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">Available 24/7</p>
                <Button variant="outline" size="sm">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Phone className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-4">+1 (555) 123-4567</p>
                <p className="text-xs text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
