"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { PostService, type Post } from "@/services/api";
import { Plus } from "lucide-react";
import LoadingComponent from "./LoadingSpinner";
import Pagination from "./Pagination";
import { PostCard } from "./PostCard";

const CONTENT_THRESHOLD = 200;
const POSTS_PER_PAGE = 5;

export default function PostList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const {
    data: allPosts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => PostService.getPosts().then((res) => res.data),
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false, // Prevent automatic refetching
  });

  const deleteMutation = useMutation({
    mutationFn: PostService.deletePost,
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);

      // Optimistically update to the new value
      queryClient.setQueryData<Post[]>(["posts"], (old) =>
        old ? old.filter((post) => post.id !== deletedId) : []
      );

      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData<Post[]>(["posts"], context?.previousPosts);
    },
  });

  const handleDelete = useCallback(
    async (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    [deleteMutation]
  );

  const toggleExpand = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const needsExpansion = (content: string) =>
    content.length > CONTENT_THRESHOLD;

  const paginatedPosts = useMemo(() => {
    if (!allPosts) return [];
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return allPosts.slice(startIndex, endIndex);
  }, [allPosts, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil((allPosts?.length || 0) / POSTS_PER_PAGE);
  }, [allPosts]);

  if (isLoading) return <LoadingComponent isLoading />;
  if (isError)
    return (
      <div className="text-red-500">
        Error loading posts. Please try again later.
      </div>
    );

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Link
          href="/posts/new"
          style={{ color: "white" }}
          className="bg-blue-500 text-white px-4 py-2 rounded inline-flex items-center gap-2"
        >
          <Plus size={20} /> Create New Post
        </Link>
      </div>
      <div className="flex justify-center">
        <ul className="grid grid-cols-1 gap-4 items-center w-full max-w-2xl">
          {paginatedPosts.map((post: Post, index: number) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              needsExpansion={needsExpansion}
              toggleExpand={toggleExpand}
              expandedPost={expandedPost}
              handleDelete={handleDelete}
            />
          ))}
        </ul>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
