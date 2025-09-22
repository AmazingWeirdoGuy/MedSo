import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Newspaper, Image, Settings, BarChart3, Eye, Plus } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import type { Member, News, HeroImage, AdminUser } from "@shared/schema";

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
        window.location.href = "/api/login";
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
                onClick={() => window.location.href = "/api/logout"}
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
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle>Member Management</CardTitle>
                <CardDescription>Add, edit, and manage society members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Member Management</h3>
                  <p className="text-muted-foreground mb-4">This feature will be implemented in the next step</p>
                  <Button data-testid="button-add-member">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Member
                  </Button>
                </div>
              </CardContent>
            </Card>
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