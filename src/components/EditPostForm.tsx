"use client";
import { useQuery } from "@tanstack/react-query";
import PostForm from "@/components/PostForm";
import { PostService, type Post } from "@/services/api";

interface EditPostFormProps {
  initialPost: Post;
}

export default function EditPostForm({ initialPost }: EditPostFormProps) {
  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ["post", initialPost.id],
    queryFn: () => PostService.getPost(initialPost.id).then((res) => res.data),
    initialData: initialPost,
  });

  if (isLoading) return <div>Loading post...</div>;
  if (error) return <div>Error loading post</div>;
  if (!post) return null;

  return <PostForm post={post} />;
}
