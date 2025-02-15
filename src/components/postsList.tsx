"use client";

import type React from "react";
import { useCallback, useState, useRef, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { PostService, type Post } from "@/services/api";
import { Trash2, Pencil, Plus, ChevronDown, ChevronUp } from "lucide-react";
import usePostsStore from "@/store/usePostsStore";
import LoadingComponent from "./LoadingSpinner";

const CONTENT_THRESHOLD = 100;
const POSTS_PER_PAGE = 10;

export default function PostList() {
  const { toggleIsLoading, isLoading } = usePostsStore();
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) =>
      PostService.getPosts(pageParam, POSTS_PER_PAGE).then((res) => res.data),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === POSTS_PER_PAGE
        ? allPages.length + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: PostService.deletePost,
    onMutate: async (deletedId) => {
      toggleIsLoading(true);
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousData = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return { pages: [], pageParams: [] };
        return {
          ...old,
          pages: old.pages.map((page: Post[]) =>
            page.filter((post) => post.id !== deletedId)
          ),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["posts"], context.previousData);
      }
    },
    onSettled: () => {
      toggleIsLoading(false);
    },
  });

  const handleDelete = useCallback(
    async (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const toggleExpand = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const needsExpansion = (content: string) =>
    content.length > CONTENT_THRESHOLD;

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const option = { threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (status === "pending") return <LoadingComponent isLoading />;
  if (status === "error")
    return (
      <div className="text-red-500">
        Error loading posts. Please try again later or contact support if the
        problem persists.
      </div>
    );

  const handleRefetch = async () => {
    toggleIsLoading(true);
    await refetch();
    toggleIsLoading(false);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Link
          href="/posts/new"
          className="bg-blue-500 text-white px-4 py-2 rounded inline-flex items-center gap-2"
          style={{ color: "white" }}
        >
          <Plus size={20} /> Create New Post
        </Link>
        <button
          onClick={() => handleRefetch()}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Refresh Posts
        </button>
      </div>
      <LoadingComponent isLoading={isLoading} />
      <div className="flex justify-center">
        <ul className="grid grid-cols-1 gap-4 items-center w-full max-w-2xl">
          {data?.pages.map((page, pageIndex) =>
            page.map((post: Post, index: number) => (
              <li
                key={post.id}
                className={`border p-4 rounded cursor-pointer w-full hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                  (pageIndex * POSTS_PER_PAGE + index) % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                }`}
                onClick={() =>
                  needsExpansion(post.body) && toggleExpand(post.id)
                }
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
            ))
          )}
        </ul>
      </div>
      {hasNextPage && <div ref={observerTarget} className="h-10 w-full" />}
      {isFetchingNextPage && (
        <div className="text-center mt-4">Loading more posts...</div>
      )}
    </div>
  );
}
