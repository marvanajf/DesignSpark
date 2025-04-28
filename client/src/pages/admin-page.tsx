import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Redirect } from "wouter";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit, Trash } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { InsertBlogCategory, InsertBlogPost } from "@shared/schema";
import slugify from "slugify";

// Helper function to format dates
function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect if not an admin
  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (user.role !== "admin") {
    return <Redirect to="/" />;
  }

  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="blog-posts" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="blog-posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blog-posts" className="mt-6">
            <BlogPostsManager />
          </TabsContent>
          
          <TabsContent value="categories" className="mt-6">
            <CategoriesManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function BlogPostsManager() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  
  // Fetch all blog posts
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['/api/admin/blog-posts'],
    throwOnError: false,
  });
  
  // Fetch all categories for the dropdown
  const { data: categories } = useQuery({
    queryKey: ['/api/blog-categories'],
    throwOnError: false,
  });
  
  // Create or update a blog post
  const mutation = useMutation({
    mutationFn: async (postData: Partial<InsertBlogPost> & { id?: number }) => {
      const { id, ...data } = postData;
      
      if (id) {
        // Update existing post
        await apiRequest('PATCH', `/api/admin/blog-posts/${id}`, data);
      } else {
        // Create new post
        await apiRequest('POST', '/api/admin/blog-posts', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      
      toast({
        title: currentPost ? "Post Updated" : "Post Created",
        description: `The blog post was successfully ${currentPost ? "updated" : "created"}.`,
      });
      
      setIsDialogOpen(false);
      setCurrentPost(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to ${currentPost ? "update" : "create"} blog post: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete a blog post
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/blog-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      
      toast({
        title: "Post Deleted",
        description: "The blog post was successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete blog post: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleNewPost = () => {
    setCurrentPost(null);
    setIsDialogOpen(true);
  };
  
  const handleEditPost = (post: any) => {
    setCurrentPost(post);
    setIsDialogOpen(true);
  };
  
  const handleDeletePost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string || slugify(title, { lower: true });
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const categoryId = formData.get('category_id') ? parseInt(formData.get('category_id') as string) : null;
    const featuredImage = formData.get('featured_image') as string;
    const published = formData.get('published') === 'on';
    
    const postData: any = {
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId,
      featured_image: featuredImage,
      published,
      author_id: 1, // Get actual user ID
    };
    
    if (currentPost) {
      postData.id = currentPost.id;
    }
    
    mutation.mutate(postData);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>Failed to load blog posts. Please try again.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Blog Posts</h2>
        <Button onClick={handleNewPost}>
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts && posts.length > 0 ? (
                posts.map((post: any) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      {post.category_id && categories?.find((c: any) => c.id === post.category_id)?.name || 'Uncategorized'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${post.published ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(post.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No blog posts found. Create your first post to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentPost ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
            <DialogDescription>
              {currentPost 
                ? 'Update the details of your existing blog post.' 
                : 'Fill out the form below to create a new blog post.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  defaultValue={currentPost?.title || ''} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input 
                  id="slug" 
                  name="slug" 
                  defaultValue={currentPost?.slug || ''} 
                  placeholder="auto-generated-from-title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea 
                  id="excerpt" 
                  name="excerpt" 
                  defaultValue={currentPost?.excerpt || ''} 
                  placeholder="Brief summary of the post" 
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  defaultValue={currentPost?.content || ''} 
                  required
                  rows={10} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <select 
                  id="category_id" 
                  name="category_id" 
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={currentPost?.category_id || ''}
                >
                  <option value="">Uncategorized</option>
                  {categories?.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input 
                  id="featured_image" 
                  name="featured_image" 
                  defaultValue={currentPost?.featured_image || ''} 
                  placeholder="https://example.com/image.jpg" 
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="published" 
                  name="published" 
                  defaultChecked={currentPost?.published || false} 
                />
                <Label htmlFor="published">Publish this post</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentPost ? 'Update Post' : 'Create Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoriesManager() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  
  // Fetch all categories
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/blog-categories'],
    throwOnError: false,
  });
  
  // Create or update a category
  const mutation = useMutation({
    mutationFn: async (categoryData: Partial<InsertBlogCategory> & { id?: number }) => {
      const { id, ...data } = categoryData;
      
      if (id) {
        // Update existing category
        await apiRequest('PATCH', `/api/admin/blog-categories/${id}`, data);
      } else {
        // Create new category
        await apiRequest('POST', '/api/admin/blog-categories', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-categories'] });
      
      toast({
        title: currentCategory ? "Category Updated" : "Category Created",
        description: `The category was successfully ${currentCategory ? "updated" : "created"}.`,
      });
      
      setIsDialogOpen(false);
      setCurrentCategory(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to ${currentCategory ? "update" : "create"} category: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete a category
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/blog-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-categories'] });
      
      toast({
        title: "Category Deleted",
        description: "The category was successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleNewCategory = () => {
    setCurrentCategory(null);
    setIsDialogOpen(true);
  };
  
  const handleEditCategory = (category: any) => {
    setCurrentCategory(category);
    setIsDialogOpen(true);
  };
  
  const handleDeleteCategory = (id: number) => {
    if (window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string || slugify(name, { lower: true });
    
    const categoryData: any = {
      name,
      slug,
    };
    
    if (currentCategory) {
      categoryData.id = currentCategory.id;
    }
    
    mutation.mutate(categoryData);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>Failed to load categories. Please try again.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Categories</h2>
        <Button onClick={handleNewCategory}>
          <Plus className="h-4 w-4 mr-2" /> New Category
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories && categories.length > 0 ? (
                categories.map((category: any) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{formatDate(category.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No categories found. Create your first category to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
              {currentCategory 
                ? 'Update the details of your existing category.' 
                : 'Fill out the form below to create a new category.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={currentCategory?.name || ''} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input 
                id="slug" 
                name="slug" 
                defaultValue={currentCategory?.slug || ''} 
                placeholder="auto-generated-from-name"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}