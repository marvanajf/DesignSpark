import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ToneAnalysis } from "@shared/schema";

interface ToneResultsProps {
  analysisId: number;
}

export default function ToneResults({ analysisId }: ToneResultsProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: toneAnalysis, isLoading, error } = useQuery<ToneAnalysis>({
    queryKey: [`/api/tone-analyses/${analysisId}`],
    onError: (err: Error) => {
      toast({
        title: "Failed to load tone analysis",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !toneAnalysis || !toneAnalysis.tone_results) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-destructive mb-4">Failed to load tone analysis</h2>
        <p className="text-muted-foreground mb-6">
          {error instanceof Error ? error.message : "Something went wrong with the analysis. Please try again."}
        </p>
        <Button onClick={() => navigate('/tone-analysis')}>Try Again</Button>
      </div>
    );
  }

  const toneResults = toneAnalysis.tone_results;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-1 rounded-full text-base font-medium bg-primary/20 text-primary mb-4">
          <CheckCircle className="w-5 h-5 mr-2" />
          Analysis Complete
        </div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Your Brand Tone Analysis</h1>
        <p className="mt-3 text-xl text-muted-foreground">
          We've analyzed your content and identified the following tone characteristics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tone Characteristics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tone Characteristics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {Object.entries(toneResults.characteristics).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium capitalize">{key}</div>
                    <div className="text-sm font-medium">{value}%</div>
                  </div>
                  <Progress value={value as number} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Language Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Key Language Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(toneResults.language_patterns).map(([key, value]) => (
                <div key={key} className="bg-muted rounded-lg p-3">
                  <h4 className="font-medium text-sm capitalize">{key.replace('_', ' ')}</h4>
                  {Array.isArray(value) ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      {value.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tone Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Tone Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">{toneResults.summary}</p>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-sm mb-2">Recommended Content Types</h4>
              <div className="flex flex-wrap gap-2">
                {toneResults.recommended_content_types.map((type, i) => (
                  <Badge key={i} variant="outline" className="bg-primary/10 text-primary">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to create content based on your tone?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Now that we understand your brand's tone, let's select target personas to create perfectly tailored content.
        </p>
        <Button 
          onClick={() => navigate('/personas')}
          className="inline-flex items-center"
        >
          Continue to Persona Selection
          <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
