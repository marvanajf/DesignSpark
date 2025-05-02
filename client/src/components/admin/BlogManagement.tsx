import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Eye, FileText, Plus, FilePlus } from "lucide-react";
import { format } from "date-fns";
import slugify from "slugify";

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_id: number;
  category_id?: number;
  featured_image?: string;
  published: boolean;
  publish_date?: string;
  created_at: string;
  updated_at: string;
}

export default function BlogManagement() {
  const { toast } = useToast();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "", // This will serve as the subtitle
    content: "",
    category_id: 0,
    published: true,
  });

  // Fetch blog posts
  const {
    data: blogPosts = [] as BlogPost[],
    isLoading: isPostsLoading,
    error: postsError,
  } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    staleTime: 1000 * 60, // 1 minute
  });

  // Fetch blog categories
  const {
    data: categories = [] as BlogCategory[],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery<BlogCategory[]>({
    queryKey: ["/api/blog-categories"],
    staleTime: 1000 * 60, // 1 minute
  });

  // Create blog post mutation
  const createPostMutation = useMutation({
    mutationFn: async (post: any) => {
      const res = await fetch("/api/admin/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create blog post");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setIsCreatePostOpen(false);
      setNewPost({
        title: "",
        excerpt: "",
        content: "",
        category_id: 0,
        published: true,
      });
      toast({
        title: "Blog post created",
        description: "The blog post has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const res = await fetch(`/api/admin/blog-posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update blog post");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setIsEditPostOpen(false);
      toast({
        title: "Blog post updated",
        description: "The blog post has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/blog-posts/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete blog post");
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = async () => {
    try {
      // Get the current user ID for author_id
      const userResponse = await fetch("/api/user");
      const userData = await userResponse.json();
      
      // Generate slug from title
      const slug = slugify(newPost.title, { lower: true, strict: true });
      
      createPostMutation.mutate({
        ...newPost,
        slug,
        author_id: userData.id,
        category_id: Number(newPost.category_id) || undefined, // Convert to number or undefined
        published: Boolean(newPost.published),
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error creating post",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePost = () => {
    if (!selectedPost) return;
    
    // Generate slug from title if title was updated
    const updates: any = { ...selectedPost };
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }
    
    updatePostMutation.mutate({
      id: selectedPost.id,
      updates: {
        ...updates,
        category_id: Number(updates.category_id) || undefined,
      },
    });
  };

  const handleDeletePost = () => {
    if (selectedPost) {
      deletePostMutation.mutate(selectedPost.id);
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditPostOpen(true);
  };

  const openDeleteDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  if (isPostsLoading || isCategoriesLoading) {
    return <div className="flex justify-center p-8">Loading blog management...</div>;
  }

  if (postsError || categoriesError) {
    return <div className="text-red-500 p-4">Error loading blog data</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#74d1ea] hover:bg-[#5bb8d4] text-black">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">Create New Blog Post</DialogTitle>
              <DialogDescription>
                Create a new blog post for your readers.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Subtitle</Label>
                <Input
                  id="excerpt"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newPost.category_id.toString()}
                  onValueChange={(value) => setNewPost({ ...newPost, category_id: parseInt(value) })}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {categories.map((category: BlogCategory) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="min-h-[200px] bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="published">Status</Label>
                <Select
                  value={newPost.published ? "true" : "false"}
                  onValueChange={(value) => setNewPost({ ...newPost, published: value === "true" })}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="true">Published</SelectItem>
                    <SelectItem value="false">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleCreatePost}
                disabled={!newPost.title || !newPost.content}
                className="bg-[#74d1ea] hover:bg-[#5bb8d4] text-black"
              >
                Create Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table className="border border-zinc-800 rounded-md overflow-hidden">
        <TableHeader className="bg-zinc-900">
          <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogPosts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-zinc-400">
                <FileText className="h-10 w-10 mx-auto mb-2 text-zinc-600" />
                No blog posts yet. Create your first post to get started.
              </TableCell>
            </TableRow>
          ) : (
            blogPosts.map((post: BlogPost) => (
              <TableRow key={post.id} className="hover:bg-zinc-900/50 border-zinc-800">
                <TableCell className="font-medium">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-sm text-zinc-400 truncate max-w-[280px]">{post.excerpt}</div>
                </TableCell>
                <TableCell>
                  {post.category_id && categories.find((c: BlogCategory) => c.id === post.category_id)?.name || "Uncategorized"}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${post.published ? "bg-green-900/40 text-green-300" : "bg-zinc-800 text-zinc-400"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell>{format(new Date(post.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="bg-transparent border-zinc-700 hover:bg-zinc-800 h-8 w-8"
                      onClick={() => openEditDialog(post)}
                    >
                      <Pencil className="h-4 w-4 text-zinc-400" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="bg-transparent border-zinc-700 hover:bg-zinc-800 h-8 w-8"
                      onClick={() => openDeleteDialog(post)}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Edit Post Dialog */}
      <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
        <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">Edit Blog Post</DialogTitle>
            <DialogDescription>
              Make changes to your blog post.
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={selectedPost.title}
                  onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-excerpt">Subtitle</Label>
                <Input
                  id="edit-excerpt"
                  value={selectedPost.excerpt}
                  onChange={(e) => setSelectedPost({ ...selectedPost, excerpt: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={selectedPost.category_id?.toString() || ""}
                  onValueChange={(value) => setSelectedPost({ ...selectedPost, category_id: parseInt(value) })}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {categories.map((category: BlogCategory) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={selectedPost.content}
                  onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
                  className="min-h-[200px] bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-published">Status</Label>
                <Select
                  value={selectedPost.published ? "true" : "false"}
                  onValueChange={(value) => setSelectedPost({ ...selectedPost, published: value === "true" })}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="true">Published</SelectItem>
                    <SelectItem value="false">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleUpdatePost}
              disabled={!selectedPost?.title || !selectedPost?.content}
              className="bg-[#74d1ea] hover:bg-[#5bb8d4] text-black"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}