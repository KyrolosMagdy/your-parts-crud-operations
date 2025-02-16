import { Post } from "@/services/api";
import usePostsStore from "@/store/usePostsStore";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export const PostCard = ({
  post,
  index,
  needsExpansion,
  toggleExpand,
  handleDelete,
  expandedPost,
}: {
  post: Post;
  index: number;
  needsExpansion: (body: string) => boolean;
  toggleExpand: (id: number) => void;
  expandedPost: number | null;
  handleDelete: (id: number, e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const { setSelectedPostId } = usePostsStore();
  return (
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
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPostId(post.id);
          }}
          className="text-green-500 hover:underline flex items-center gap-1"
        >
          <Pencil size={16} /> Edit
        </Link>
      </div>
    </li>
  );
};
