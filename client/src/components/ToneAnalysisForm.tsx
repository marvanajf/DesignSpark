import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePricingModal } from "@/hooks/use-pricing-modal";

export default function ToneAnalysisForm() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sampleText, setSampleText] = useState("");
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { openPricingModal } = usePricingModal();

  const toneAnalysisMutation = useMutation({
    mutationFn: async (data: { websiteUrl?: string; sampleText?: string }) => {
      const res = await apiRequest("POST", "/api/tone-analysis", data);
      
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tone-analyses"] });
      navigate(`/tone-results/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteUrl && !sampleText) {
      toast({
        title: "Missing input",
        description: "Please provide either a website URL or sample text",
        variant: "destructive",
      });
      return;
    }
    
    toneAnalysisMutation.mutate({
      websiteUrl: websiteUrl || undefined,
      sampleText: sampleText || undefined,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Analyze Your Brand's Tone</CardTitle>
        <CardDescription>
          Let us understand your communication style to create perfectly matched content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-card text-lg font-medium">
                  Input your content
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Website URL Input */}
            <div>
              <label htmlFor="website-url" className="block text-sm font-medium mb-2">
                Enter your website URL
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                  https://
                </span>
                <Input
                  type="text"
                  id="website-url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="rounded-l-none"
                  placeholder="yourwebsite.com"
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                We'll analyze public pages to determine your brand's tone.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-card text-lg font-medium">
                  Or
                </span>
              </div>
            </div>

            {/* Content Upload - would be implemented with a file uploader component */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload content samples
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-input rounded-md bg-muted">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-muted-foreground">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-muted rounded-md font-medium text-primary hover:text-primary/80">
                      <span>Upload files</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    .txt, .docx, .pdf up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Example Text Input */}
            <div>
              <label htmlFor="content-sample" className="block text-sm font-medium mb-2">
                Or paste a content sample
              </label>
              <Textarea
                id="content-sample"
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                rows={6}
                placeholder="Paste your blog post, email, or other content samples here..."
              />
              <p className="mt-2 text-sm text-muted-foreground">
                For best results, provide at least 200 words of content.
              </p>
            </div>

            <div className="flex justify-end pt-5">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="ml-3"
                disabled={toneAnalysisMutation.isPending}
              >
                {toneAnalysisMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Tone"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
