import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">CRUD Application</h1>
      <div className="flex space-x-4">
        <Link
          href="/posts"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          style={{ color: "white" }}
        >
          Posts
        </Link>
        <Link
          href="/users"
          className="bg-green-500 px-4 py-2 rounded"
          style={{ color: "white" }}
        >
          Users
        </Link>
      </div>
      <div className="flex gap-1 items-center mt-2">
        <h6> By: </h6>
        <h4 className="font-bold italic"> Kyrolos Magdy </h4>
      </div>
    </main>
  );
}
