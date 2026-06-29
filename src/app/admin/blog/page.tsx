import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Blog Posts</h1>
        {/* Placeholder for future Add Post button */}
        <button className="bg-black text-white px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90">
          + Add Post
        </button>
      </div>
      
      {posts.length === 0 ? (
        <p className="text-gray-500">No blog posts found. Please run the migration script.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-medium text-sm text-gray-500">Title</th>
                <th className="p-4 font-medium text-sm text-gray-500">Category</th>
                <th className="p-4 font-medium text-sm text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold">{post.title}</p>
                    <p className="text-xs text-gray-500 truncate w-64">{post.slug}</p>
                  </td>
                  <td className="p-4 text-gray-600">{post.category}</td>
                  <td className="p-4 text-gray-500">{post.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
