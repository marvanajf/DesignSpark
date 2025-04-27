import Layout from "@/components/Layout";
import SavedContentList from "@/components/SavedContentList";

export default function SavedContentPage() {
  return (
    <Layout showSidebar={true}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Saved Content</h1>
          <p className="mt-2 text-muted-foreground">
            View, edit, and manage all your generated content
          </p>
        </div>

        <SavedContentList />
      </div>
    </Layout>
  );
}
