"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { PostService, type Post } from "@/services/api";
import { Trash2, Pencil, Plus, ChevronDown, ChevronUp } from "lucide-react";
import LoadingComponent from "./LoadingSpinner";
import Pagination from "./Pagination";

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
            <li
              key={post.id}
              className={`border p-4 rounded cursor-pointer w-full hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
              onClick={() => needsExpansion(post.body) && toggleExpand(post.id)}
            >
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  {needsExpansion(post.body) &&
                    (expandedPost === post.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    ))}
                </div>
                <p
                  className={`mt-2 ${
                    needsExpansion(post.body) && expandedPost !== post.id
                      ? "line-clamp-2"
                      : ""
                  }`}
                >
                  {post.body}
                </p>
              </div>

              <div className="mt-4 space-x-2 flex gap-2 justify-between w-full bottom-2">
                <button
                  onClick={(e) => handleDelete(post.id, e)}
                  className="text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <Link
                  href={`/posts/${post.id}/edit`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-green-500 hover:underline flex items-center gap-1"
                >
                  <Pencil size={16} /> Edit
                </Link>
              </div>
            </li>
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
