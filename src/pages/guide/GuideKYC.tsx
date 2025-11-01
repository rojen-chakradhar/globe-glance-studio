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
import { CalendarIcon, Upload, Compass } from "lucide-react";
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
    personalityType: "",
    whyChooseYou: "",
  });

  const [files, setFiles] = useState({
    citizenship: null as File | null,
    nid: null as File | null,
    driverLicense: null as File | null,
  });

  const [livePhotoBlob, setLivePhotoBlob] = useState<Blob | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'citizenship' | 'nid' | 'driverLicense') => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setShowCamera(true);
    } catch (error: any) {
      toast({
        title: "Camera Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (!videoStream) return;

    const video = document.getElementById('camera-preview') as HTMLVideoElement;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setLivePhotoBlob(blob);
        stopCamera();
        toast({
          title: "Photo Captured",
          description: "Live photo captured successfully",
        });
      }
    }, 'image/jpeg');
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setShowCamera(false);
  };

  const uploadFile = async (file: File | Blob, bucket: string, path: string) => {
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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("Please login first to submit KYC");
      }

      // Get guide profile
      const { data: guideProfile, error: profileError } = await supabase
        .from("guide_profiles")
        .select("id")
        .eq("user_id", user.id)
          .maybeSingle();

      if (profileError) throw profileError;
      if (!guideProfile) {
        toast({
          title: "Profile required",
          description: "Please complete your guide profile before submitting KYC.",
          variant: "destructive",
        });
        navigate("/guide/profile");
        setLoading(false);
        return;
      }

      // Validate all required fields with clear messages
      const missingFields: string[] = [];
      
      if (!formData.fullGovernmentName) missingFields.push("Full Government Name");
      if (!dateOfBirth) missingFields.push("Date of Birth");
      if (!formData.gender) missingFields.push("Gender");
      if (!formData.permanentAddress) missingFields.push("Permanent Address");
      if (!files.citizenship) missingFields.push("Citizenship Photo");
      if (!files.nid) missingFields.push("National ID Photo");
      if (!livePhotoBlob) missingFields.push("Live Photo");
      if (!formData.qualification) missingFields.push("Qualification");
      if (!formData.profession) missingFields.push("Profession");
      if (!formData.languages) missingFields.push("Languages");
      if (!formData.experienceDescription) missingFields.push("Experience Description");
      if (!formData.servicesProvided) missingFields.push("Services Provided");
      if (!formData.personalityType) missingFields.push("Type of Person");
      if (!formData.whyChooseYou) missingFields.push("Why Should Tourists Select You");
      if (!formData.emergencyContactName) missingFields.push("Emergency Contact Name");
      if (!formData.emergencyContactRelation) missingFields.push("Emergency Contact Relation");
      if (!formData.emergencyContactPhone) missingFields.push("Emergency Contact Phone");

      if (missingFields.length > 0) {
        toast({
          title: "Missing Required Fields",
          description: `Please fill in: ${missingFields.join(", ")}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Upload files
      let citizenshipUrl = "";
      let nidUrl = "";
      let livePhotoUrl = "";
      let driverLicenseUrl = "";

      citizenshipUrl = await uploadFile(
        files.citizenship,
        "kyc-documents",
        `${user.id}/citizenship_${Date.now()}.jpg`
      );

      nidUrl = await uploadFile(
        files.nid,
        "kyc-documents",
        `${user.id}/nid_${Date.now()}.jpg`
      );

      livePhotoUrl = await uploadFile(
        livePhotoBlob,
        "kyc-photos",
        `${user.id}/live_photo_${Date.now()}.jpg`
      );

      if (files.driverLicense) {
        driverLicenseUrl = await uploadFile(
          files.driverLicense,
          "kyc-documents",
          `${user.id}/driver_license_${Date.now()}.jpg`
        );
      }

      // Submit KYC data via secure backend function
      const { data: result, error: fnError } = await supabase.functions.invoke('submit-kyc', {
        body: {
          full_government_name: formData.fullGovernmentName,
          date_of_birth: dateOfBirth?.toISOString().split('T')[0],
          gender: formData.gender,
          permanent_address: formData.permanentAddress,
          citizenship_photo_url: citizenshipUrl,
          nid_photo_url: nidUrl,
          live_photo_url: livePhotoUrl,
          driver_license_photo_url: driverLicenseUrl || null,
          qualification: formData.qualification,
          profession: formData.profession,
          languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
          experience_description: formData.experienceDescription,
          services_provided: formData.servicesProvided,
          bad_habits: formData.badHabits,
          hobbies: formData.hobbies,
          dreams: formData.dreams,
          personality_type: formData.personalityType,
          why_choose_you: formData.whyChooseYou,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_relation: formData.emergencyContactRelation,
          emergency_contact_phone: formData.emergencyContactPhone,
        }
      });

      if (fnError) throw fnError;

      toast({
        title: "KYC Submitted",
        description: "Your verification is under review. You'll be notified once it's approved.",
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
        {/* Logo Header */}
        <div 
          className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => navigate("/guide")}
        >
          <div className="h-10 w-10 rounded-full bg-gradient-ocean flex items-center justify-center">
            <Compass className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Travelone Buddies</h1>
            <p className="text-xs text-muted-foreground">Guide Dashboard</p>
          </div>
        </div>

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
                <Select name="gender" value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                <Label htmlFor="citizenship">Citizenship Photo *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="citizenship"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'citizenship')}
                    className="hidden"
                    required
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
                <Label htmlFor="nid">National ID Photo *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="nid"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'nid')}
                    className="hidden"
                    required
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
                <Label htmlFor="livePhoto">Live Photo *</Label>
                <div className="space-y-2">
                  {!showCamera && !livePhotoBlob && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={startCamera}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Open Camera
                    </Button>
                  )}
                  
                  {showCamera && (
                    <div className="space-y-2">
                      <video
                        id="camera-preview"
                        autoPlay
                        playsInline
                        ref={(video) => {
                          if (video && videoStream) {
                            video.srcObject = videoStream;
                          }
                        }}
                        className="w-full max-w-md rounded-lg border"
                      />
                      <div className="flex gap-2">
                        <Button type="button" onClick={capturePhoto}>
                          Capture Photo
                        </Button>
                        <Button type="button" variant="outline" onClick={stopCamera}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {livePhotoBlob && !showCamera && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">✓ Photo Captured</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={startCamera}
                      >
                        Retake
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="driverLicense">Driver's License (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="driverLicense"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'driverLicense')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('driverLicense')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {files.driverLicense ? files.driverLicense.name : "Upload Driver's License"}
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
                <Label htmlFor="personalityType">Type of Person *</Label>
                <Select name="personalityType" value={formData.personalityType} onValueChange={(value) => setFormData({ ...formData, personalityType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select personality type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="extrovert">Extrovert</SelectItem>
                    <SelectItem value="introvert">Introvert</SelectItem>
                    <SelectItem value="omnivert">Omnivert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="whyChooseYou">Why Should Tourists Select You? *</Label>
                <Textarea
                  id="whyChooseYou"
                  name="whyChooseYou"
                  value={formData.whyChooseYou}
                  onChange={handleInputChange}
                  placeholder="Tell tourists what makes you special and why they should choose you as their guide"
                  required
                />
              </div>

              <div>
                <Label htmlFor="badHabits">Bad Habits (Optional)</Label>
                <Textarea
                  id="badHabits"
                  name="badHabits"
                  value={formData.badHabits}
                  onChange={handleInputChange}
                  placeholder="e.g., smoking, alcoholic, etc."
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