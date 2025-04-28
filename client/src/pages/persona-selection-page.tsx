import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Loader2, 
  Info, 
  ChevronDown, 
  Calendar, 
  Filter,
  UserCircle,
  Plus,
  X,
  Users,
  Search,
  Sparkles,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Persona } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

export default function PersonaSelectionPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [personaDescription, setPersonaDescription] = useState("");
  const [personaToDelete, setPersonaToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch personas
  const { data: personas, isLoading, error } = useQuery<Persona[]>({
    queryKey: ["/api/personas"],
    onError: (err: Error) => {
      toast({
        title: "Failed to load personas",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Seed predefined personas if none exist
  const seedPersonasMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/seed-personas", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personas"] });
      toast({
        title: "Example personas added",
        description: "Predefined personas have been added to your account",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create personas",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update persona selection status
  const updatePersonaMutation = useMutation({
    mutationFn: async ({ id, isSelected }: { id: number; isSelected: boolean }) => {
      const res = await apiRequest("PATCH", `/api/personas/${id}`, { is_selected: isSelected });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personas"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update persona",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate a new persona with OpenAI
  const generatePersonaMutation = useMutation({
    mutationFn: async (description: string) => {
      const res = await apiRequest("POST", "/api/generate-persona", { description });
      return res.json();
    },
    onSuccess: (data) => {
      setIsGenerateDialogOpen(false);
      setPersonaDescription("");
      queryClient.invalidateQueries({ queryKey: ["/api/personas"] });
      toast({
        title: "Persona created",
        description: `"${data.name}" has been created successfully`,
      });
    },
    onError: (error: any) => {
      if (error.message?.includes("OpenAI API is not available")) {
        toast({
          title: "API Key Required",
          description: "An OpenAI API key is required to generate personas. Please add your API key in the settings.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to generate persona",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  // Create a new persona manually
  const createPersonaMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const res = await apiRequest("POST", "/api/personas", {
        name: data.name,
        description: data.description,
        interests: []
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personas"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create persona",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete a persona
  const deletePersonaMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        console.log("Deleting persona with id:", id);
        const response = await apiRequest("DELETE", `/api/personas/${id}`);
        console.log("Delete response:", response);
        return response;
      } catch (error) {
        console.error("Delete persona error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personas"] });
      toast({
        title: "Persona deleted",
        description: "The persona has been successfully deleted",
      });
    },
    onError: (error: Error) => {
      console.error("Delete mutation error:", error);
      toast({
        title: "Failed to delete persona",
        description: error.message || "An error occurred while deleting the persona",
        variant: "destructive",
      });
    },
  });

  // Login and check if personas exist and seed if not
  useEffect(() => {
    // Get auth status
    fetch("/api/user", { credentials: "include" })
      .then(res => {
        console.log("Auth status:", res.status);
        if (res.status === 401) {
          console.log("Need to log in");
          // Try to login with the demo account (created automatically at server startup)
          return fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: "demo@tovably.com",
              password: "password123"
            }),
            credentials: "include"
          });
        }
        return res;
      })
      .then(res => {
        console.log("Login response:", res.status);
        console.log("Checking if we need to seed personas...");
        if (personas && personas.length === 0 && !seedPersonasMutation.isPending) {
          console.log("Seeding personas...");
          seedPersonasMutation.mutate();
        }
      })
      .catch(err => console.error("Auth error:", err));
  }, [personas, seedPersonasMutation]);

  // Initialize selected personas from fetched data
  useEffect(() => {
    if (personas) {
      const initialSelectedIds = personas
        .filter(persona => persona.is_selected)
        .map(persona => persona.id);
      setSelectedPersonaIds(initialSelectedIds);
    }
  }, [personas]);

  const togglePersonaSelection = (personaId: number) => {
    setSelectedPersonaIds(prevIds => {
      if (prevIds.includes(personaId)) {
        // Remove the persona
        updatePersonaMutation.mutate({ id: personaId, isSelected: false });
        return prevIds.filter(id => id !== personaId);
      } else {
        // Add the persona (limit to 5)
        if (prevIds.length < 5) {
          updatePersonaMutation.mutate({ id: personaId, isSelected: true });
          return [...prevIds, personaId];
        } else {
          toast({
            title: "Maximum selections reached",
            description: "You can select up to 5 personas",
            variant: "destructive",
          });
          return prevIds;
        }
      }
    });
  };

  const handleGeneratePersona = () => {
    if (!personaDescription.trim()) {
      toast({
        title: "Description required",
        description: "Please enter a description to generate a persona",
        variant: "destructive",
      });
      return;
    }

    generatePersonaMutation.mutate(personaDescription);
  };
  
  const handleDeletePersona = (id: number) => {
    setPersonaToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeletePersona = () => {
    if (personaToDelete !== null) {
      deletePersonaMutation.mutate(personaToDelete);
      setIsDeleteDialogOpen(false);
      setPersonaToDelete(null);
    }
  };

  // Filter personas based on search term
  const filteredPersonas = personas?.filter(persona => 
    persona.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (persona.description && persona.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading || seedPersonasMutation.isPending) {
    return (
      <Layout showSidebar={true}>
        <div className="flex-1 overflow-y-auto bg-black">
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !personas) {
    return (
      <Layout showSidebar={true}>
        <div className="flex-1 overflow-y-auto bg-black">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Failed to load personas</h2>
            <p className="text-gray-400 mb-6">
              {error instanceof Error ? error.message : "Something went wrong. Please try again."}
            </p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/personas"] })}>
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-6">
          {/* Header Section with Filters */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>Tovably</span>
                  <span className="mx-2">›</span>
                  <span>Personas</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1">Target Personas</h1>
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search personas..."
                    className="pl-10 bg-[#111] border-gray-800 text-gray-300 w-[220px]"
                  />
                </div>
                <Button variant="outline" className="text-sm h-9 border-gray-800 bg-[#111] hover:bg-gray-900">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Create Persona Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-medium text-white">Create New Persona</h2>
                <p className="text-sm text-gray-400 mt-1">Specify your target audience profiles</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Generator Card */}
              <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#74d1ea]/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">AI Generator</h3>
                      <p className="text-sm text-gray-400">Create a persona using AI</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Let our AI create detailed professional personas based on your description of roles, 
                    industries, or specific audience segments.
                  </p>
                  <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black">
                        Generate with AI
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#111] border-gray-800 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Generate Persona with AI</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Describe the role, industry, or audience profile and our AI will create a detailed persona.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Textarea
                          value={personaDescription}
                          onChange={(e) => setPersonaDescription(e.target.value)}
                          placeholder="E.g., Founder of a 50-person SaaS startup in the HR tech industry, focused on enterprise clients"
                          className="h-36 bg-black border-gray-700 text-white"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          The more specific your description, the better the AI-generated persona will be.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300 hover:text-white"
                          onClick={() => setIsGenerateDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                          onClick={handleGeneratePersona}
                          disabled={generatePersonaMutation.isPending}
                        >
                          {generatePersonaMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            "Generate Persona"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Manual Create Card */}
              <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-900 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#74d1ea]/10 flex items-center justify-center">
                      <UserCircle className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">Custom Persona</h3>
                      <p className="text-sm text-gray-400">Create a persona manually</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Define your own target audience by directly specifying the role, interests, 
                    and key characteristics of the persona you want to target.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full border border-[#74d1ea] text-[#74d1ea] bg-transparent hover:bg-[#74d1ea]/10">
                        Create Manually
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#111] border-gray-800 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Create Custom Persona</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Define a custom target audience for your content.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const name = formData.get('name') as string;
                        const description = formData.get('description') as string;
                        
                        if (!name) {
                          toast({
                            title: "Name required",
                            description: "Please enter a name for the persona",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        createPersonaMutation.mutate({ name, description });
                        (e.target as HTMLFormElement).reset();
                        (document.activeElement as HTMLElement)?.blur();
                      }}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-300">Persona Name/Role</label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="E.g., Chief Marketing Officer"
                              className="bg-black border-gray-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-gray-300">Description</label>
                            <Textarea
                              id="description"
                              name="description"
                              placeholder="Describe the persona's priorities, challenges, and goals"
                              className="h-20 bg-black border-gray-700 text-white"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                            disabled={createPersonaMutation.isPending}
                          >
                            {createPersonaMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              "Create Persona"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Personas List Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-medium text-white">Your Personas</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Select up to 5 personas for content generation
                </p>
              </div>
            </div>

            {filteredPersonas && filteredPersonas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPersonas.map((persona) => {
                  const isSelected = selectedPersonaIds.includes(persona.id);
                  return (
                    <Card 
                      key={persona.id} 
                      className={`bg-[#111] border-gray-800 rounded-lg overflow-hidden relative ${
                        isSelected ? 'ring-2 ring-[#74d1ea]' : ''
                      }`}
                    >
                      <div className="absolute top-0 right-0 m-2 flex space-x-2">
                        {isSelected && (
                          <Badge className="bg-[#74d1ea]/20 text-[#74d1ea] border-0">
                            Selected
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full hover:bg-red-900/20 hover:text-red-500 text-gray-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePersona(persona.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center mb-4">
                          <Avatar className="h-12 w-12 bg-[#74d1ea]/20 border-0">
                            <AvatarFallback className="text-[#74d1ea]">
                              {persona.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-white">{persona.name}</h3>
                            <p className="text-sm text-gray-400">
                              {persona.name.includes("Director") || 
                               persona.name.includes("Manager") || 
                               persona.name.includes("Owner") || 
                               persona.name.includes("Officer")
                                ? persona.name.split(" ").slice(0, -1).join(" ")
                                : "Professional"}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-4">
                          {persona.description}
                        </p>
                        
                        {persona.interests && Array.isArray(persona.interests) && persona.interests.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Key Interests</h4>
                            <div className="flex flex-wrap gap-2">
                              {persona.interests.map((interest, index) => (
                                <Badge key={index} variant="outline" className="bg-[#74d1ea]/10 text-[#74d1ea] border-0">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="bg-black/20 py-3 px-5 border-t border-gray-800">
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          className={`w-full ${
                            isSelected 
                              ? 'bg-[#74d1ea] hover:bg-[#5db8d0] text-black' 
                              : 'border-gray-700 text-gray-300 hover:text-white'
                          }`}
                          onClick={() => togglePersonaSelection(persona.id)}
                        >
                          {isSelected ? (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Deselect
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Select
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="py-10">
                    <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No personas found</h3>
                    <p className="text-gray-400 mb-4">
                      {searchTerm 
                        ? `No personas match "${searchTerm}". Try a different search term.` 
                        : "You haven't created any personas yet. Create one to get started."}
                    </p>
                    {searchTerm && (
                      <Button 
                        variant="outline"
                        className="border-gray-700 text-gray-300"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Continue Button Section */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center text-gray-400 text-sm mb-4">
              <Info className="mr-1.5 h-5 w-5 text-[#74d1ea]" />
              {selectedPersonaIds.length} of 5 maximum personas selected
            </div>
            
            <div>
              <Button 
                onClick={() => navigate('/content-generator')}
                className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black px-8 py-6 text-lg rounded-md"
                disabled={selectedPersonaIds.length === 0}
              >
                Continue to Content Generation
              </Button>
              
              {selectedPersonaIds.length === 0 && (
                <p className="mt-2 text-sm text-gray-400">
                  Please select at least one persona to continue
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-[#111] border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Delete Persona
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete this persona? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-300">
                Deleting this persona will remove it permanently from your account.
                Any content previously generated using this persona will remain available.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-white"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDeletePersona}
                disabled={deletePersonaMutation.isPending}
              >
                {deletePersonaMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Persona"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}