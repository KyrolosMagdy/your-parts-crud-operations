"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { UserService, type User } from "@/services/api";
import { Plus } from "lucide-react";
import { UserCard } from "./UserCard";

export default function UserList() {
  const queryClient = useQueryClient();

  const {
    data: users,
    status,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => UserService.getUsers().then((res) => res.data),
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleDelete = async (userId: number) => {
    if (userId < 0) {
      // This is a temporary user, just remove it from the cache
      queryClient.setQueryData<User[]>(["users"], (oldUsers) => {
        return oldUsers ? oldUsers.filter((user) => user.id !== userId) : [];
      });
      queryClient.removeQueries({ queryKey: ["user", userId.toString()] });
    } else {
      await UserService.deleteUser(userId);
      queryClient.setQueryData<User[]>(["users"], (oldUsers) => {
        return oldUsers ? oldUsers.filter((user) => user.id !== userId) : [];
      });
      queryClient.removeQueries({ queryKey: ["user", userId.toString()] });
    }
  };

  if (status === "pending") return <div>Loading users...</div>;
  if (status === "error") return <div>Error loading users</div>;

  return (
    <div className="">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex items-center">
          <Link
            href="/users/new"
            style={{ color: "white" }}
            className="bg-blue-500 text-white px-4 py-2 rounded inline-flex items-center gap-2 mr-2"
          >
            <Plus size={20} /> Create New User
          </Link>
          <button
            onClick={() => refetch()}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Refresh Users
          </button>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <ul className="grid grid-cols-1 gap-4 items-center w-full max-w-2xl">
          {users?.map((user: User) => (
            <UserCard key={user.id} user={user} handleDelete={handleDelete} />
          ))}
        </ul>
      </div>
    </div>
  );
}
