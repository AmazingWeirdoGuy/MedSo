import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Newspaper, Image as ImageIcon, Plus, Edit, Trash2, GraduationCap, Check, X, Save, Upload, Activity, GripVertical, AlertCircle, FileImage } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { saveToJson, uploadImage, loadJsonData } from "@/lib/devApi";
import type { Member, MemberClass, News, HeroImage, AdminUser, Program } from "@shared/schema";
import blankPfpPath from "@assets/blank-pfp.png";

// DnD Kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

// File validation helper
function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size must be less than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB` };
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: JPEG, PNG, WebP, GIF` };
  }
  return { valid: true };
}

export default function AdminPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("members");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<Record<string, boolean>>({});

  const { data: adminData, isLoading: adminLoading } = useQuery<{
    isAdmin: boolean;
    adminUser: AdminUser | null;
  }>({
    queryKey: ["/api/auth/admin"],
    enabled: isAuthenticated,
    retry: false,
  });

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

  // Unsaved changes guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.values(hasUnsavedChanges).some(v => v)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const saveEvent = new CustomEvent('admin-save', { detail: { tab: activeTab } });
        window.dispatchEvent(saveEvent);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

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
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
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
              {Object.values(hasUnsavedChanges).some(v => v) && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  Unsaved Changes
                </Badge>
              )}
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
              <ImageIcon className="h-4 w-4 mr-2" />
              Hero Images
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <MemberManagement 
              hasUnsavedChanges={hasUnsavedChanges} 
              setHasUnsavedChanges={setHasUnsavedChanges} 
            />
          </TabsContent>

          <TabsContent value="member-classes">
            <MemberClassManagement 
              hasUnsavedChanges={hasUnsavedChanges} 
              setHasUnsavedChanges={setHasUnsavedChanges} 
            />
          </TabsContent>

          <TabsContent value="programs">
            <ProgramManagement 
              hasUnsavedChanges={hasUnsavedChanges} 
              setHasUnsavedChanges={setHasUnsavedChanges} 
            />
          </TabsContent>

          <TabsContent value="news">
            <NewsManagement 
              hasUnsavedChanges={hasUnsavedChanges} 
              setHasUnsavedChanges={setHasUnsavedChanges} 
            />
          </TabsContent>

          <TabsContent value="hero">
            <HeroImageManagement 
              hasUnsavedChanges={hasUnsavedChanges} 
              setHasUnsavedChanges={setHasUnsavedChanges} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Image Upload Component with validation and progress
function ImageUploadField({
  value,
  onChange,
  category,
  label = "Image",
  required = false,
  currentImage,
}: {
  value: string;
  onChange: (url: string) => void;
  category: 'members' | 'news' | 'hero' | 'programs';
  label?: string;
  required?: boolean;
  currentImage?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(currentImage || value);
  const [error, setError] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setError(undefined);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setProgress(10);

    try {
      setProgress(50);
      const url = await uploadImage(file, category);
      setProgress(100);
      onChange(url);
      toast({
        title: "Upload Successful",
        description: "Image uploaded successfully!",
      });
    } catch (err: any) {
      setError(err.message || "Upload failed");
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-3">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-white/20"
          />
          {currentImage && value !== currentImage && (
            <Badge className="absolute -top-2 -right-2 bg-blue-500">New</Badge>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {preview ? 'Replace Image' : 'Upload Image'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_FILE_TYPES.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Max size: 5MB. Formats: JPEG, PNG, WebP, GIF
      </p>
    </div>
  );
}

// Sortable Item Component
function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      {children}
    </div>
  );
}

// Empty State Component
function EmptyState({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description: string; 
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <FileImage className="h-16 w-16 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
}

// Member Management Component
function MemberManagement({
  hasUnsavedChanges,
  setHasUnsavedChanges,
}: {
  hasUnsavedChanges: Record<string, boolean>;
  setHasUnsavedChanges: (value: Record<string, boolean>) => void;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [reorderedMembers, setReorderedMembers] = useState<Member[]>([]);
  const [hasReordered, setHasReordered] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: members, isLoading: membersLoading } = useQuery<Member[]>({
    queryKey: ["/data/members.json"],
    queryFn: async () => {
      const res = await fetch("/data/members.json");
      if (!res.ok) throw new Error("Failed to load members");
      return res.json();
    },
  });

  const { data: memberClasses } = useQuery<MemberClass[]>({
    queryKey: ["/data/memberClasses.json"],
    queryFn: async () => {
      const res = await fetch("/data/memberClasses.json");
      if (!res.ok) throw new Error("Failed to load member classes");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const currentMembers = await loadJsonData<Member>("members.json");
      const filtered = currentMembers.filter(m => m.id !== id);
      await saveToJson("members.json", filtered);
      return filtered;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/members.json"] });
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
    },
  });

  const saveOrderMutation = useMutation({
    mutationFn: async (orderedMembers: Member[]) => {
      const updatedMembers = orderedMembers.map((member, index) => ({
        ...member,
        displayOrder: index,
      }));
      await saveToJson("members.json", updatedMembers);
      return updatedMembers;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/members.json"] });
      setHasReordered(false);
      setHasUnsavedChanges({ ...hasUnsavedChanges, members: false });
      toast({
        title: "Success",
        description: "Member order saved successfully",
      });
    },
  });

  const handleDragEnd = (event: DragEndEvent, classMembers: Member[]) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = classMembers.findIndex(m => m.id === active.id);
    const newIndex = classMembers.findIndex(m => m.id === over.id);

    const newOrder = arrayMove(classMembers, oldIndex, newIndex);
    setReorderedMembers(newOrder);
    setHasReordered(true);
    setHasUnsavedChanges({ ...hasUnsavedChanges, members: true });
  };

  const getClassMembers = (className: string) => {
    if (!members || !memberClasses) return [];
    const memberClass = memberClasses.find(mc => mc.name === className);
    if (!memberClass) return [];
    
    const classMembers = members
      .filter(member => member.memberClassId === memberClass.id)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    return hasReordered && reorderedMembers.length > 0 
      ? reorderedMembers.filter(m => m.memberClassId === memberClass.id)
      : classMembers;
  };

  if (membersLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  const isEmpty = !members || members.length === 0;

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-white/20">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-slate-900 dark:text-white" style={{ fontFamily: 'Beo, serif' }}>
              Members Management
            </CardTitle>
            <CardDescription>Manage members by their roles and classifications</CardDescription>
          </div>
          <div className="flex gap-2">
            {hasReordered && (
              <Button
                onClick={() => saveOrderMutation.mutate(reorderedMembers)}
                disabled={saveOrderMutation.isPending}
                data-testid="button-save-member-order"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Order
              </Button>
            )}
            <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-member">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isEmpty ? (
          <EmptyState
            title="No Members Yet"
            description="Get started by adding your first member to the society"
            action={
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Member
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            {memberClasses?.map((memberClass) => {
              const classMembers = getClassMembers(memberClass.name);
              if (classMembers.length === 0) return null;

              return (
                <div key={memberClass.id} className="space-y-3">
                  <h3 className="text-lg font-semibold">{memberClass.name}</h3>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleDragEnd(event, classMembers)}
                  >
                    <SortableContext
                      items={classMembers.map(m => m.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {classMembers.map((member) => (
                          <SortableItem key={member.id} id={member.id}>
                            <div className="flex-1 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-white/20">
                              <div className="flex items-center gap-4">
                                <img
                                  src={member.thumbnail || member.image || blankPfpPath}
                                  alt={member.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                  <h4 className="font-medium">{member.name}</h4>
                                  {member.role && <p className="text-sm text-muted-foreground">{member.role}</p>}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingMember(member)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="text-red-600">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Member</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {member.name}? This cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteMutation.mutate(member.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </SortableItem>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <MemberDialog
        isOpen={isAddDialogOpen || !!editingMember}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingMember(null);
        }}
        member={editingMember}
        memberClasses={memberClasses || []}
      />
    </Card>
  );
}

// Member Dialog Component
function MemberDialog({
  isOpen,
  onClose,
  member,
  memberClasses,
}: {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  memberClasses: MemberClass[];
}) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    memberClassId: "",
    image: "",
    displayOrder: 0,
    isActive: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        role: member.role || "",
        memberClassId: member.memberClassId || "",
        image: member.image || "",
        displayOrder: member.displayOrder || 0,
        isActive: member.isActive ?? true,
      });
    } else {
      setFormData({
        name: "",
        role: "",
        memberClassId: "",
        image: "",
        displayOrder: 0,
        isActive: true,
      });
    }
  }, [member, isOpen]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const members = await loadJsonData<Member>("members.json");
      
      if (member) {
        const index = members.findIndex(m => m.id === member.id);
        if (index !== -1) {
          members[index] = { ...members[index], ...data, updatedAt: new Date() };
        }
      } else {
        members.push({
          ...data,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Member);
      }
      
      await saveToJson("members.json", members);
      return members;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/members.json"] });
      onClose();
      toast({
        title: "Success",
        description: member ? "Member updated successfully" : "Member added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save member",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    const selectedClass = memberClasses.find(mc => mc.id === formData.memberClassId);
    if (selectedClass?.name !== "Active Member" && !formData.role.trim()) {
      toast({
        title: "Validation Error",
        description: "Role is required for this member class",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Member" : "Add New Member"}</DialogTitle>
          <DialogDescription>
            {member ? "Update member information" : "Add a new member to the society"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUploadField
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            category="members"
            label="Profile Image"
            currentImage={member?.image || undefined}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Member Class</Label>
              <Select
                value={formData.memberClassId}
                onValueChange={(value) => setFormData({ ...formData, memberClassId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {memberClasses.map((mc) => (
                    <SelectItem key={mc.id} value={mc.id}>
                      {mc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {memberClasses.find(mc => mc.id === formData.memberClassId)?.name !== "Active Member" && (
            <div className="space-y-2">
              <Label>Role *</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Enter role"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) => setFormData({ ...formData, isActive: value === "active" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <>
                  <Loading size="sm" variant="spinner" className="mr-2" />
                  Saving...
                </>
              ) : (
                member ? "Update" : "Add Member"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Member Class Management Component
function MemberClassManagement({
  hasUnsavedChanges,
  setHasUnsavedChanges,
}: {
  hasUnsavedChanges: Record<string, boolean>;
  setHasUnsavedChanges: (value: Record<string, boolean>) => void;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<MemberClass | null>(null);
  const [reorderedClasses, setReorderedClasses] = useState<MemberClass[]>([]);
  const [hasReordered, setHasReordered] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: memberClasses, isLoading } = useQuery<MemberClass[]>({
    queryKey: ["/data/memberClasses.json"],
    queryFn: async () => {
      const res = await fetch("/data/memberClasses.json");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const saveOrderMutation = useMutation({
    mutationFn: async (orderedClasses: MemberClass[]) => {
      const updated = orderedClasses.map((mc, index) => ({ ...mc, displayOrder: index }));
      await saveToJson("memberClasses.json", updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/memberClasses.json"] });
      setHasReordered(false);
      setHasUnsavedChanges({ ...hasUnsavedChanges, memberClasses: false });
      toast({ title: "Success", description: "Order saved successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const classes = await loadJsonData<MemberClass>("memberClasses.json");
      const filtered = classes.filter(c => c.id !== id);
      await saveToJson("memberClasses.json", filtered);
      return filtered;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/memberClasses.json"] });
      toast({ title: "Success", description: "Member class deleted" });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !memberClasses) return;

    const oldIndex = memberClasses.findIndex(c => c.id === active.id);
    const newIndex = memberClasses.findIndex(c => c.id === over.id);

    const newOrder = arrayMove(memberClasses, oldIndex, newIndex);
    setReorderedClasses(newOrder);
    setHasReordered(true);
    setHasUnsavedChanges({ ...hasUnsavedChanges, memberClasses: true });
  };

  const displayClasses = hasReordered ? reorderedClasses : (memberClasses || []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-white/20">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl" style={{ fontFamily: 'Beo, serif' }}>
              Member Classes
            </CardTitle>
            <CardDescription>Manage member classifications and categories</CardDescription>
          </div>
          <div className="flex gap-2">
            {hasReordered && (
              <Button
                onClick={() => saveOrderMutation.mutate(reorderedClasses)}
                disabled={saveOrderMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Order
              </Button>
            )}
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {displayClasses.length === 0 ? (
          <EmptyState
            title="No Member Classes"
            description="Create your first member class to organize members"
            action={
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Class
              </Button>
            }
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayClasses.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {displayClasses.map((memberClass) => (
                  <SortableItem key={memberClass.id} id={memberClass.id}>
                    <div className="flex-1 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-white/20">
                      <div>
                        <h4 className="font-medium">{memberClass.name}</h4>
                        {memberClass.description && (
                          <p className="text-sm text-muted-foreground">{memberClass.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingClass(memberClass)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Member Class</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure? This will remove the class from all members.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(memberClass.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>

      <MemberClassDialog
        isOpen={isAddDialogOpen || !!editingClass}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingClass(null);
        }}
        memberClass={editingClass}
      />
    </Card>
  );
}

// Member Class Dialog
function MemberClassDialog({
  isOpen,
  onClose,
  memberClass,
}: {
  isOpen: boolean;
  onClose: () => void;
  memberClass: MemberClass | null;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    displayOrder: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (memberClass) {
      setFormData({
        name: memberClass.name || "",
        description: memberClass.description || "",
        displayOrder: memberClass.displayOrder || 0,
      });
    } else {
      setFormData({ name: "", description: "", displayOrder: 0 });
    }
  }, [memberClass, isOpen]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const classes = await loadJsonData<MemberClass>("memberClasses.json");
      
      if (memberClass) {
        const index = classes.findIndex(c => c.id === memberClass.id);
        if (index !== -1) {
          classes[index] = { ...classes[index], ...data };
        }
      } else {
        classes.push({ ...data, id: generateId() } as MemberClass);
      }
      
      await saveToJson("memberClasses.json", classes);
      return classes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/memberClasses.json"] });
      onClose();
      toast({
        title: "Success",
        description: memberClass ? "Class updated" : "Class added",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{memberClass ? "Edit Class" : "Add Class"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!formData.name.trim()) {
              toast({
                title: "Validation Error",
                description: "Name is required",
                variant: "destructive",
              });
              return;
            }
            saveMutation.mutate(formData);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Display Order</Label>
            <Input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : memberClass ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Program Management Component  
function ProgramManagement({
  hasUnsavedChanges,
  setHasUnsavedChanges,
}: {
  hasUnsavedChanges: Record<string, boolean>;
  setHasUnsavedChanges: (value: Record<string, boolean>) => void;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [reorderedPrograms, setReorderedPrograms] = useState<Program[]>([]);
  const [hasReordered, setHasReordered] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: programs, isLoading } = useQuery<Program[]>({
    queryKey: ["/data/programs.json"],
    queryFn: async () => {
      const res = await fetch("/data/programs.json");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const saveOrderMutation = useMutation({
    mutationFn: async (orderedPrograms: Program[]) => {
      const updated = orderedPrograms.map((p, index) => ({ ...p, displayOrder: index }));
      await saveToJson("programs.json", updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/programs.json"] });
      setHasReordered(false);
      setHasUnsavedChanges({ ...hasUnsavedChanges, programs: false });
      toast({ title: "Success", description: "Order saved" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const progs = await loadJsonData<Program>("programs.json");
      const filtered = progs.filter(p => p.id !== id);
      await saveToJson("programs.json", filtered);
      return filtered;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/programs.json"] });
      toast({ title: "Success", description: "Program deleted" });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !programs) return;

    const oldIndex = programs.findIndex(p => p.id === active.id);
    const newIndex = programs.findIndex(p => p.id === over.id);

    const newOrder = arrayMove(programs, oldIndex, newIndex);
    setReorderedPrograms(newOrder);
    setHasReordered(true);
    setHasUnsavedChanges({ ...hasUnsavedChanges, programs: true });
  };

  const displayPrograms = hasReordered ? reorderedPrograms : (programs || []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  const canAdd = !programs || programs.length < 4;

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-white/20">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl" style={{ fontFamily: 'Beo, serif' }}>
              Activities Management
            </CardTitle>
            <CardDescription>Manage programs and activities (Max: 4)</CardDescription>
          </div>
          <div className="flex gap-2">
            {hasReordered && (
              <Button
                onClick={() => saveOrderMutation.mutate(reorderedPrograms)}
                disabled={saveOrderMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Order
              </Button>
            )}
            <Button 
              onClick={() => {
                if (!canAdd) {
                  toast({
                    title: "Limit Reached",
                    description: "Maximum of 4 programs allowed. Please delete one to add a new program.",
                    variant: "destructive",
                  });
                  return;
                }
                setIsAddDialogOpen(true);
              }}
              disabled={!canAdd}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Program {programs && `(${programs.length}/4)`}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {displayPrograms.length === 0 ? (
          <EmptyState
            title="No Programs Yet"
            description="Add your first activity or program"
            action={
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Program
              </Button>
            }
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayPrograms.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {displayPrograms.map((program) => (
                  <SortableItem key={program.id} id={program.id}>
                    <div className="flex-1 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-white/20">
                      <div className="flex items-center gap-4">
                        {program.image && (
                          <img
                            src={program.image}
                            alt={program.title}
                            className="w-16 h-16 rounded object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{program.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">{program.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProgram(program)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Program</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {program.title}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(program.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>

      <ProgramDialog
        isOpen={isAddDialogOpen || !!editingProgram}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingProgram(null);
        }}
        program={editingProgram}
      />
    </Card>
  );
}

// Program Dialog
function ProgramDialog({
  isOpen,
  onClose,
  program,
}: {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
}) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    displayOrder: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title || "",
        subtitle: program.subtitle || "",
        description: program.description || "",
        image: program.image || "",
        displayOrder: program.displayOrder || 0,
      });
    } else {
      setFormData({ title: "", subtitle: "", description: "", image: "", displayOrder: 0 });
    }
  }, [program, isOpen]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const programs = await loadJsonData<Program>("programs.json");
      
      if (!program && programs.length >= 4) {
        throw new Error("Maximum of 4 programs allowed");
      }
      
      if (program) {
        const index = programs.findIndex(p => p.id === program.id);
        if (index !== -1) {
          programs[index] = { ...programs[index], ...data };
        }
      } else {
        programs.push({ ...data, id: generateId() } as Program);
      }
      
      await saveToJson("programs.json", programs);
      return programs;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/programs.json"] });
      onClose();
      toast({
        title: "Success",
        description: program ? "Program updated" : "Program added",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save program",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{program ? "Edit Program" : "Add Program"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!formData.title.trim()) {
              toast({
                title: "Validation Error",
                description: "Title is required",
                variant: "destructive",
              });
              return;
            }
            saveMutation.mutate(formData);
          }}
          className="space-y-4"
        >
          <ImageUploadField
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            category="programs"
            label="Program Image"
            currentImage={program?.image}
          />

          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle *</Label>
            <Input
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Brief tagline"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Display Order</Label>
            <Input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : program ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// News Management Component
function NewsManagement({
  hasUnsavedChanges,
  setHasUnsavedChanges,
}: {
  hasUnsavedChanges: Record<string, boolean>;
  setHasUnsavedChanges: (value: Record<string, boolean>) => void;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [reorderedNews, setReorderedNews] = useState<News[]>([]);
  const [hasReordered, setHasReordered] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ["/data/news.json"],
    queryFn: async () => {
      const res = await fetch("/data/news.json");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const saveOrderMutation = useMutation({
    mutationFn: async (orderedNews: News[]) => {
      await saveToJson("news.json", orderedNews);
      return orderedNews;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/news.json"] });
      setHasReordered(false);
      setHasUnsavedChanges({ ...hasUnsavedChanges, news: false });
      toast({ title: "Success", description: "Order saved" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const newsItems = await loadJsonData<News>("news.json");
      const filtered = newsItems.filter(n => n.id !== id);
      await saveToJson("news.json", filtered);
      return filtered;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/news.json"] });
      toast({ title: "Success", description: "News deleted" });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !news) return;

    const oldIndex = news.findIndex(n => n.id === active.id);
    const newIndex = news.findIndex(n => n.id === over.id);

    const newOrder = arrayMove(news, oldIndex, newIndex);
    setReorderedNews(newOrder);
    setHasReordered(true);
    setHasUnsavedChanges({ ...hasUnsavedChanges, news: true });
  };

  const displayNews = hasReordered ? reorderedNews : (news || []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-white/20">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl" style={{ fontFamily: 'Beo, serif' }}>
              News Management
            </CardTitle>
            <CardDescription>Manage news articles and updates</CardDescription>
          </div>
          <div className="flex gap-2">
            {hasReordered && (
              <Button
                onClick={() => saveOrderMutation.mutate(reorderedNews)}
                disabled={saveOrderMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Order
              </Button>
            )}
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add News
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {displayNews.length === 0 ? (
          <EmptyState
            title="No News Articles"
            description="Create your first news article"
            action={
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First News
              </Button>
            }
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayNews.map(n => n.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {displayNews.map((newsItem) => (
                  <SortableItem key={newsItem.id} id={newsItem.id}>
                    <div className="flex-1 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-white/20">
                      <div className="flex items-center gap-4">
                        {newsItem.image && (
                          <img
                            src={newsItem.image}
                            alt={newsItem.title}
                            className="w-16 h-16 rounded object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{newsItem.title}</h4>
                          <p className="text-sm text-muted-foreground">{newsItem.category}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNews(newsItem)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete News</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {newsItem.title}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(newsItem.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>

      <NewsDialog
        isOpen={isAddDialogOpen || !!editingNews}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingNews(null);
        }}
        news={editingNews}
      />
    </Card>
  );
}

// News Dialog
function NewsDialog({
  isOpen,
  onClose,
  news,
}: {
  isOpen: boolean;
  onClose: () => void;
  news: News | null;
}) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    content: "",
    image: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        category: news.category || "",
        description: news.description || "",
        content: news.content || "",
        image: news.image || "",
      });
    } else {
      setFormData({
        title: "",
        category: "",
        description: "",
        content: "",
        image: "",
      });
    }
  }, [news, isOpen]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const newsItems = await loadJsonData<News>("news.json");
      
      if (news) {
        const index = newsItems.findIndex(n => n.id === news.id);
        if (index !== -1) {
          newsItems[index] = { ...newsItems[index], ...data };
        }
      } else {
        newsItems.push({ ...data, id: generateId() } as News);
      }
      
      await saveToJson("news.json", newsItems);
      return newsItems;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/news.json"] });
      onClose();
      toast({
        title: "Success",
        description: news ? "News updated" : "News added",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{news ? "Edit News" : "Add News"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!formData.title.trim()) {
              toast({
                title: "Validation Error",
                description: "Title is required",
                variant: "destructive",
              });
              return;
            }
            saveMutation.mutate(formData);
          }}
          className="space-y-4"
        >
          <ImageUploadField
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            category="news"
            label="News Image"
            currentImage={news?.image}
          />

          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Events, Announcements"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full article content (optional)"
              className="min-h-[200px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : news ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Hero Image Management Component
function HeroImageManagement({
  hasUnsavedChanges,
  setHasUnsavedChanges,
}: {
  hasUnsavedChanges: Record<string, boolean>;
  setHasUnsavedChanges: (value: Record<string, boolean>) => void;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroImage | null>(null);
  const [reorderedHeroes, setReorderedHeroes] = useState<HeroImage[]>([]);
  const [hasReordered, setHasReordered] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: heroImages, isLoading } = useQuery<HeroImage[]>({
    queryKey: ["/data/heroImages.json"],
    queryFn: async () => {
      const res = await fetch("/data/heroImages.json");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const saveOrderMutation = useMutation({
    mutationFn: async (orderedHeroes: HeroImage[]) => {
      const updated = orderedHeroes.map((h, index) => ({ ...h, displayOrder: index }));
      await saveToJson("heroImages.json", updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/heroImages.json"] });
      setHasReordered(false);
      setHasUnsavedChanges({ ...hasUnsavedChanges, hero: false });
      toast({ title: "Success", description: "Order saved" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const heroes = await loadJsonData<HeroImage>("heroImages.json");
      const filtered = heroes.filter(h => h.id !== id);
      await saveToJson("heroImages.json", filtered);
      return filtered;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/heroImages.json"] });
      toast({ title: "Success", description: "Hero image deleted" });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !heroImages) return;

    const oldIndex = heroImages.findIndex(h => h.id === active.id);
    const newIndex = heroImages.findIndex(h => h.id === over.id);

    const newOrder = arrayMove(heroImages, oldIndex, newIndex);
    setReorderedHeroes(newOrder);
    setHasReordered(true);
    setHasUnsavedChanges({ ...hasUnsavedChanges, hero: true });
  };

  const displayHeroes = hasReordered ? reorderedHeroes : (heroImages || []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-white/20">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl" style={{ fontFamily: 'Beo, serif' }}>
              Hero Images
            </CardTitle>
            <CardDescription>Manage homepage hero images and carousel</CardDescription>
          </div>
          <div className="flex gap-2">
            {hasReordered && (
              <Button
                onClick={() => saveOrderMutation.mutate(reorderedHeroes)}
                disabled={saveOrderMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Order
              </Button>
            )}
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Hero Image
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {displayHeroes.length === 0 ? (
          <EmptyState
            title="No Hero Images"
            description="Add your first hero image for the homepage carousel"
            action={
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Hero Image
              </Button>
            }
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayHeroes.map(h => h.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {displayHeroes.map((hero) => (
                  <SortableItem key={hero.id} id={hero.id}>
                    <div className="flex-1 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-white/20">
                      <div className="flex items-center gap-4">
                        <img
                          src={hero.imageUrl}
                          alt={hero.altText || hero.title || "Hero"}
                          className="w-24 h-16 rounded object-cover"
                        />
                        <div>
                          <h4 className="font-medium">{hero.title || "Untitled"}</h4>
                          {hero.description && (
                            <p className="text-sm text-muted-foreground">{hero.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingHero(hero)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Hero Image</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this hero image?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(hero.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>

      <HeroImageDialog
        isOpen={isAddDialogOpen || !!editingHero}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingHero(null);
        }}
        heroImage={editingHero}
      />
    </Card>
  );
}

// Hero Image Dialog
function HeroImageDialog({
  isOpen,
  onClose,
  heroImage,
}: {
  isOpen: boolean;
  onClose: () => void;
  heroImage: HeroImage | null;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    altText: "",
    displayOrder: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (heroImage) {
      setFormData({
        title: heroImage.title || "",
        description: heroImage.description || "",
        imageUrl: heroImage.imageUrl || "",
        altText: heroImage.altText || "",
        displayOrder: heroImage.displayOrder || 0,
      });
    } else {
      setFormData({ title: "", description: "", imageUrl: "", altText: "", displayOrder: 0 });
    }
  }, [heroImage, isOpen]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const heroes = await loadJsonData<HeroImage>("heroImages.json");
      
      if (heroImage) {
        const index = heroes.findIndex(h => h.id === heroImage.id);
        if (index !== -1) {
          heroes[index] = { ...heroes[index], ...data };
        }
      } else {
        heroes.push({ ...data, id: generateId() } as HeroImage);
      }
      
      await saveToJson("heroImages.json", heroes);
      return heroes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/data/heroImages.json"] });
      onClose();
      toast({
        title: "Success",
        description: heroImage ? "Hero image updated" : "Hero image added",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{heroImage ? "Edit Hero Image" : "Add Hero Image"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!formData.imageUrl.trim()) {
              toast({
                title: "Validation Error",
                description: "Image is required",
                variant: "destructive",
              });
              return;
            }
            if (!formData.altText.trim()) {
              toast({
                title: "Validation Error",
                description: "Alt text is required for accessibility",
                variant: "destructive",
              });
              return;
            }
            saveMutation.mutate(formData);
          }}
          className="space-y-4"
        >
          <ImageUploadField
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            category="hero"
            label="Hero Image"
            required
            currentImage={heroImage?.imageUrl}
          />

          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Image title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
            />
          </div>

          <div className="space-y-2">
            <Label>Alt Text *</Label>
            <Input
              value={formData.altText}
              onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
              placeholder="Describe image for accessibility"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Display Order</Label>
            <Input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : heroImage ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
