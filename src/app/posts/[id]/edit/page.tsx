"use client";
import EditPostForm from "@/components/EditPostForm";
import { use } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function EditPostPage({ params }: PageProps) {
  const resolvedParams = use(params);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <EditPostForm postId={resolvedParams.id} />
    </div>
  );
}
