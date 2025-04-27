import { useParams } from "wouter";
import Layout from "@/components/Layout";
import ToneResults from "@/components/ToneResults";

export default function ToneResultsPage() {
  const params = useParams<{ id: string }>();
  const analysisId = params.id ? parseInt(params.id) : 0;

  return (
    <Layout showSidebar={true}>
      {analysisId ? (
        <ToneResults analysisId={analysisId} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-4">Invalid Tone Analysis ID</h2>
          <p className="text-muted-foreground">
            Please go back to the dashboard and select a valid tone analysis.
          </p>
        </div>
      )}
    </Layout>
  );
}
