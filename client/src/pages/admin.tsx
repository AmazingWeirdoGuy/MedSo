import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Newspaper, Image, Plus, Edit, Trash2, Mail, ExternalLink, GraduationCap, Check, X, Save, Upload, Activity } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import Cropper from "react-easy-crop";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Member, MemberClass, News, HeroImage, AdminUser, Program } from "@shared/schema";
import blankPfpPath from "@assets/blank-pfp.png";

export default function AdminPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  // Check admin status
  const { data: adminData, isLoading: adminLoading } = useQuery<{
    isAdmin: boolean;
    adminUser: AdminUser | null;
  }>({
    queryKey: ["/api/auth/admin"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the admin panel.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  // Check if user has admin access
  useEffect(() => {
    if (!adminLoading && isAuthenticated && !adminData?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have admin access to this panel.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return;
    }
  }, [adminData?.isAdmin, adminLoading, isAuthenticated, toast]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loading size="lg" variant="spinner" />
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !adminData?.isAdmin) {
    return null; // Redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 
                className="text-3xl font-bold text-slate-900 dark:text-white"
                style={{ 
                  fontFamily: 'Beo, serif',
                  letterSpacing: '0.02em'
                }}
                data-testid="admin-title"
              >
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Welcome back, {user?.firstName || 'Admin'}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Admin
              </Badge>
              <Button 
                variant="outline" 
                onClick={async () => {
                  try {
                    await fetch("/api/logout", { method: "POST", credentials: "include" });
                    window.location.href = "/login";
                  } catch (error) {
                    window.location.href = "/login";
                  }
                }}
                data-testid="button-logout"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Main Content Tabs */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList 
            className="grid w-full grid-cols-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <TabsTrigger value="members" data-testid="tab-members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="member-classes" data-testid="tab-member-classes">
              <GraduationCap className="h-4 w-4 mr-2" />
              Member Classes
            </TabsTrigger>
            <TabsTrigger value="programs" data-testid="tab-programs">
              <Activity className="h-4 w-4 mr-2" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="news" data-testid="tab-news">
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="hero" data-testid="tab-hero">
              <Image className="h-4 w-4 mr-2" />
              Hero Images
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <MemberManagement />
          </TabsContent>

          <TabsContent value="member-classes">
            <MemberClassManagement />
          </TabsContent>

          <TabsContent value="programs">
            <ProgramManagement />
          </TabsContent>

          <TabsContent value="news">
            <NewsManagement />
          </TabsContent>

          <TabsContent value="hero">
            <HeroImageManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Unified Member Modal Component for both Add and Edit
function MemberModal({
  member,
  memberClasses,
  isOpen,
  onOpenChange,
  mode = "edit",
  defaultMemberClassId
}: {
  member?: Member;
  memberClasses: MemberClass[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  defaultMemberClassId?: string;
}) {
  const [formData, setFormData] = useState({
    name: member?.name || "",
    role: member?.role || "",
    image: member?.image || "",
    displayOrder: member?.displayOrder || 0,
    isActive: member?.isActive ?? true,
    memberClassId: member?.memberClassId || defaultMemberClassId || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(member?.thumbnail || member?.image || "");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const { toast } = useToast();

  // Reset form when modal opens with different member or mode
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: member?.name || "",
        role: member?.role || "",
        image: member?.image || "",
        displayOrder: member?.displayOrder || 0,
        isActive: member?.isActive ?? true,
        memberClassId: member?.memberClassId || defaultMemberClassId || "",
      });
      setImagePreview(member?.thumbnail || member?.image || "");
      setImageFile(null);
      setOriginalImage(null);
      setShowCropper(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  }, [isOpen, member, defaultMemberClassId]);

  // Update member mutation
  const updateMemberMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", `/api/admin/members/${member?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Member updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update member. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/members", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Member added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Crop completion callback
  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Handle initial image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        setShowCropper(true);
        // Reset cropping state
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create cropped image
  const createCroppedImage = useCallback(
    async (imageSrc: string, pixelCrop: any) => {
      const image = new window.Image();
      image.src = imageSrc;
      
      return new Promise<string>((resolve) => {
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx || !pixelCrop) {
            resolve(imageSrc);
            return;
          }
          
          canvas.width = pixelCrop.width;
          canvas.height = pixelCrop.height;
          
          ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
          );
          
          resolve(canvas.toDataURL('image/png'));
        };
      });
    },
    []
  );

  // Apply crop
  const handleApplyCrop = async () => {
    if (!originalImage || !croppedAreaPixels) return;
    
    try {
      const croppedImage = await createCroppedImage(originalImage, croppedAreaPixels);
      setImagePreview(croppedImage);
      setFormData({ ...formData, image: croppedImage });
      setShowCropper(false);
      setOriginalImage(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process cropped image. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setShowCropper(false);
    setOriginalImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    // Clear the file input
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleSave = () => {
    const memberClass = memberClasses.find(mc => mc.id === formData.memberClassId);
    const isActiveMemberClass = memberClass?.name === "Active Member";
    
    const dataToSave = { ...formData };
    if (isActiveMemberClass) {
      dataToSave.role = "";
      // Active Members can now have images, so don't clear the image field
    }
    
    // Validation
    if (!dataToSave.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!isActiveMemberClass && !dataToSave.role.trim()) {
      toast({
        title: "Validation Error",
        description: "Role is required for this member class.",
        variant: "destructive",
      });
      return;
    }

    if (mode === "edit") {
      updateMemberMutation.mutate(dataToSave);
    } else {
      addMemberMutation.mutate(dataToSave);
    }
  };

  const selectedClass = memberClasses.find(mc => mc.id === formData.memberClassId);
  const isActiveMemberClass = selectedClass?.name === "Active Member";
  const isLoading = updateMemberMutation.isPending || addMemberMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "add" ? "Add New Member" : "Member Details"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Add a new member to the society" 
              : `Edit detailed information for ${member?.name}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Image Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Profile Image</Label>
            
            {showCropper && originalImage ? (
              <div className="space-y-4">
                <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
                  <Cropper
                    image={originalImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1} // Square aspect ratio
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">Zoom:</Label>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancelCrop}
                      data-testid="button-cancel-crop"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleApplyCrop}
                      disabled={!croppedAreaPixels}
                      data-testid="button-apply-crop"
                    >
                      Apply Crop
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={imagePreview || blankPfpPath}
                    alt={formData.name || "Profile"}
                    className="w-32 h-32 rounded-lg object-cover border-2 border-white/20"
                    data-testid="img-detail-preview"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    data-testid="button-choose-image"
                  >
                    Choose Image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    data-testid="button-browse"
                  >
                    Browse
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="detail-name">Name *</Label>
              <Input
                id="detail-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                data-testid="input-detail-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detail-class">Member Class</Label>
              <Select
                value={formData.memberClassId}
                onValueChange={(value) => setFormData({ ...formData, memberClassId: value })}
              >
                <SelectTrigger data-testid="select-detail-class">
                  <SelectValue placeholder="Select member class" />
                </SelectTrigger>
                <SelectContent>
                  {memberClasses.map((memberClass) => (
                    <SelectItem key={memberClass.id} value={memberClass.id}>
                      {memberClass.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isActiveMemberClass && (
              <div className="space-y-2">
                <Label htmlFor="detail-role">Role *</Label>
                <Input
                  id="detail-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Enter role/title"
                  data-testid="input-detail-role"
                />
              </div>
            )}


            <div className="space-y-2">
              <Label htmlFor="detail-order">Display Order</Label>
              <Input
                id="detail-order"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                placeholder="Display order"
                data-testid="input-detail-order"
              />
            </div>
          </div>

          {/* Published Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Status</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="published"
                  name="status"
                  checked={formData.isActive}
                  onChange={() => setFormData({ ...formData, isActive: true })}
                  data-testid="radio-published"
                />
                <Label htmlFor="published" className="text-sm">Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="unpublished"
                  name="status"
                  checked={!formData.isActive}
                  onChange={() => setFormData({ ...formData, isActive: false })}
                  data-testid="radio-unpublished"
                />
                <Label htmlFor="unpublished" className="text-sm">Unpublished</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            data-testid="button-detail-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            data-testid="button-detail-save"
          >
            {isLoading ? (
              <>
                <Loading size="sm" variant="spinner" className="mr-2" />
                {mode === "add" ? "Adding..." : "Saving..."}
              </>
            ) : (
              mode === "add" ? "Add Member" : "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Member Management Component
function MemberManagement() {
  const [detailMember, setDetailMember] = useState<Member | null>(null);
  const { toast } = useToast();

  // Fetch members and member classes
  const { data: members, isLoading: membersLoading, isError: membersError } = useQuery<Member[]>({
    queryKey: ["/api/admin/members"],
  });

  const { data: memberClasses, isLoading: classesLoading } = useQuery<MemberClass[]>({
    queryKey: ["/api/admin/member-classes"],
  });

  // Group members by class
  const getClassMembers = (className: string) => {
    if (!members || !memberClasses) return [];
    const memberClass = memberClasses.find(mc => mc.name === className);
    if (!memberClass) return [];
    return members
      .filter(member => member.memberClassId === memberClass.id && member.isActive)
      .sort((a, b) => {
        const orderA = a.displayOrder || 0;
        const orderB = b.displayOrder || 0;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });
  };

  const websiteManagers = getClassMembers("Website Manager");
  const officers = getClassMembers("Officer");
  const activeMembers = getClassMembers("Active Member");
  const facultyAdvisors = getClassMembers("Faculty Advisors");




  if (membersLoading || classesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  if (membersError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Failed to load members. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-white/20"
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      <CardHeader className="border-b border-white/10">
        <CardTitle 
          className="text-2xl text-slate-900 dark:text-white"
          style={{ 
            fontFamily: 'Beo, serif',
            letterSpacing: '0.02em'
          }}
          data-testid="members-title"
        >
          Members Management
        </CardTitle>
        <CardDescription>
          Manage members by their roles and classifications
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Accordion type="multiple" defaultValue={["website-manager", "officer"]}>
          <ClassSection
            value="website-manager"
            title="Website Manager"
            members={websiteManagers}
            memberClasses={memberClasses}
            className="Website Manager"
            onMemberDetail={setDetailMember}
          />
          
          <ClassSection
            value="officer"
            title="Officers"
            members={officers}
            memberClasses={memberClasses}
            className="Officer"
            onMemberDetail={setDetailMember}
          />
          
          <ClassSection
            value="active-member"
            title="Active Members"
            members={activeMembers}
            memberClasses={memberClasses}
            className="Active Member"
            onMemberDetail={setDetailMember}
          />
          
          <ClassSection
            value="faculty-advisor"
            title="Faculty Advisors"
            members={facultyAdvisors}
            memberClasses={memberClasses}
            className="Faculty Advisors"
            onMemberDetail={setDetailMember}
          />
        </Accordion>
        
        {/* Member Detail Modal */}
        {detailMember && (
          <MemberModal
            member={detailMember}
            memberClasses={memberClasses || []}
            isOpen={!!detailMember}
            onOpenChange={(open: boolean) => !open && setDetailMember(null)}
            mode="edit"
          />
        )}
      </CardContent>
    </Card>
  );
}

// Class Section Component for Accordion
function ClassSection({ 
  value, 
  title, 
  members, 
  memberClasses, 
  className,
  onMemberDetail
}: {
  value: string;
  title: string;
  members: Member[];
  memberClasses: MemberClass[] | undefined;
  className: string;
  onMemberDetail?: (member: Member) => void;
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  // Mutations
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest("PUT", `/api/admin/members/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({
        title: "Success",
        description: "Member updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update member. Please try again.",
        variant: "destructive",
      });
    },
  });


  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({
        title: "Success",
        description: "Member deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const targetClass = memberClasses?.find(mc => mc.name === className);
  const isActiveMemberClass = className === "Active Member";

  // Handle missing member class
  if (memberClasses && !targetClass) {
    return (
      <AccordionItem value={value} className="border border-red-200 rounded-lg mb-4">
        <AccordionTrigger className="px-6 py-4 text-red-600">
          <span>{title} (Class Not Found)</span>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <p className="text-red-600 text-sm">
            Member class "{className}" not found in database. Please check member class configuration.
          </p>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <AccordionItem value={value} className="border border-white/20 rounded-lg mb-4">
      <AccordionTrigger 
        className="px-6 py-4 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-t-lg"
        data-testid={`accordion-${value}`}
      >
        <div className="flex items-center justify-between w-full mr-4">
          <span className="text-lg font-medium">{title}</span>
          <Badge variant="outline" className="ml-2">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Manage {title.toLowerCase()} for the medical society
            </p>
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              data-testid={`button-add-${value}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {className}
            </Button>
          </div>

          <div className="border border-white/20 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/30 dark:bg-slate-800/30">
                  <TableHead className="w-[200px]">Name</TableHead>
                  {!isActiveMemberClass && <TableHead className="w-[150px]">Role</TableHead>}
                  {!isActiveMemberClass && <TableHead className="w-[100px]">Image</TableHead>}
                  <TableHead className="w-[80px]">Order</TableHead>
                  <TableHead className="w-[80px]">Active</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <MemberInlineRow
                    key={member.id}
                    member={member}
                    isActiveMemberClass={isActiveMemberClass}
                    onSave={(data) => updateMemberMutation.mutate({ id: member.id, data })}
                    onDelete={() => deleteMemberMutation.mutate(member.id)}
                    onDetail={onMemberDetail}
                    isUpdating={updateMemberMutation.isPending}
                    isDeleting={deleteMemberMutation.isPending}
                  />
                ))}
                {members.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={isActiveMemberClass ? 4 : 6} 
                      className="text-center py-8 text-muted-foreground"
                    >
                      No {title.toLowerCase()} yet. Click "Add {className}" to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Add Member Modal */}
        <MemberModal
          memberClasses={memberClasses || []}
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          mode="add"
          defaultMemberClassId={targetClass?.id}
        />
      </AccordionContent>
    </AccordionItem>
  );
}

// Member Inline Row Component for editing
function MemberInlineRow({
  member,
  isActiveMemberClass,
  onSave,
  onDelete,
  onDetail,
  isUpdating,
  isDeleting
}: {
  member: Member;
  isActiveMemberClass: boolean;
  onSave: (data: any) => void;
  onDelete: () => void;
  onDetail?: (member: Member) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: member.name || "",
    role: member.role || "",
    image: member.image || "",
    displayOrder: member.displayOrder || 0,
    isActive: member.isActive ?? true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const dataToSave = { ...formData };
    if (isActiveMemberClass) {
      dataToSave.role = "";
      dataToSave.image = "";
    }
    onSave(dataToSave);
    setIsEditing(false);
  };

  const canSave = formData.name.trim() && 
    (isActiveMemberClass || (formData.role.trim() && formData.image.trim()));

  const handleCancel = () => {
    setFormData({
      name: member.name || "",
      role: member.role || "",
      image: member.image || "",
      displayOrder: member.displayOrder || 0,
      isActive: member.isActive ?? true,
    });
    setIsEditing(false);
  };

  return (
    <TableRow className="hover:bg-white/20 dark:hover:bg-slate-800/20">
      <TableCell>
        {isEditing ? (
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter name"
            className="h-8"
            data-testid={`input-edit-name-${member.id}`}
          />
        ) : (
          <span data-testid={`text-name-${member.id}`}>{member.name}</span>
        )}
      </TableCell>
      
      {!isActiveMemberClass && (
        <TableCell>
          {isEditing ? (
            <Input
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Enter role"
              className="h-8"
              data-testid={`input-edit-role-${member.id}`}
            />
          ) : (
            <span data-testid={`text-role-${member.id}`}>{member.role}</span>
          )}
        </TableCell>
      )}

      {!isActiveMemberClass && (
        <TableCell>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 text-xs"
                data-testid={`button-edit-image-${member.id}`}
              >
                <Upload className="h-3 w-3 mr-1" />
                {formData.image ? "Change" : "Upload"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-6 h-6 rounded object-cover"
                  data-testid={`img-edit-preview-${member.id}`}
                />
              )}
            </div>
          ) : (
            member.image ? (
              <img 
                src={member.image} 
                alt={member.name}
                className="w-8 h-8 rounded-full object-cover"
                data-testid={`img-${member.id}`}
              />
            ) : (
              <span className="text-muted-foreground text-sm">No image</span>
            )
          )}
        </TableCell>
      )}


      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={formData.displayOrder}
            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
            className="h-8 w-16"
            data-testid={`input-edit-order-${member.id}`}
          />
        ) : (
          <span data-testid={`text-order-${member.id}`}>{member.displayOrder || 0}</span>
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            data-testid={`checkbox-edit-active-${member.id}`}
          />
        ) : (
          <Badge variant={member.isActive ? "default" : "secondary"} data-testid={`badge-active-${member.id}`}>
            {member.isActive ? "Active" : "Inactive"}
          </Badge>
        )}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSave}
                disabled={isUpdating || !canSave}
                data-testid={`button-save-${member.id}`}
              >
                {isUpdating ? <Loading size="sm" variant="spinner" /> : <Check className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdating}
                data-testid={`button-cancel-${member.id}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                data-testid={`button-edit-${member.id}`}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDetail && onDetail(member)}
                data-testid={`button-detail-${member.id}`}
              >
                Detail
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    disabled={isDeleting}
                    data-testid={`button-delete-${member.id}`}
                  >
                    {isDeleting ? <Loading size="sm" variant="spinner" /> : <Trash2 className="h-3 w-3" />}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Member</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {member.name}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// New Member Inline Row Component
function NewMemberInlineRow({
  memberClassId,
  isActiveMemberClass,
  onSave,
  onCancel,
  isLoading
}: {
  memberClassId: string;
  isActiveMemberClass: boolean;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    email: "",
    displayOrder: 0,
    isActive: true,
    memberClassId: memberClassId,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    const dataToSave = { ...formData };
    if (isActiveMemberClass) {
      dataToSave.role = "";
      dataToSave.image = "";
    } else {
      if (!dataToSave.role.trim() || !dataToSave.image.trim()) return;
    }
    
    onSave(dataToSave);
  };

  const canSave = formData.name.trim() && 
    (isActiveMemberClass || (formData.role.trim() && formData.image.trim()));

  return (
    <TableRow className="bg-blue-50 dark:bg-blue-900/20">
      <TableCell>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter name *"
          className="h-8"
          data-testid="input-new-name"
        />
      </TableCell>
      
      {!isActiveMemberClass && (
        <TableCell>
          <Input
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="Enter role *"
            className="h-8"
            data-testid="input-new-role"
          />
        </TableCell>
      )}

      {!isActiveMemberClass && (
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 text-xs"
              data-testid="button-new-image"
            >
              <Upload className="h-3 w-3 mr-1" />
              {formData.image ? "Change" : "Upload"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-6 h-6 rounded object-cover"
                data-testid="img-new-preview"
              />
            )}
          </div>
        </TableCell>
      )}

      <TableCell>
        <Input
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          className="h-8"
          data-testid="input-new-email"
        />
      </TableCell>

      <TableCell>
        <Input
          type="number"
          value={formData.displayOrder}
          onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
          className="h-8 w-16"
          data-testid="input-new-order"
        />
      </TableCell>

      <TableCell>
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          data-testid="checkbox-new-active"
        />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSave}
            disabled={isLoading || !canSave}
            data-testid="button-save-new"
          >
            {isLoading ? <Loading size="sm" variant="spinner" /> : <Check className="h-3 w-3" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            data-testid="button-cancel-new"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Member Card Component
function MemberCard({ 
  member, 
  onEdit, 
  onDelete, 
  isDeleting 
}: { 
  member: Member; 
  onEdit: (member: Member) => void; 
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="group relative bg-white/50 dark:bg-slate-800/50 rounded-lg border border-white/20 p-6 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300">
      {/* Member Photo */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <img
            src={member.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
            alt={member.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
            data-testid={`img-member-${member.id}`}
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${member.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate" data-testid={`text-member-name-${member.id}`}>
            {member.name}
          </h3>
          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium" data-testid={`text-member-role-${member.id}`}>
            {member.role}
          </p>
          {member.year && (
            <p className="text-muted-foreground text-xs flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {member.year}
            </p>
          )}
        </div>
      </div>

      {/* Member Bio */}
      {member.bio && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3" data-testid={`text-member-bio-${member.id}`}>
          {member.bio}
        </p>
      )}

      {/* Contact Info */}
      <div className="flex items-center gap-2 mb-4">
        {member.linkedIn && (
          <a
            href={member.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            data-testid={`link-member-linkedin-${member.id}`}
          >
            <ExternalLink className="h-3 w-3" />
            LinkedIn
          </a>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Badge variant={member.isActive ? "default" : "secondary"} data-testid={`badge-member-status-${member.id}`}>
          {member.isActive ? "Active" : "Inactive"}
        </Badge>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(member)}
            data-testid={`button-edit-member-${member.id}`}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                disabled={isDeleting}
                data-testid={`button-delete-member-${member.id}`}
              >
                {isDeleting ? <Loading size="sm" variant="spinner" /> : <Trash2 className="h-3 w-3" />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Member</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {member.name}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(member.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

// Add Member Dialog Component
function AddMemberDialog({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  isLoading 
}: { 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    memberClassId: "",
    bio: "",
    email: "",
    linkedIn: "",
    year: "",
    image: "",
    displayOrder: 0,
    isActive: true,
  });

  // Fetch member classes for selection
  const { data: memberClasses } = useQuery<MemberClass[]>({
    queryKey: ["/api/admin/member-classes"],
  });

  // Determine if selected class is Active Member
  const selectedMemberClass = memberClasses?.find(mc => mc.id === formData.memberClassId);
  const isActiveMember = selectedMemberClass?.name === "Active Member";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      role: "",
      memberClassId: "",
      bio: "",
      email: "",
      linkedIn: "",
      year: "",
      image: "",
      displayOrder: 0,
      isActive: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-member">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Add a new member to the ISB Medical Society
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter member name"
                required
                data-testid="input-member-name"
              />
            </div>
            {!isActiveMember && (
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., President, Vice President"
                  required
                  data-testid="input-member-role"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberClass">Member Class</Label>
            <Select
              value={formData.memberClassId || "none"}
              onValueChange={(value) => setFormData({ ...formData, memberClassId: value === "none" ? "" : value })}
            >
              <SelectTrigger data-testid="select-member-class">
                <SelectValue placeholder="Select member class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Class Assigned</SelectItem>
                {memberClasses?.map((memberClass) => (
                  <SelectItem key={memberClass.id} value={memberClass.id}>
                    {memberClass.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief description of the member's background and interests"
              className="min-h-[100px]"
              data-testid="input-member-bio"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="member@isbmedicalsociety.org"
                data-testid="input-member-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Grade/Year</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g., Grade 12, Senior"
                data-testid="input-member-year"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isActiveMember && (
              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                  data-testid="input-member-image"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="linkedIn">LinkedIn Profile</Label>
              <Input
                id="linkedIn"
                value={formData.linkedIn}
                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                data-testid="input-member-linkedin"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                placeholder="0"
                data-testid="input-member-display-order"
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                data-testid="switch-member-active"
              />
              <Label htmlFor="isActive">Active Member</Label>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              data-testid="button-submit-member"
            >
              {isLoading ? <Loading size="sm" variant="spinner" className="mr-2" /> : null}
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Member Dialog Component  
function EditMemberDialog({ 
  member,
  isOpen, 
  onOpenChange, 
  onSubmit, 
  isLoading 
}: { 
  member: Member;
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: member.name,
    role: member.role,
    memberClassId: member.memberClassId || "",
    bio: member.bio || "",
    linkedIn: member.linkedIn || "",
    year: member.year || "",
    image: member.image || "",
    displayOrder: member.displayOrder || 0,
    isActive: member.isActive ?? true,
  });

  // Fetch member classes for selection
  const { data: memberClasses } = useQuery<MemberClass[]>({
    queryKey: ["/api/admin/member-classes"],
  });

  // Determine if selected class is Active Member
  const selectedMemberClass = memberClasses?.find(mc => mc.id === formData.memberClassId);
  const isActiveMember = selectedMemberClass?.name === "Active Member";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Update {member.name}'s information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter member name"
                required
                data-testid="input-edit-member-name"
              />
            </div>
            {!isActiveMember && (
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role *</Label>
                <Input
                  id="edit-role"
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., President, Vice President"
                  required
                  data-testid="input-edit-member-role"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-memberClass">Member Class</Label>
            <Select
              value={formData.memberClassId || "none"}
              onValueChange={(value) => setFormData({ ...formData, memberClassId: value === "none" ? "" : value })}
            >
              <SelectTrigger data-testid="select-edit-member-class">
                <SelectValue placeholder="Select member class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Class Assigned</SelectItem>
                {memberClasses?.map((memberClass) => (
                  <SelectItem key={memberClass.id} value={memberClass.id}>
                    {memberClass.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-bio">Bio</Label>
            <Textarea
              id="edit-bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief description of the member's background and interests"
              className="min-h-[100px]"
              data-testid="input-edit-member-bio"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-year">Grade/Year</Label>
              <Input
                id="edit-year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g., Grade 12, Senior"
                data-testid="input-edit-member-year"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isActiveMember && (
              <div className="space-y-2">
                <Label htmlFor="edit-image">Profile Image URL *</Label>
                <Input
                  id="edit-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                  data-testid="input-edit-member-image"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-linkedIn">LinkedIn Profile</Label>
              <Input
                id="edit-linkedIn"
                value={formData.linkedIn}
                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                data-testid="input-edit-member-linkedin"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-displayOrder">Display Order</Label>
              <Input
                id="edit-displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                placeholder="0"
                data-testid="input-edit-member-display-order"
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="edit-isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                data-testid="switch-edit-member-active"
              />
              <Label htmlFor="edit-isActive">Active Member</Label>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              data-testid="button-update-member"
            >
              {isLoading ? <Loading size="sm" variant="spinner" className="mr-2" /> : null}
              Update Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// News Management Component
function NewsManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch news
  const { data: newsItems, isLoading, isError, refetch } = useQuery<News[]>({
    queryKey: ["/api/admin/news"],
  });

  // Sort news by creation date (newest first)
  const sortedNews = newsItems ? [...newsItems].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  }) : [];

  // Add news mutation
  const addNewsMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/news", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news/published"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "News article added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add news article. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update news mutation
  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest("PUT", `/api/admin/news/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news/published"] });
      setEditingNews(null);
      toast({
        title: "Success",
        description: "News article updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update news article. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete news mutation
  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news/published"] });
      setDeletingNewsId(null);
      toast({
        title: "Success",
        description: "News article deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete news article. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loading size="lg" variant="spinner" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
        <CardContent className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">Failed to load news articles</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              News Management
            </CardTitle>
            <CardDescription>
              Create, edit, and publish news articles
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-news">
                <Plus className="h-4 w-4 mr-2" />
                Add News Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <NewsForm
                onSubmit={(data) => addNewsMutation.mutate(data)}
                isLoading={addNewsMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sortedNews.length === 0 ? (
          <div className="text-center py-8">
            <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No News Articles</h3>
            <p className="text-muted-foreground mb-4">
              Create your first news article to share updates
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedNews.map((newsItem) => (
              <div
                key={newsItem.id}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                data-testid={`news-item-${newsItem.id}`}
              >
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{newsItem.title}</h3>
                        <Badge variant={newsItem.isPublished ? "default" : "secondary"}>
                          {newsItem.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {newsItem.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {newsItem.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {newsItem.createdAt ? new Date(newsItem.createdAt).toLocaleDateString() : 'Unknown'}
                        {newsItem.publishDate && (
                          <span> • Published: {new Date(newsItem.publishDate).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog
                        open={editingNews?.id === newsItem.id}
                        onOpenChange={(open) =>
                          setEditingNews(open ? newsItem : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-edit-news-${newsItem.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <NewsForm
                            newsItem={newsItem}
                            onSubmit={(data) =>
                              updateNewsMutation.mutate({
                                id: newsItem.id,
                                data,
                              })
                            }
                            isLoading={updateNewsMutation.isPending}
                          />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog
                        open={deletingNewsId === newsItem.id}
                        onOpenChange={(open) =>
                          setDeletingNewsId(open ? newsItem.id : null)
                        }
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                            data-testid={`button-delete-news-${newsItem.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete News Article</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{newsItem.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteNewsMutation.mutate(newsItem.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit News Dialog */}
        {editingNews && (
          <Dialog
            open={!!editingNews}
            onOpenChange={(open) => !open && setEditingNews(null)}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <NewsForm
                newsItem={editingNews}
                onSubmit={(data) =>
                  updateNewsMutation.mutate({
                    id: editingNews.id,
                    data,
                  })
                }
                isLoading={updateNewsMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

// Member Class Management Component
function MemberClassManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<MemberClass | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch member classes
  const { data: memberClasses, isLoading, isError, refetch } = useQuery<MemberClass[]>({
    queryKey: ["/api/admin/member-classes"],
  });

  // Sort member classes by display order
  const sortedClasses = memberClasses ? [...memberClasses].sort((a, b) => {
    const orderA = a.displayOrder || 0;
    const orderB = b.displayOrder || 0;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  }) : [];

  // Add member class mutation
  const addClassMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/member-classes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/member-classes"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Member class added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add member class. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update member class mutation
  const updateClassMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest("PUT", `/api/admin/member-classes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/member-classes"] });
      setEditingClass(null);
      toast({
        title: "Success",
        description: "Member class updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update member class. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete member class mutation
  const deleteClassMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/member-classes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/member-classes"] });
      setDeletingClassId(null);
      toast({
        title: "Success",
        description: "Member class deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete member class. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loading size="lg" variant="spinner" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
        <CardContent className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">Failed to load member classes</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Member Classes
            </CardTitle>
            <CardDescription>
              Manage member categories and hierarchies
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-member-class">
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <MemberClassForm
                onSubmit={(data) => addClassMutation.mutate(data)}
                isLoading={addClassMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sortedClasses.length === 0 ? (
          <div className="text-center py-8">
            <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Member Classes</h3>
            <p className="text-muted-foreground mb-4">
              Create your first member class to organize your team
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedClasses.map((memberClass) => (
              <div
                key={memberClass.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                data-testid={`member-class-${memberClass.id}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{memberClass.name}</h3>
                    <Badge variant={memberClass.isActive ? "default" : "secondary"}>
                      {memberClass.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {memberClass.description && (
                    <p className="text-sm text-muted-foreground">
                      {memberClass.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Display Order: {memberClass.displayOrder ?? 0}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog
                    open={editingClass?.id === memberClass.id}
                    onOpenChange={(open) =>
                      setEditingClass(open ? memberClass : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-edit-member-class-${memberClass.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <MemberClassForm
                        memberClass={memberClass}
                        onSubmit={(data) =>
                          updateClassMutation.mutate({
                            id: memberClass.id,
                            data,
                          })
                        }
                        isLoading={updateClassMutation.isPending}
                      />
                    </DialogContent>
                  </Dialog>

                  <AlertDialog
                    open={deletingClassId === memberClass.id}
                    onOpenChange={(open) =>
                      setDeletingClassId(open ? memberClass.id : null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                        data-testid={`button-delete-member-class-${memberClass.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Member Class</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{memberClass.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteClassMutation.mutate(memberClass.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Member Class Form Component
function MemberClassForm({
  memberClass,
  onSubmit,
  isLoading,
}: {
  memberClass?: MemberClass;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: memberClass?.name || "",
    description: memberClass?.description || "",
    displayOrder: memberClass?.displayOrder?.toString() || "0",
    isActive: memberClass?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      displayOrder: parseInt(formData.displayOrder) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {memberClass ? "Edit Member Class" : "Add Member Class"}
        </DialogTitle>
        <DialogDescription>
          {memberClass
            ? "Update the member class information"
            : "Create a new member class to categorize your team members"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Class Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g., Officers, Active Members"
            required
            data-testid="input-member-class-name"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description of this member class"
            rows={3}
            data-testid="input-member-class-description"
          />
        </div>

        <div>
          <Label htmlFor="displayOrder">Display Order</Label>
          <Input
            id="displayOrder"
            type="number"
            value={formData.displayOrder}
            onChange={(e) =>
              setFormData({ ...formData, displayOrder: e.target.value })
            }
            placeholder="0"
            min="0"
            data-testid="input-member-class-display-order"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            data-testid="input-member-class-active"
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={isLoading || !formData.name.trim()}
          data-testid="button-submit-member-class"
        >
          {isLoading && <Loading size="sm" variant="spinner" className="mr-2" />}
          {memberClass ? "Update" : "Create"} Member Class
        </Button>
      </DialogFooter>
    </form>
  );
}

// News Form Component
function NewsForm({
  newsItem,
  onSubmit,
  isLoading,
}: {
  newsItem?: News;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    category: newsItem?.category || "",
    title: newsItem?.title || "",
    description: newsItem?.description || "",
    content: newsItem?.content || "",
    image: newsItem?.image || "",
    isPublished: newsItem?.isPublished ?? false,
    publishDate: newsItem?.publishDate ? new Date(newsItem.publishDate).toISOString().split('T')[0] : "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(newsItem?.image || "");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const { toast } = useToast();

  // Crop completion callback
  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Handle initial image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        setShowCropper(true);
        // Reset cropping state
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create cropped image
  const createCroppedImage = useCallback(
    async (imageSrc: string, pixelCrop: any) => {
      const image = new window.Image();
      image.src = imageSrc;
      
      return new Promise<string>((resolve) => {
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx || !pixelCrop) {
            resolve(imageSrc);
            return;
          }
          
          canvas.width = pixelCrop.width;
          canvas.height = pixelCrop.height;
          
          ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
          );
          
          resolve(canvas.toDataURL('image/png'));
        };
      });
    },
    []
  );

  // Apply crop
  const handleApplyCrop = async () => {
    if (!originalImage || !croppedAreaPixels) return;
    
    try {
      const croppedImage = await createCroppedImage(originalImage, croppedAreaPixels);
      setImagePreview(croppedImage);
      setFormData({ ...formData, image: croppedImage });
      setShowCropper(false);
      setOriginalImage(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process cropped image. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setShowCropper(false);
    setOriginalImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    // Clear the file input
    const input = document.getElementById('news-image-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      publishDate: formData.publishDate ? new Date(formData.publishDate) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {newsItem ? "Edit News Article" : "Add News Article"}
        </DialogTitle>
        <DialogDescription>
          {newsItem
            ? "Update the news article information"
            : "Create a new news article to share updates"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="News article title"
              required
              data-testid="input-news-title"
            />
          </div>
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger data-testid="select-news-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
                <SelectItem value="Community">Community</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Announcements">Announcements</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description of the news article"
            required
            rows={3}
            data-testid="input-news-description"
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Full article content"
            rows={8}
            data-testid="input-news-content"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="news-image-upload">Article Image *</Label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-white/20">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <Input
                id="news-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
                data-testid="input-news-image-upload"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload an image and crop it to your desired size
              </p>
            </div>
          </div>
        </div>

        {showCropper && originalImage && (
          <div className="space-y-4 p-4 bg-black/20 rounded-lg border border-white/10">
            <div className="relative w-full h-64 bg-black/50 rounded-lg overflow-hidden">
              <Cropper
                image={originalImage}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    background: 'rgba(0, 0, 0, 0.5)',
                  },
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Zoom</Label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleApplyCrop}
                className="flex-1"
                data-testid="button-apply-crop-news"
              >
                Apply Crop
              </Button>
              <Button
                type="button"
                onClick={handleCancelCrop}
                variant="outline"
                className="flex-1"
                data-testid="button-cancel-crop-news"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              data-testid="input-news-published"
            />
            <Label htmlFor="isPublished">Published</Label>
          </div>
          
          {formData.isPublished && (
            <div>
              <Label htmlFor="publishDate">Publish Date</Label>
              <Input
                id="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={(e) =>
                  setFormData({ ...formData, publishDate: e.target.value })
                }
                data-testid="input-news-publish-date"
              />
            </div>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={isLoading || !formData.title.trim() || !formData.category.trim() || !formData.description.trim() || !imagePreview}
          data-testid="button-submit-news"
        >
          {isLoading && <Loading size="sm" variant="spinner" className="mr-2" />}
          {newsItem ? "Update" : "Create"} News Article
        </Button>
      </DialogFooter>
    </form>
  );
}

// Hero Images Management Component
function HeroImageManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingHeroImage, setEditingHeroImage] = useState<HeroImage | null>(null);
  const [deletingHeroImageId, setDeletingHeroImageId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch hero images
  const { data: heroImages, isLoading, isError, refetch } = useQuery<HeroImage[]>({
    queryKey: ["/api/admin/hero-images"],
  });

  // Sort hero images by display order
  const sortedHeroImages = heroImages ? [...heroImages].sort((a, b) => {
    const orderA = a.displayOrder || 0;
    const orderB = b.displayOrder || 0;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  }) : [];

  // Add hero image mutation
  const addHeroImageMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/hero-images", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-images"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Hero image added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add hero image. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update hero image mutation
  const updateHeroImageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest("PUT", `/api/admin/hero-images/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-images"] });
      setEditingHeroImage(null);
      toast({
        title: "Success",
        description: "Hero image updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update hero image. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete hero image mutation
  const deleteHeroImageMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/hero-images/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-images"] });
      setDeletingHeroImageId(null);
      toast({
        title: "Success",
        description: "Hero image deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete hero image. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loading size="lg" variant="spinner" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
        <CardContent className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">Failed to load hero images</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Hero Images Management
            </CardTitle>
            <CardDescription>
              Manage carousel images and captions for the homepage
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-hero-image">
                <Plus className="h-4 w-4 mr-2" />
                Add Hero Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <HeroImageForm
                onSubmit={(data) => addHeroImageMutation.mutate(data)}
                isLoading={addHeroImageMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sortedHeroImages.length === 0 ? (
          <div className="text-center py-8">
            <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Hero Images</h3>
            <p className="text-muted-foreground mb-4">
              Add your first hero image to showcase on the homepage
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedHeroImages.map((heroImage) => (
              <div
                key={heroImage.id}
                className="group relative bg-white/50 dark:bg-slate-800/50 rounded-lg border border-white/20 p-4 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300"
                data-testid={`hero-image-${heroImage.id}`}
              >
                <div className="relative mb-4">
                  <img
                    src={heroImage.imageUrl}
                    alt={heroImage.altText}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <Badge variant={heroImage.isActive ? "default" : "secondary"} className="text-xs">
                      {heroImage.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold truncate" data-testid={`text-hero-title-${heroImage.id}`}>
                    {heroImage.title}
                  </h3>
                  {heroImage.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-hero-description-${heroImage.id}`}>
                      {heroImage.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Display Order: {heroImage.displayOrder ?? 0}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Dialog
                    open={editingHeroImage?.id === heroImage.id}
                    onOpenChange={(open) =>
                      setEditingHeroImage(open ? heroImage : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-edit-hero-image-${heroImage.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <HeroImageForm
                        heroImage={heroImage}
                        onSubmit={(data) =>
                          updateHeroImageMutation.mutate({
                            id: heroImage.id,
                            data,
                          })
                        }
                        isLoading={updateHeroImageMutation.isPending}
                      />
                    </DialogContent>
                  </Dialog>

                  <AlertDialog
                    open={deletingHeroImageId === heroImage.id}
                    onOpenChange={(open) =>
                      setDeletingHeroImageId(open ? heroImage.id : null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                        data-testid={`button-delete-hero-image-${heroImage.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Hero Image</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{heroImage.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteHeroImageMutation.mutate(heroImage.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
// Hero Image Form Component
function HeroImageForm({
  heroImage,
  onSubmit,
  isLoading,
}: {
  heroImage?: HeroImage;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    imageUrl: heroImage?.imageUrl || "",
    displayOrder: heroImage?.displayOrder?.toString() || "0",
    isActive: heroImage?.isActive ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(heroImage?.thumbnail || heroImage?.imageUrl || "");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const { toast } = useToast();

  // Crop completion callback
  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Handle initial image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        setShowCropper(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create cropped image
  const createCroppedImage = useCallback(
    async (imageSrc: string, pixelCrop: any) => {
      const image = new window.Image();
      image.src = imageSrc;
      
      return new Promise<string>((resolve) => {
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx || !pixelCrop) {
            resolve(imageSrc);
            return;
          }
          
          canvas.width = pixelCrop.width;
          canvas.height = pixelCrop.height;
          
          ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
          );
          
          resolve(canvas.toDataURL('image/png'));
        };
      });
    },
    []
  );

  // Apply crop
  const handleApplyCrop = async () => {
    if (!originalImage || !croppedAreaPixels) return;
    
    try {
      const croppedImage = await createCroppedImage(originalImage, croppedAreaPixels);
      setImagePreview(croppedImage);
      setFormData({ ...formData, imageUrl: croppedImage });
      setShowCropper(false);
      setOriginalImage(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process cropped image. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setShowCropper(false);
    setOriginalImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    const input = document.getElementById('hero-image-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      title: "Hero Image",
      altText: "ISB Medical Society hero image",
      description: "",
      displayOrder: parseInt(formData.displayOrder) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {heroImage ? "Edit Hero Image" : "Add Hero Image"}
        </DialogTitle>
        <DialogDescription>
          {heroImage
            ? "Update the hero image information"
            : "Add a new hero image to the carousel"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hero-image-upload">Hero Image *</Label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden border-2 border-white/20">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <Input
                id="hero-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
                data-testid="input-hero-image-upload"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload an image and crop it to your desired size (16:9 recommended for hero images)
              </p>
            </div>
          </div>
        </div>

        {showCropper && originalImage && (
          <div className="space-y-4 p-4 bg-black/20 rounded-lg border border-white/10">
            <div className="relative w-full h-64 bg-black/50 rounded-lg overflow-hidden">
              <Cropper
                image={originalImage}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    background: 'rgba(0, 0, 0, 0.5)',
                  },
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Zoom</Label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleApplyCrop}
                className="flex-1"
                data-testid="button-apply-crop-hero"
              >
                Apply Crop
              </Button>
              <Button
                type="button"
                onClick={handleCancelCrop}
                variant="outline"
                className="flex-1"
                data-testid="button-cancel-crop-hero"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({ ...formData, displayOrder: e.target.value })
              }
              placeholder="0"
              min="0"
              data-testid="input-hero-display-order"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              data-testid="input-hero-active"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={isLoading || !imagePreview}
          data-testid="button-submit-hero-image"
        >
          {isLoading && <Loading size="sm" variant="spinner" className="mr-2" />}
          {heroImage ? "Update" : "Create"} Hero Image
        </Button>
      </DialogFooter>
    </form>
  );
}

// Programs/Activities Management Component
function ProgramManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deletingProgramId, setDeletingProgramId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: programs, isLoading, isError } = useQuery<Program[]>({
    queryKey: ["/api/admin/programs"],
  });

  const sortedPrograms = programs ? [...programs].sort((a, b) => {
    const orderA = a.displayOrder || 0;
    const orderB = b.displayOrder || 0;
    return orderA - orderB;
  }) : [];

  const addProgramMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/programs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Activity created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create activity",
        variant: "destructive",
      });
    },
  });

  const updateProgramMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest("PUT", `/api/admin/programs/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      setEditingProgram(null);
      toast({
        title: "Success",
        description: "Activity updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update activity",
        variant: "destructive",
      });
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/programs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      setDeletingProgramId(null);
      toast({
        title: "Success",
        description: "Activity deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive",
      });
    },
  });

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Failed to load activities</p>
        </CardContent>
      </Card>
    );
  }

  const canAddMore = (sortedPrograms?.length || 0) < 4;

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Our Activities Management
            </CardTitle>
            <CardDescription>
              Manage the 4 activities shown on the homepage (limit: 4 activities)
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={!canAddMore}
                data-testid="button-add-program"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Activity</DialogTitle>
                <DialogDescription>
                  Create a new activity to display on the homepage
                </DialogDescription>
              </DialogHeader>
              <ProgramForm
                onSubmit={(data) => addProgramMutation.mutate(data)}
                isLoading={addProgramMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {!canAddMore && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Maximum of 4 activities reached. Delete an activity to add a new one.
            </p>
          </div>
        )}

        {sortedPrograms.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Activities</h3>
            <p className="text-muted-foreground mb-4">
              Add your first activity to showcase on the homepage
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={program.thumbnail || program.image}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 left-2">
                    Order: {program.displayOrder ?? 0}
                  </Badge>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg mb-2">{program.title}</h3>
                  <p className="text-sm line-clamp-2">{program.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Dialog open={editingProgram?.id === program.id} onOpenChange={(open) => !open && setEditingProgram(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProgram(program)}
                          data-testid={`button-edit-program-${program.id}`}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Activity</DialogTitle>
                          <DialogDescription>
                            Update this activity's information
                          </DialogDescription>
                        </DialogHeader>
                        <ProgramForm
                          program={program}
                          onSubmit={(data) => updateProgramMutation.mutate({ id: program.id, data })}
                          isLoading={updateProgramMutation.isPending}
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog open={deletingProgramId === program.id} onOpenChange={(open) => !open && setDeletingProgramId(null)}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeletingProgramId(program.id)}
                          data-testid={`button-delete-program-${program.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{program.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-testid="button-cancel-delete-program">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProgramMutation.mutate(program.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            data-testid="button-confirm-delete-program"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProgramForm({ program, onSubmit, isLoading }: {
  program?: Program;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: program?.title || "",
    description: program?.description || "",
    displayOrder: program?.displayOrder?.toString() || "0",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(program?.image || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setImagePreview(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImage = async (): Promise<string> => {
    if (!originalImage || !croppedAreaPixels) return originalImage!;

    const image = await createImage(originalImage);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx?.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const createImage = (url: string): Promise<HTMLImageElement> => 
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImage = imagePreview;
    if (originalImage && croppedAreaPixels) {
      finalImage = await getCroppedImage();
      setImagePreview(finalImage);
    }

    onSubmit({
      ...formData,
      displayOrder: parseInt(formData.displayOrder) || 0,
      image: finalImage || program?.image,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="First on the scene"
          required
          data-testid="input-program-title"
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Hands-on training in basic medical procedures..."
          required
          rows={3}
          data-testid="input-program-description"
        />
      </div>

      <div>
        <Label htmlFor="image">Activity Image *</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          data-testid="input-program-image"
        />
        {originalImage && !imagePreview && (
          <div className="mt-4">
            <div className="relative h-64 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
              <Cropper
                image={originalImage}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-2">
              <Label>Zoom</Label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <Button
              type="button"
              onClick={async () => {
                const cropped = await getCroppedImage();
                setImagePreview(cropped);
                setOriginalImage(null);
              }}
              className="mt-2"
            >
              Apply Crop
            </Button>
          </div>
        )}
        {imagePreview && (
          <div className="mt-4">
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-md" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setImagePreview(null);
                setOriginalImage(null);
              }}
              className="mt-2"
            >
              Change Image
            </Button>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="displayOrder">Display Order</Label>
        <Input
          id="displayOrder"
          type="number"
          value={formData.displayOrder}
          onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
          placeholder="0"
          min="0"
          data-testid="input-program-display-order"
        />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={isLoading || !formData.title.trim() || !formData.description.trim() || (!imagePreview && !program?.image)}
          data-testid="button-submit-program"
        >
          {isLoading && <Loading size="sm" variant="spinner" className="mr-2" />}
          {program ? "Update" : "Create"} Activity
        </Button>
      </DialogFooter>
    </form>
  );
}
