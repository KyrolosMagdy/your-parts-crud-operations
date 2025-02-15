import React from "react";
import EditUserClient from "@/components/EditUserClient";

export default function EditUserPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(Promise.resolve(params));
  return <EditUserClient userId={resolvedParams.id} />;
}
