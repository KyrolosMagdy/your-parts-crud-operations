import React from "react";
import EditUserClient from "@/components/EditUserClient";
interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default function EditUserPage({ params }: PageProps) {
  const resolvedParams = React.use(Promise.resolve(params));
  return <EditUserClient userId={resolvedParams.id} />;
}
