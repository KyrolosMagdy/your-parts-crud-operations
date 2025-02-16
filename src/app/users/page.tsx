import UserList from "@/components/UserList";

export default function UsersPage() {
  return (
    <div data-testid="users-page-wrapper" className="container mx-auto p-4">
      <UserList />
    </div>
  );
}
