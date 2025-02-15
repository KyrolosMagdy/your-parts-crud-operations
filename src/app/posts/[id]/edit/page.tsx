import EditPostForm from "@/components/EditPostForm";

export default function EditPostPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <EditPostForm postId={params.id} />
    </div>
  );
}
