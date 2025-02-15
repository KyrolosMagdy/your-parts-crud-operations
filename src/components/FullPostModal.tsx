import type React from "react";
import { useQuery } from "@tanstack/react-query";
import { PostService, type Post } from "@/services/api";
import { X } from "lucide-react";

interface FullPostModalProps {
  postId: number;
  onClose: () => void;
}

const FullPostModal: React.FC<FullPostModalProps> = ({ postId, onClose }) => {
  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => PostService.getPost(postId).then((res) => res.data),
  });

  if (isLoading) return <div className="text-center">Loading post...</div>;
  if (error) return <div className="text-center">Error loading post</div>;
  if (!post) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center p-4 z-50 overflow-hidden overflow-y-hidden">
      <div
        onClick={onClose}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "absolute",
          overflowY: "hidden",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: 10,
        }}
      ></div>
      <div
        className="bg-white rounded-lg p-6 max-w-2xl z-50 w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "white" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{post.body}</p>
      </div>
    </div>
  );
};

export default FullPostModal;
