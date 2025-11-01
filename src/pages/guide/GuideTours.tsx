import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Compass, ArrowLeft, Plus, Edit, Trash2, MapPin, Clock, Users, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const tourSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  destination: z.string().min(2, "Destination is required").max(100),
  duration_hours: z.number().min(1, "Duration must be at least 1 hour").max(240),
  price_per_person: z.number().min(1, "Price must be greater than 0"),
  max_group_size: z.number().min(1, "Group size must be at least 1").max(50),
});

const GuideTours = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    duration_hours: 4,
    price_per_person: 1000,
    max_group_size: 10,
    status: "active",
  });

  useEffect(() => {
    checkAuth();
    fetchTours();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/guide/auth");
    }
  };

  const fetchTours = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('guide_profiles')
        .select('user_id')
        .eq('user_id', session.user.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('guide_id', profile.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      destination: "",
      duration_hours: 4,
      price_per_person: 1000,
      max_group_size: 10,
      status: "active",
    });
    setEditingTour(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      tourSchema.parse({
        ...formData,
        duration_hours: Number(formData.duration_hours),
        price_per_person: Number(formData.price_per_person),
        max_group_size: Number(formData.max_group_size),
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (editingTour) {
        const { error } = await supabase
          .from('tours')
          .update(formData)
          .eq('id', editingTour.id);

        if (error) throw error;
        toast({ title: "Tour updated successfully" });
      } else {
        const { error } = await supabase
          .from('tours')
          .insert([{ ...formData, guide_id: session.user.id }]);

        if (error) throw error;
        toast({ title: "Tour created successfully" });
      }

      setDialogOpen(false);
      resetForm();
      fetchTours();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (tour: any) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title,
      description: tour.description,
      destination: tour.destination,
      duration_hours: tour.duration_hours,
      price_per_person: tour.price_per_person,
      max_group_size: tour.max_group_size,
      status: tour.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (tourId: string) => {
    if (!confirm("Are you sure you want to delete this tour?")) return;

    try {
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', tourId);

      if (error) throw error;
      toast({ title: "Tour deleted successfully" });
      fetchTours();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Compass className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/guide" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">My Tours</h1>
            <p className="text-muted-foreground">Manage your tour offerings</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Tour
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTour ? "Edit Tour" : "Create New Tour"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tour Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Kathmandu Valley Heritage Tour"
                    required
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what makes this tour special..."
                    rows={4}
                    required
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="e.g., Kathmandu"
                      required
                    />
                    {errors.destination && <p className="text-sm text-destructive">{errors.destination}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration_hours">Duration (hours)</Label>
                    <Input
                      id="duration_hours"
                      name="duration_hours"
                      type="number"
                      value={formData.duration_hours}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                    {errors.duration_hours && <p className="text-sm text-destructive">{errors.duration_hours}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_per_person">Price per Person (NPR)</Label>
                    <Input
                      id="price_per_person"
                      name="price_per_person"
                      type="number"
                      value={formData.price_per_person}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                    {errors.price_per_person && <p className="text-sm text-destructive">{errors.price_per_person}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_group_size">Max Group Size</Label>
                    <Input
                      id="max_group_size"
                      name="max_group_size"
                      type="number"
                      value={formData.max_group_size}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                    {errors.max_group_size && <p className="text-sm text-destructive">{errors.max_group_size}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                    {editingTour ? "Update Tour" : "Create Tour"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {tours.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">No tours created yet</p>
              <Button onClick={() => setDialogOpen(true)} className="bg-gradient-ocean text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Tour
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <Card key={tour.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg text-foreground">{tour.title}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded ${tour.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>
                      {tour.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{tour.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{tour.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{tour.duration_hours} hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Max {tour.max_group_size} people</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>NPR {tour.price_per_person}/person</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(tour)} className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(tour.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideTours;