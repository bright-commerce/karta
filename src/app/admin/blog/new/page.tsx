import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import { ImageUploader } from "./ImageUploader";

export default function NewBlogPostPage() {
  async function createPost(formData: FormData) {
    "use server";
    
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const imageUrl = formData.get("imageUrl") as string;

    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category: category || "General",
        imageUrl: imageUrl || "",
        date,
      }
    });

    redirect("/admin/blog");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-black">Add New Blog Post</h1>
      </div>

      <div className="bg-white dark:bg-[#1E1E2D] rounded-xl border border-gray-200 dark:border-[#2B2B40] shadow-sm p-6">
        <form action={createPost} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Post Title</label>
              <input type="text" name="title" required className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Slug</label>
              <input type="text" name="slug" required placeholder="my-awesome-post" className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
            <input type="text" name="excerpt" required className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input type="text" name="category" placeholder="e.g. Updates, Tutorials" className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image</label>
              <ImageUploader />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Markdown supported)</label>
            <textarea name="content" required rows={10} className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white font-mono text-sm"></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-[#3699FF] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
