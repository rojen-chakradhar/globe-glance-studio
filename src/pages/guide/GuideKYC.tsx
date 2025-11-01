import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GuideKYC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  
  const [formData, setFormData] = useState({
    fullGovernmentName: "",
    gender: "",
    permanentAddress: "",
    qualification: "",
    profession: "",
    languages: "",
    experienceDescription: "",
    servicesProvided: "",
    badHabits: "",
    hobbies: "",
    dreams: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
  });

  const [files, setFiles] = useState({
    citizenship: null as File | null,
    nid: null as File | null,
    livePhoto: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'citizenship' | 'nid' | 'livePhoto') => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get guide profile
      const { data: guideProfile, error: profileError } = await supabase
        .from("guide_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      // Upload files
      let citizenshipUrl = "";
      let nidUrl = "";
      let livePhotoUrl = "";

      if (files.citizenship) {
        citizenshipUrl = await uploadFile(
          files.citizenship,
          "kyc-documents",
          `${user.id}/citizenship_${Date.now()}.jpg`
        );
      }

      if (files.nid) {
        nidUrl = await uploadFile(
          files.nid,
          "kyc-documents",
          `${user.id}/nid_${Date.now()}.jpg`
        );
      }

      if (files.livePhoto) {
        livePhotoUrl = await uploadFile(
          files.livePhoto,
          "kyc-photos",
          `${user.id}/live_photo_${Date.now()}.jpg`
        );
      }

      // Submit KYC data
      const { error: kycError } = await supabase
        .from("kyc_verifications")
        .insert({
          user_id: user.id,
          guide_profile_id: guideProfile.id,
          full_government_name: formData.fullGovernmentName,
          date_of_birth: dateOfBirth?.toISOString().split('T')[0],
          gender: formData.gender,
          permanent_address: formData.permanentAddress,
          citizenship_photo_url: citizenshipUrl,
          nid_photo_url: nidUrl,
          live_photo_url: livePhotoUrl,
          qualification: formData.qualification,
          profession: formData.profession,
          languages: formData.languages.split(',').map(l => l.trim()),
          experience_description: formData.experienceDescription,
          services_provided: formData.servicesProvided,
          bad_habits: formData.badHabits,
          hobbies: formData.hobbies,
          dreams: formData.dreams,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_relation: formData.emergencyContactRelation,
          emergency_contact_phone: formData.emergencyContactPhone,
        });

      if (kycError) throw kycError;

      toast({
        title: "KYC Submitted Successfully",
        description: "Your verification is pending review. We'll notify you once approved.",
      });

      navigate("/guide");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">KYC Verification</h1>
          <p className="text-muted-foreground mb-6">Please complete the verification process to activate your guide account.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              
              <div>
                <Label htmlFor="fullGovernmentName">Full Government Name *</Label>
                <Input
                  id="fullGovernmentName"
                  name="fullGovernmentName"
                  value={formData.fullGovernmentName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={setDateOfBirth}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select name="gender" value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="permanentAddress">Permanent Address *</Label>
                <Textarea
                  id="permanentAddress"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Documents</h2>
              
              <div>
                <Label htmlFor="citizenship">Citizenship Photo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="citizenship"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'citizenship')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('citizenship')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {files.citizenship ? files.citizenship.name : "Upload Citizenship"}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="nid">National ID Photo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="nid"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'nid')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('nid')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {files.nid ? files.nid.name : "Upload NID"}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="livePhoto">Live Photo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="livePhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'livePhoto')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('livePhoto')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {files.livePhoto ? files.livePhoto.name : "Upload Live Photo"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Professional Information</h2>
              
              <div>
                <Label htmlFor="qualification">Qualification *</Label>
                <Input
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="profession">Profession *</Label>
                <Input
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="languages">Languages (comma-separated) *</Label>
                <Input
                  id="languages"
                  name="languages"
                  placeholder="e.g., English, Spanish, French"
                  value={formData.languages}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="experienceDescription">Experience Description *</Label>
                <Textarea
                  id="experienceDescription"
                  name="experienceDescription"
                  value={formData.experienceDescription}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="servicesProvided">Services You Can Provide *</Label>
                <Textarea
                  id="servicesProvided"
                  name="servicesProvided"
                  value={formData.servicesProvided}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Details</h2>
              
              <div>
                <Label htmlFor="badHabits">Bad Habits (Optional)</Label>
                <Textarea
                  id="badHabits"
                  name="badHabits"
                  value={formData.badHabits}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="hobbies">Hobbies (Optional)</Label>
                <Textarea
                  id="hobbies"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="dreams">Dreams (Optional)</Label>
                <Textarea
                  id="dreams"
                  name="dreams"
                  value={formData.dreams}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Emergency Contact</h2>
              
              <div>
                <Label htmlFor="emergencyContactName">Contact Name *</Label>
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="emergencyContactRelation">Relation *</Label>
                <Input
                  id="emergencyContactRelation"
                  name="emergencyContactRelation"
                  value={formData.emergencyContactRelation}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit KYC Verification"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default GuideKYC;