import Layout from "@/components/Layout";
import ContentGenerator from "@/components/ContentGenerator";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ToneAnalysis, Persona } from "@shared/schema";

export default function ContentGeneratorPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [readyToGenerate, setReadyToGenerate] = useState(false);

  // Fetch tone analyses
  const { data: toneAnalyses, isLoading: isLoadingTones } = useQuery<ToneAnalysis[]>({
    queryKey: ["/api/tone-analyses"],
  });

  // Fetch selected personas
  const { data: personas, isLoading: isLoadingPersonas } = useQuery<Persona[]>({
    queryKey: ["/api/personas"],
  });

  // Check if user has necessary prerequisites
  useEffect(() => {
    if (!isLoadingTones && !isLoadingPersonas) {
      const hasSelectedPersonas = personas?.some(p => p.is_selected) ?? false;
      const hasToneAnalyses = (toneAnalyses?.length ?? 0) > 0;
      
      setReadyToGenerate(hasSelectedPersonas && hasToneAnalyses);
      
      if (!hasToneAnalyses && !isLoadingTones) {
        toast({
          title: "No tone analysis found",
          description: "You need to analyze your tone before generating content",
          variant: "warning",
        });
      }
      
      if (!hasSelectedPersonas && !isLoadingPersonas) {
        toast({
          title: "No personas selected",
          description: "Please select at least one persona before generating content",
          variant: "warning",
        });
      }
    }
  }, [toneAnalyses, personas, isLoadingTones, isLoadingPersonas, toast]);

  if (!readyToGenerate && !isLoadingTones && !isLoadingPersonas) {
    return (
      <Layout showSidebar={true}>
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl mb-6">Get Ready to Generate Content</h1>
          
          {/* Missing tone analysis */}
          {(!toneAnalyses || toneAnalyses.length === 0) && (
            <div className="bg-card p-6 rounded-lg mb-8 border border-border">
              <h2 className="text-xl font-semibold mb-3">Tone Analysis Required</h2>
              <p className="text-muted-foreground mb-4">
                Before generating content, we need to understand your brand's tone of voice.
              </p>
              <Button onClick={() => navigate('/tone-analysis')}>
                Create Tone Analysis
              </Button>
            </div>
          )}
          
          {/* Missing persona selection */}
          {(!personas || !personas.some(p => p.is_selected)) && (
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-3">Select Target Personas</h2>
              <p className="text-muted-foreground mb-4">
                Choose which audience personas you want to target with your content.
              </p>
              <Button onClick={() => navigate('/personas')}>
                Select Personas
              </Button>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <ContentGenerator />
    </Layout>
  );
}
