"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type Post, PostService, UserService, type User } from "@/services/api";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePostsStore from "@/store/usePostsStore";
import LoadingComponent from "./LoadingSpinner";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  userId: z.number().positive("User ID must be a positive number"),
});

type FormData = z.infer<typeof schema>;

interface PostFormProps {
  post?: Post;
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [userSearch, setUserSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const queryClient = useQueryClient();
  const { setSuccessMessage, toggleIsLoading, isLoading } = usePostsStore();

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => UserService.getUsers().then((res) => res.data),
  });

  const updateMutation = useMutation({
    mutationFn: PostService.updatePost,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", newPost.id] });

      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousPost = queryClient.getQueryData(["post", newPost.id]);

      // Update the posts list
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return { pages: [], pageParams: [] };
        return {
          ...old,
          pages: old.pages.map((page: Post[]) =>
            page.map((post) => (post.id === newPost.id ? newPost : post))
          ),
        };
      });

      // Update the individual post
      queryClient.setQueryData(["post", newPost.id], newPost);

      return { previousPosts, previousPost };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
      queryClient.setQueryData(["post", newPost.id], context?.previousPost);
    },
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setShowSnackbar(true);
    },
  });

  const createMutation = useMutation({
    mutationFn: PostService.createPost,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData(["posts"]);

      // Add the new post to the list
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old)
          return { pages: [[{ id: Date.now(), ...newPost }]], pageParams: [1] };
        return {
          ...old,
          pages: [
            [{ id: Date.now(), ...newPost }, ...old.pages[0]],
            ...old.pages.slice(1),
          ],
        };
      });

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setShowSnackbar(true);
    },
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
    if (watchUserId) {
      const user = users?.find((u) => u.id === watchUserId);
      if (user) {
        setUserSearch(user.name);
      }
    }
  }, [watchUserId, users]);

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const onSubmit = async (data: FormData) => {
    try {
      toggleIsLoading(true);
      if (post) {
        await updateMutation.mutateAsync({ ...data, id: post.id });
        setSuccessMessage(
          post
            ? "Post updated successfully!, Please note: the server wont actually save the post, everytime you refresh this update will be removed"
            : "Post created successfully!, Please note: the server wont actually save the post, everytime you refresh this update will be removed"
        );
      } else {
        await createMutation.mutateAsync(data);
        setSuccessMessage(
          post
            ? "Post updated successfully!, Please note: the server wont actually save the post, everytime you refresh this update will be removed"
            : "Post created successfully!, Please note: the server wont actually save the post, everytime you refresh this update will be removed"
        );
      }
      router.push("/posts");
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      toggleIsLoading(false);
    }
  };

  return (
    <div className="flex justify-start p-4 items-center border rounded-2xl py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <LoadingComponent isLoading={isLoading} />
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
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for a user..."
          />
          {showDropdown && filteredUsers && filteredUsers.length > 0 && (
            <ul
              className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-auto"
              style={{ backgroundColor: "white" }}
            >
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring:blue-500 focus:ring-offset-2"
          style={{ color: "white" }}
        >
          {post ? "Update Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
}
