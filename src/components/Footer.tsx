import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Plane } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-ocean text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/20">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Travelone</h3>
            </div>
            <p className="text-sm text-white/80">
              Your trusted companion for exploring the beauty and culture of Nepal.
              Connect with local guides and discover hidden gems.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+977 123-456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@travelone.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white/80 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-white/80 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-white/80 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/80">
          <p>&copy; {new Date().getFullYear()} Travelone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
