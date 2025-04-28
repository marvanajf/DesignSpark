import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Persona } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePricingModal } from "@/hooks/use-pricing-modal";

export default function PersonaSelection() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<number[]>([]);
  const { openPricingModal } = usePricingModal();

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
      
      if (res.status === 402) {
        // Subscription limit reached
        const errorData = await res.json();
        if (errorData.limitType) {
          openPricingModal(errorData.limitType);
          throw new Error("Subscription limit reached. Please upgrade your plan.");
        }
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personas"] });
      toast({
        title: "Personas created",
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

  // Check if personas exist and seed if not
  useEffect(() => {
    if (personas && personas.length === 0 && !seedPersonasMutation.isPending) {
      seedPersonasMutation.mutate();
    }
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

  if (isLoading || seedPersonasMutation.isPending) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !personas) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-destructive mb-4">Failed to load personas</h2>
        <p className="text-muted-foreground mb-6">
          {error instanceof Error ? error.message : "Something went wrong. Please try again."}
        </p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/personas"] })}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Choose Your Target Personas</h1>
        <p className="mt-3 text-xl text-muted-foreground">
          Select the audience profiles you want to target with your content.
        </p>
        <div className="mt-4 inline-flex items-center text-muted-foreground text-sm">
          <Info className="mr-1.5 h-5 w-5 text-primary" />
          Select up to 5 personas. You can change these selections later.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
        {personas.map((persona) => {
          const isSelected = selectedPersonaIds.includes(persona.id);
          return (
            <Card 
              key={persona.id} 
              className={`relative overflow-hidden ${isSelected ? 'border-2 border-primary' : ''}`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 m-2">
                  <Badge className="bg-primary/20 text-primary">
                    Selected
                  </Badge>
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{persona.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{persona.name}</h3>
                    {/* Show a role if available, or extract from name */}
                    <p className="text-sm text-muted-foreground">
                      {persona.name.includes("Director") || persona.name.includes("Manager") || persona.name.includes("Owner") || persona.name.includes("Officer")
                        ? persona.name.split(" ").slice(0, -1).join(" ")
                        : "Professional"}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {persona.description}
                </p>
                
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Key Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {persona.interests && Array.isArray(persona.interests) && persona.interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted py-3 px-5">
                <Button
                  variant={isSelected ? "secondary" : "outline"}
                  className={`w-full ${isSelected ? 'text-primary bg-primary/20 hover:bg-primary/30' : ''}`}
                  onClick={() => togglePersonaSelection(persona.id)}
                >
                  {isSelected ? (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Selected
                    </>
                  ) : (
                    "Select Persona"
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate('/content-generator')}
          className="inline-flex items-center"
          disabled={selectedPersonaIds.length === 0}
        >
          Continue to Content Generation
          <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Button>
        {selectedPersonaIds.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            Please select at least one persona to continue
          </p>
        )}
      </div>
    </div>
  );
}
