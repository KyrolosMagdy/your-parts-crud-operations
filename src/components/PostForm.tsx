"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type Post, PostService, UserService, type User } from "@/services/api";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Snackbar from "./Snackbar";
import LoadingComponent from "./LoadingSpinner";
import usePostsStore from "@/store/usePostsStore";
import { warningMessage } from "@/utils/constants";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  userId: z.number().positive("User ID must be a positive number"),
});

type FormData = z.infer<typeof schema>;

interface PostFormProps {
  post?: Post;
}

type MutationContext = {
  previousPosts?: Post[];
};

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [userSearch, setUserSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const queryClient = useQueryClient();

  const { setSuccessMessage, setFailureMessage, failureMessage } =
    usePostsStore();

  const { data: usersData, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => UserService.getUsers().then((res) => res.data),
    staleTime: Number.POSITIVE_INFINITY, // Prevent automatic refetching
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: post,
  });

  const watchUserId = watch("userId");

  useEffect(() => {
    if (watchUserId && usersData) {
      const user = usersData.find((u) => u.id === watchUserId);
      if (user) {
        setUserSearch(user.name);
      }
    }
  }, [watchUserId, usersData]);

  const updateMutation = useMutation<Post, Error, Post, MutationContext>({
    mutationFn: async (updatedPost: Post) => {
      const response = await PostService.updatePost(updatedPost);
      return response.data;
    },
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
      queryClient.setQueryData<Post[]>(["posts"], (old) =>
        old
          ? old.map((post) => (post.id === newPost.id ? newPost : post))
          : [newPost]
      );
      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData<Post[]>(["posts"], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const createMutation = useMutation<Post, Error, FormData, MutationContext>({
    mutationFn: async (newPost: FormData) => {
      const response = await PostService.createPost(newPost);
      return response.data;
    },
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
      queryClient.setQueryData<Post[]>(["posts"], (old) =>
        old
          ? [{ ...newPost, id: Date.now() }, ...old]
          : [{ ...newPost, id: Date.now() }]
      );
      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData<Post[]>(["posts"], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      if (post) {
        const updatedPost = await updateMutation.mutateAsync({
          ...data,
          id: post.id,
        });
        queryClient.setQueryData<Post>(
          ["post", post.id.toString()],
          updatedPost
        );
      } else {
        const createdPost = await createMutation.mutateAsync(data);
        queryClient.setQueryData<Post>(
          ["post", createdPost.id.toString()],
          createdPost
        );
      }
      setSuccessMessage("Post saved Successfully, " + warningMessage);
      router.push("/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      setFailureMessage("Error saving post, Please try again later");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = usersData
    ? usersData.filter((user) =>
        user.name.toLowerCase().includes(userSearch.toLowerCase())
      )
    : [];

  if (isLoadingUsers) return <LoadingComponent isLoading />;

  return (
    <div className="flex justify-start p-4 items-center rounded-xl py-8 border">
      {isSaving && <LoadingComponent isLoading />}
      {failureMessage && (
        <Snackbar
          type="error"
          message={failureMessage}
          isVisible={true}
          onClose={() => {
            setFailureMessage("");
          }}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            {...register("title")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="body" className="block mb-1 font-medium">
            Body
          </label>
          <textarea
            id="body"
            {...register("body")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
          />
          {errors.body && (
            <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
          )}
        </div>
        <div className="mb-4 relative">
          <label htmlFor="userId" className="block mb-1 font-medium">
            User
          </label>
          <input
            type="text"
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for a user..."
          />
          {showDropdown && filteredUsers.length > 0 && (
            <ul
              className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-auto"
              style={{ backgroundColor: "white" }}
            >
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setValue("userId", user.id);
                    setUserSearch(user.name);
                    setShowDropdown(false);
                  }}
                >
                  {user.name} (ID: {user.id})
                </li>
              ))}
            </ul>
          )}
          <input
            type="hidden"
            {...register("userId", { valueAsNumber: true })}
          />
          {errors.userId && (
            <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>
          )}
        </div>
        <button
          type="submit"
          style={{ color: "white" }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {post ? "Update Post" : "Create Post"}
        </button>
      </form>
      <Snackbar
        message={
          post ? "Post updated successfully!" : "Post created successfully!"
        }
        isVisible={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      />
    </div>
  );
}
