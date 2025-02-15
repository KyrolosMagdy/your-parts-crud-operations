"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type User, UserService } from "@/services/api";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Snackbar from "./Snackbar";
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Invalid Number!"),
});

type FormData = z.infer<typeof schema>;

interface UserFormProps {
  user?: User;
}

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: user,
  });

  const updateMutation = useMutation<User, Error, User>({
    mutationFn: async (data: User) => {
      if (data.id < 0) {
        // This is a temporary user, update it in the cache
        return data;
      }
      const response = await UserService.updateUser(data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<User[]>(["users"], (oldUsers) => {
        if (!oldUsers) return [updatedUser];
        return oldUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      });
      queryClient.setQueryData(
        ["user", updatedUser.id.toString()],
        updatedUser
      );
      setShowSnackbar(true);
    },
  });

  const createMutation = useMutation<User, Error, FormData>({
    mutationFn: async (data: FormData) => {
      const response = await UserService.createUser(data);
      return response.data;
    },
    onSuccess: (createdUser) => {
      queryClient.setQueryData<User[]>(["users"], (oldUsers) => {
        if (!oldUsers) return [createdUser];
        return [...oldUsers, createdUser];
      });
      queryClient.setQueryData(
        ["user", createdUser.id.toString()],
        createdUser
      );
      setShowSnackbar(true);
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (user) {
        await updateMutation.mutateAsync({ ...data, id: user.id });
      } else {
        const tempId = -Date.now(); // Generate a temporary negative ID
        const tempUser = { ...data, id: tempId };
        queryClient.setQueryData<User[]>(["users"], (oldUsers) => {
          if (!oldUsers) return [tempUser];
          return [...oldUsers, tempUser];
        });
        queryClient.setQueryData(["user", tempId.toString()], tempUser);
      }
      router.push("/users");
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-1 font-medium">
            Phone
          </label>
          <input
            id="phone"
            rel="tel"
            {...register("phone")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        <button
          type="submit"
          style={{ color: "white" }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {user ? "Update User" : "Create User"}
        </button>
      </form>
      <Snackbar
        message={
          user ? "User updated successfully!" : "User created successfully!"
        }
        isVisible={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      />
    </div>
  );
}
