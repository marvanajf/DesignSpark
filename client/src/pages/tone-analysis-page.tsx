import Layout from "@/components/Layout";
import ToneAnalysisForm from "@/components/ToneAnalysisForm";

export default function ToneAnalysisPage() {
  return (
    <Layout showSidebar={true}>
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Analyze Your Brand's Tone</h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Let us understand your communication style to create perfectly matched content.
          </p>
        </div>

        <ToneAnalysisForm />
      </div>
    </Layout>
  );
}
