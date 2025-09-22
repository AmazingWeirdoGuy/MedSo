import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Newspaper, Image, Settings, BarChart3, Eye, Plus, Edit, Trash2, Mail, ExternalLink, GraduationCap } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMemberSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import type { Member, News, HeroImage, AdminUser, InsertMember } from "@shared/schema";

// Member form schema with extended validation
const memberFormSchema = insertMemberSchema.extend({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  role: z.string().min(1, "Role is required").max(50, "Role must be less than 50 characters"), 
  bio: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  linkedIn: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  year: z.string().optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  displayOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

type MemberFormData = z.infer<typeof memberFormSchema>;

function MemberManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch members
  const { data: members, isLoading, isError, refetch } = useQuery<Member[]>({
    queryKey: ["/api/admin/members"],
  });

  // Sort members by display order
  const sortedMembers = members ? [...members].sort((a, b) => {
    const orderA = a.displayOrder || 0;
    const orderB = b.displayOrder || 0;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  }) : [];

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: async (data: MemberFormData) => {
      return apiRequest("POST", "/api/admin/members", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      setIsAddDialogOpen(false);
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

  // Update member mutation
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MemberFormData> }) => {
      return apiRequest("PUT", `/api/admin/members/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      setEditingMember(null);
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

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeletingMemberId(id);
      return apiRequest("DELETE", `/api/admin/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      setDeletingMemberId(null);
      toast({
        title: "Success",
        description: "Member deleted successfully!",
      });
    },
    onError: () => {
      setDeletingMemberId(null);
      toast({
        title: "Error",
        description: "Failed to delete member. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
        <CardContent className="flex items-center justify-center py-12">
          <Loading size="lg" variant="spinner" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <div className="text-red-500 dark:text-red-400">
              <Users className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to Load Members</h3>
              <p className="text-muted-foreground">There was an error loading the member list. Please try again.</p>
            </div>
            <Button onClick={() => refetch()} data-testid="button-retry-members">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Member Management</CardTitle>
            <CardDescription>Add, edit, and manage society members</CardDescription>
          </div>
          <AddMemberDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={(data) => addMemberMutation.mutate(data)}
            isLoading={addMemberMutation.isPending}
          />
        </div>
      </CardHeader>
      <CardContent>
        {sortedMembers && sortedMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onEdit={(member) => setEditingMember(member)}
                onDelete={(id) => deleteMemberMutation.mutate(id)}
                isDeleting={deletingMemberId === member.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Members Yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first society member</p>
            <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-member">
              <Plus className="h-4 w-4 mr-2" />
              Add First Member
            </Button>
          </div>
        )}

        {/* Edit Member Dialog */}
        {editingMember && (
          <EditMemberDialog
            member={editingMember}
            isOpen={!!editingMember}
            onOpenChange={(open) => !open && setEditingMember(null)}
            onSubmit={(data) => updateMemberMutation.mutate({ id: editingMember.id, data })}
            isLoading={updateMemberMutation.isPending}
          />
        )}
      </CardContent>
    </Card>
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
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            data-testid={`link-member-email-${member.id}`}
          >
            <Mail className="h-3 w-3" />
            Email
          </a>
        )}
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
  onSubmit: (data: MemberFormData) => void;
  isLoading: boolean;
}) {
  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      email: "",
      linkedIn: "",
      year: "",
      image: "",
      displayOrder: 0,
      isActive: true,
    },
  });

  const handleSubmit = (data: MemberFormData) => {
    onSubmit(data);
    form.reset();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter member name" {...field} data-testid="input-member-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., President, Vice President" {...field} data-testid="input-member-role" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the member's background and interests"
                      className="min-h-[100px]"
                      {...field} 
                      data-testid="input-member-bio"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="member@isbmedicalsociety.org" {...field} data-testid="input-member-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade/Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Grade 12, Senior" {...field} data-testid="input-member-year" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} data-testid="input-member-image" />
                    </FormControl>
                    <FormDescription>URL to the member's profile photo</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} data-testid="input-member-linkedin" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-member-display-order" 
                      />
                    </FormControl>
                    <FormDescription>Lower numbers appear first</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Member</FormLabel>
                      <FormDescription>
                        Show this member on the public website
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        data-testid="switch-member-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
        </Form>
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
  onSubmit: (data: Partial<MemberFormData>) => void;
  isLoading: boolean;
}) {
  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      email: member.email || "",
      linkedIn: member.linkedIn || "",
      year: member.year || "",
      image: member.image || "",
      displayOrder: member.displayOrder || 0,
      isActive: member.isActive,
    },
  });

  const handleSubmit = (data: MemberFormData) => {
    onSubmit(data);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter member name" {...field} data-testid="input-edit-member-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., President, Vice President" {...field} data-testid="input-edit-member-role" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the member's background and interests"
                      className="min-h-[100px]"
                      {...field} 
                      data-testid="input-edit-member-bio"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="member@isbmedicalsociety.org" {...field} data-testid="input-edit-member-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade/Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Grade 12, Senior" {...field} data-testid="input-edit-member-year" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} data-testid="input-edit-member-image" />
                    </FormControl>
                    <FormDescription>URL to the member's profile photo</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} data-testid="input-edit-member-linkedin" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-edit-member-display-order" 
                      />
                    </FormControl>
                    <FormDescription>Lower numbers appear first</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Member</FormLabel>
                      <FormDescription>
                        Show this member on the public website
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        data-testid="switch-edit-member-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}

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

  // Fetch dashboard stats
  const { data: members } = useQuery<Member[]>({
    queryKey: ["/api/admin/members"],
    enabled: adminData?.isAdmin,
  });

  const { data: news } = useQuery<News[]>({
    queryKey: ["/api/news"],
    enabled: adminData?.isAdmin,
  });

  const { data: heroImages } = useQuery<HeroImage[]>({
    queryKey: ["/api/admin/hero-images"],
    enabled: adminData?.isAdmin,
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

  const stats = [
    {
      title: "Total Members",
      value: members?.length || 0,
      icon: Users,
      description: "Active society members",
      trend: "+2 this month"
    },
    {
      title: "News Articles",
      value: news?.length || 0,
      icon: Newspaper,
      description: "Published and draft articles",
      trend: "+1 this week"
    },
    {
      title: "Hero Images",
      value: heroImages?.length || 0,
      icon: Image,
      description: "Carousel images",
      trend: "3 active"
    },
    {
      title: "Page Views",
      value: "2,847",
      icon: Eye,
      description: "This month",
      trend: "+12% from last month"
    }
  ];

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
                {adminData?.adminUser?.role || 'Admin'}
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1" style={{ fontFamily: 'Beo, serif' }}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {stat.description}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList 
            className="grid w-full grid-cols-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <TabsTrigger value="overview" data-testid="tab-overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" data-testid="tab-members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="news" data-testid="tab-news">
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="hero" data-testid="tab-hero">
              <Image className="h-4 w-4 mr-2" />
              Hero Images
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest changes to your website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New member added</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Newspaper className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">News article published</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Image className="h-4 w-4 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Hero image updated</p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className="h-20 flex flex-col gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      variant="outline"
                      data-testid="quick-add-member"
                    >
                      <Plus className="h-5 w-5" />
                      Add Member
                    </Button>
                    <Button 
                      className="h-20 flex flex-col gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                      variant="outline"
                      data-testid="quick-add-news"
                    >
                      <Plus className="h-5 w-5" />
                      Add News
                    </Button>
                    <Button 
                      className="h-20 flex flex-col gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      variant="outline"
                      data-testid="quick-add-hero"
                    >
                      <Plus className="h-5 w-5" />
                      Add Hero Image
                    </Button>
                    <Button 
                      className="h-20 flex flex-col gap-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                      variant="outline"
                      onClick={() => window.open("/", "_blank")}
                      data-testid="quick-view-site"
                    >
                      <Eye className="h-5 w-5" />
                      View Site
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <MemberManagement />
          </TabsContent>

          <TabsContent value="news">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle>News Management</CardTitle>
                <CardDescription>Create, edit, and publish news articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">News Management</h3>
                  <p className="text-muted-foreground mb-4">This feature will be implemented in the next step</p>
                  <Button data-testid="button-add-news">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle>Hero Image Management</CardTitle>
                <CardDescription>Manage carousel images and captions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Hero Image Management</h3>
                  <p className="text-muted-foreground mb-4">This feature will be implemented in the next step</p>
                  <Button data-testid="button-add-hero-image">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Hero Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Manage admin users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Your Admin Profile</h4>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {user?.profileImageUrl && (
                          <img 
                            src={user.profileImageUrl} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                          <Badge variant="secondary" className="mt-1">
                            {adminData?.adminUser?.role || 'Admin'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Permissions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm">Manage Members</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm">Manage News</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm">Manage Hero Images</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}