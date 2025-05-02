import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Loader2, UserIcon, Search, Mail, Trash2, FileText, Download, ChevronLeft, BookOpen } from "lucide-react";
import BlogManagement from "@/components/admin/BlogManagement";

// Utility function to convert data to CSV
function convertToCSV<T extends Record<string, any>>(data: T[], headers: Record<string, string>): string {
  // Create header row
  const headerRow = Object.values(headers).join(',');
  
  // Create data rows
  const rows = data.map(item => 
    Object.keys(headers)
      .map(key => {
        // Handle values that might contain commas or quotes
        const value = item[key] === null || item[key] === undefined ? '' : String(item[key]);
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(',')
  );
  
  // Combine header row and data rows
  return [headerRow, ...rows].join('\n');
}

// Function to download CSV
function downloadCSV(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create download URL
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', fileName);
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
import { Redirect, Link } from "wouter";

interface LeadContact {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  subscription_plan: string;
  personas_used: number;
  tone_analyses_used: number;
  content_generated: number;
  created_at: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<LeadContact | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeadDetailsOpen, setIsLeadDetailsOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Only admins can access this page
  if (!user || user.role !== "admin") {
    return <Redirect to="/" />;
  }

  // Fetch leads
  const {
    data: leads = [],
    isLoading: isLeadsLoading,
    error: leadsError,
  } = useQuery({
    queryKey: ["/api/admin/lead-contacts"],
    staleTime: 1000 * 60, // 1 minute
  });

  // Fetch users
  const {
    data: users = [],
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["/api/admin/users"],
    staleTime: 1000 * 60,
  });

  // Update lead status mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const res = await fetch(`/api/admin/lead-contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      
      if (!res.ok) throw new Error("Failed to update lead");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/lead-contacts"] });
      toast({
        title: "Lead updated",
        description: "The lead contact has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete lead mutation
  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/lead-contacts/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete lead");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/lead-contacts"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Lead deleted",
        description: "The lead contact has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      
      if (!res.ok) throw new Error("Failed to update user role");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User role updated",
        description: "The user role has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update user subscription plan mutation
  const updateUserSubscriptionMutation = useMutation({
    mutationFn: async ({ id, subscription_plan }: { id: number; subscription_plan: string }) => {
      const res = await fetch(`/api/admin/users/${id}/subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription_plan }),
      });
      
      if (!res.ok) throw new Error("Failed to update subscription plan");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Subscription plan updated",
        description: "The user's subscription plan has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter leads based on search query
  const filteredLeads = leads.filter((lead: LeadContact) => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter users based on search query
  const filteredUsers = users.filter((user: User) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (status: string) => {
    if (selectedLead) {
      updateLeadMutation.mutate({ id: selectedLead.id, status });
    }
  };

  const handleDeleteLead = () => {
    if (selectedLead) {
      deleteLeadMutation.mutate(selectedLead.id);
    }
  };

  const handleUserRoleChange = (role: string) => {
    if (selectedUser) {
      updateUserRoleMutation.mutate({ id: selectedUser.id, role });
    }
  };

  const LeadDetails = () => (
    <Sheet open={isLeadDetailsOpen} onOpenChange={setIsLeadDetailsOpen}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-zinc-950 border-zinc-800">
        <SheetHeader className="border-b border-zinc-800 pb-4">
          <SheetTitle className="text-white">Lead Details</SheetTitle>
          <SheetDescription>View and update lead contact information</SheetDescription>
        </SheetHeader>
        
        {selectedLead && (
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-zinc-400">Name</Label>
                  <div className="text-white font-medium mt-1">{selectedLead.name}</div>
                </div>
                <div>
                  <Label className="text-zinc-400">Email</Label>
                  <div className="text-white font-medium mt-1">{selectedLead.email}</div>
                </div>
              </div>
            </div>
            
            {selectedLead.company && (
              <div className="space-y-2">
                <Label className="text-zinc-400">Company</Label>
                <div className="text-white font-medium">{selectedLead.company}</div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-zinc-400">Message</Label>
              <div className="text-white bg-zinc-900 p-3 rounded-md border border-zinc-800">
                {selectedLead.message}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-400">Status</Label>
              <Select defaultValue={selectedLead.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-400">Notes</Label>
              <Input
                className="bg-zinc-900 border-zinc-800 text-white"
                placeholder="Add notes..."
                defaultValue={selectedLead.notes || ""}
                onChange={(e) => {
                  if (selectedLead) {
                    updateLeadMutation.mutate({
                      id: selectedLead.id,
                      status: selectedLead.status,
                      notes: e.target.value,
                    });
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-400">Created at</Label>
              <div className="text-zinc-400 text-sm">
                {format(new Date(selectedLead.created_at), "PPp")}
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Lead
              </Button>
              <SheetClose asChild>
                <Button>Done</Button>
              </SheetClose>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );

  const UserDetails = () => (
    <Sheet open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-zinc-950 border-zinc-800">
        <SheetHeader className="border-b border-zinc-800 pb-4">
          <SheetTitle className="text-white">User Details</SheetTitle>
          <SheetDescription>View and update user information</SheetDescription>
        </SheetHeader>
        
        {selectedUser && (
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-zinc-400">Username</Label>
                  <div className="text-white font-medium mt-1">{selectedUser.username}</div>
                </div>
                <div>
                  <Label className="text-zinc-400">Email</Label>
                  <div className="text-white font-medium mt-1">{selectedUser.email}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-400">Role</Label>
              <Select defaultValue={selectedUser.role} onValueChange={handleUserRoleChange}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-400">Subscription Plan</Label>
              <Select defaultValue={selectedUser.subscription_plan} onValueChange={(plan) => {
                if (selectedUser) {
                  updateUserSubscriptionMutation.mutate({ 
                    id: selectedUser.id, 
                    subscription_plan: plan 
                  });
                }
              }}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-400">Usage</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-md p-3 text-center">
                  <div className="text-zinc-400 text-xs mb-1">Personas</div>
                  <div className="text-white font-medium">{selectedUser.personas_used}</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-md p-3 text-center">
                  <div className="text-zinc-400 text-xs mb-1">Tone Analyses</div>
                  <div className="text-white font-medium">{selectedUser.tone_analyses_used}</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-md p-3 text-center">
                  <div className="text-zinc-400 text-xs mb-1">Content</div>
                  <div className="text-white font-medium">{selectedUser.content_generated}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-400">Created at</Label>
              <div className="text-zinc-400 text-sm">
                {format(new Date(selectedUser.created_at), "PPp")}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <SheetClose asChild>
                <Button>Done</Button>
              </SheetClose>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-zinc-400 mt-2">
            Manage users and leads from this central dashboard
          </p>
        </div>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            className="pl-10 bg-zinc-900 border-zinc-800"
            placeholder="Search leads and users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="leads" className="data-[state=active]:bg-zinc-800">
            Lead Contacts
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-zinc-800">
            Users
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-[#74d1ea]" />
                  <span>Lead Contacts</span>
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Manage leads who've signed up to learn more about Tovably
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-zinc-900 hover:bg-zinc-800 border-zinc-800"
                onClick={() => {
                  if (filteredLeads.length > 0) {
                    const headers = {
                      name: 'Name',
                      email: 'Email',
                      company: 'Company',
                      message: 'Message',
                      status: 'Status',
                      notes: 'Notes',
                      created_at: 'Created At'
                    };
                    
                    const csvContent = convertToCSV(filteredLeads, headers);
                    downloadCSV(csvContent, 'tovably-lead-contacts.csv');
                    
                    toast({
                      title: "Export successful",
                      description: `${filteredLeads.length} lead contacts exported to CSV.`,
                    });
                  } else {
                    toast({
                      title: "Export failed",
                      description: "No lead contacts to export.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {isLeadsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                </div>
              ) : leadsError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading leads. Please try again.
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  {searchQuery ? "No leads match your search." : "No leads found."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-zinc-900/50 border-zinc-800">
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead: LeadContact) => (
                        <TableRow key={lead.id} className="hover:bg-zinc-900/50 border-zinc-800">
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              lead.status === "new" ? "bg-blue-100 text-blue-800" :
                              lead.status === "contacted" ? "bg-yellow-100 text-yellow-800" :
                              lead.status === "qualified" ? "bg-green-100 text-green-800" :
                              "bg-purple-100 text-purple-800"
                            }`}>
                              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-500">
                            {format(new Date(lead.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedLead(lead);
                                setIsLeadDetailsOpen(true);
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-[#74d1ea]" />
                  <span>Users</span>
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Manage user accounts, subscriptions, and roles
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-zinc-900 hover:bg-zinc-800 border-zinc-800"
                onClick={() => {
                  if (filteredUsers.length > 0) {
                    const headers = {
                      username: 'Username',
                      email: 'Email',
                      role: 'Role',
                      subscription_plan: 'Subscription Plan',
                      personas_used: 'Personas Used',
                      tone_analyses_used: 'Tone Analyses Used',
                      content_generated: 'Content Generated',
                      created_at: 'Created At'
                    };
                    
                    const csvContent = convertToCSV(filteredUsers, headers);
                    downloadCSV(csvContent, 'tovably-users.csv');
                    
                    toast({
                      title: "Export successful",
                      description: `${filteredUsers.length} users exported to CSV.`,
                    });
                  } else {
                    toast({
                      title: "Export failed",
                      description: "No users to export.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {isUsersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                </div>
              ) : usersError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading users. Please try again.
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  {searchQuery ? "No users match your search." : "No users found."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-zinc-900/50 border-zinc-800">
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user: User) => (
                        <TableRow key={user.id} className="hover:bg-zinc-900/50 border-zinc-800">
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-500">
                            {format(new Date(user.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsUserDetailsOpen(true);
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {LeadDetails()}
      {UserDetails()}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Lead Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lead contact? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-900 hover:bg-zinc-800 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLead} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}