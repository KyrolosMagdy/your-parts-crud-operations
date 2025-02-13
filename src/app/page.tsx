import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">CRUD Application</h1>
      <div className="flex space-x-4">
        <Link href="/posts" className="bg-blue-500 text-white px-4 py-2 rounded">
          Posts
        </Link>
        <Link href="/users" className="bg-green-500 text-white px-4 py-2 rounded">
          Users
        </Link>
      </div>
      <h6 className="mt-2"> By: Kyrolos Magdy </h6>
    </main>
  )
}

