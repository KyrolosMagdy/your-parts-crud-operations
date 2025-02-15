import { PostService } from "@/services/api";
import EditPostForm from "@/components/EditPostForm";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const postId = Number(resolvedParams.id);
  const initialPost = await PostService.getPost(postId).then((res) => res.data);
  console.log(postId);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <EditPostForm initialPost={initialPost} />
    </div>
  );
}
