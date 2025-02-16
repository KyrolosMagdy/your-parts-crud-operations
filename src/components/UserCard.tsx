import { User } from "@/services/api";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import Link from "next/link";

export const UserCard = ({
  user,
  handleDelete,
}: {
  user: User;
  handleDelete: (id: number) => void;
}) => {
  return (
    <li key={user.id} className="border p-4 w-full rounded-xl">
      <h2 className="text-xl font-semibold">{user.name}</h2>
      <p className="mt-2">{user.email}</p>
      <p>{user.phone}</p>
      <div className="mt-4 flex w-full justify-between">
        <Link
          href={`/users/${user.id}/edit`}
          className="text-green-500 hover:underline inline-flex items-center"
        >
          <Pencil size={16} className="mr-1" /> Edit
        </Link>
        <button
          onClick={() => handleDelete(user.id)}
          className="text-red-500 hover:underline inline-flex items-center"
        >
          <Trash2 size={16} className="mr-1" /> Delete
        </button>
      </div>
    </li>
  );
};
