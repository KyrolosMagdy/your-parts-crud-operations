"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import PostForm from "@/components/PostForm";
import type { Post } from "@/services/api";
import usePostsStore from "@/store/usePostsStore";
import LoadingSpinner from "@/components/LoadingSpinner";
import { warningMessage } from "@/utils/constants";

interface EditPostFormProps {
  postId: string;
}

export default function EditPostForm({ postId }: EditPostFormProps) {
  const router = useRouter();
  const { setFailureMessage } = usePostsStore();
  const queryClient = useQueryClient();

  const posts = queryClient.getQueryData<Post[]>(["posts"]);
  const post = posts?.find((p) => p.id === Number(postId));

  if (!posts) {
    setFailureMessage(
      "Error: Your post was not found, please try again. " + warningMessage
    );
    router.push("/posts");
  }
  if (!post) {
    setFailureMessage("Error: Your post was not found, please try again.");
    router.push("/posts/new");
  }

  return <PostForm post={post} />;
}
