import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, User, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";

export function PersonasOverview() {
  const { 
    data: personas,
    isLoading,
    error 
  } = useQuery({
    queryKey: ['/api/personas'],
  });

  // Show only 5 personas
  const displayedPersonas = personas?.slice(0, 5) || [];

  return (
    <Card className="border-[#1a1e29] shadow-lg bg-black">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">
            AI Personas
          </CardTitle>
          <CardDescription>
            Your personalized AI personas for content creation
          </CardDescription>
        </div>
        <Link href="/personas">
          <Button variant="outline" className="gap-1" size="sm">
            <User className="h-4 w-4" /> Manage Personas
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6 text-muted-foreground">
            Error loading personas
          </div>
        ) : personas?.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <User className="h-10 w-10 mx-auto text-muted-foreground" />
            <div className="text-lg font-medium">No personas created yet</div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Create AI personas to maintain consistent and targeted messaging across your content.
            </p>
            <Button 
              asChild
              className="mt-2 gap-1"
              style={{ backgroundColor: "#74d1ea", color: "black" }}
            >
              <Link href="/personas/new">
                <Plus className="h-4 w-4" /> Create Persona
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedPersonas.map((persona: any) => (
              <div 
                key={persona.id} 
                className="flex items-start p-3 rounded-lg border border-[#1a1e29] bg-black hover:bg-[#0a0a0a] transition-colors"
              >
                <div className="mr-3 h-10 w-10 rounded-full bg-black border border-[#1a1e29] flex items-center justify-center text-[#74d1ea]">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">{persona.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {persona.description || 'No description'}
                  </p>
                  {persona.interests?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {persona.interests.slice(0, 3).map((interest: string, i: number) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-0.5 rounded-full bg-black border border-[#1a1e29] text-[#74d1ea]"
                        >
                          {interest}
                        </span>
                      ))}
                      {persona.interests.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-black border border-[#1a1e29] text-[#74d1ea]">
                          +{persona.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {personas?.length > 5 && (
              <Button
                variant="ghost"
                className="w-full text-[#74d1ea] justify-between mt-2"
                asChild
              >
                <Link href="/personas">
                  View all {personas.length} personas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}