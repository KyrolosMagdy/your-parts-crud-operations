import UserForm from "@/components/UserForm";

export default function NewUserPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New User</h1>
      <UserForm />
    </div>
  );
}
