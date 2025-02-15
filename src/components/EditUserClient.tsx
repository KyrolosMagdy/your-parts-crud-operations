"use client";

import { useQuery } from "@tanstack/react-query";
import UserForm from "@/components/UserForm";
import { UserService, type User } from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";

interface EditUserClientProps {
  userId: string;
}

export default function EditUserClient({ userId }: EditUserClientProps) {
  const numericUserId = Number.parseInt(userId, 10);

  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => UserService.getUsers().then((res) => res.data),
  });

  const userQuery = useQuery<User | null>({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (numericUserId < 0) {
        // This is a temporary user, fetch from the cache
        const tempUser = usersQuery.data?.find((u) => u.id === numericUserId);
        return tempUser || null;
      }
      try {
        const response = await UserService.getUser(numericUserId);
        return response.data;
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
    enabled: usersQuery.isSuccess, // Only run this query after usersQuery has completed
  });

  const isLoading = usersQuery.isLoading || userQuery.isLoading;
  const error = usersQuery.error || userQuery.error;
  const user = userQuery.data;

  if (isLoading) return <LoadingSpinner isLoading={true} />;
  if (error) return <div>Error loading user: {(error as Error).message}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <UserForm user={user} />
    </div>
  );
}
