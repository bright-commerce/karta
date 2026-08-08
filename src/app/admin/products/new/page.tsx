import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  async function createProduct(formData: FormData) {
    "use server";
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const fileUrl = formData.get("fileUrl") as string;
    const imageUrl = formData.get("imageUrl") as string;

    await prisma.product.create({
      data: {
        title,
        description,
        price,
        category: category || "Uncategorized",
        fileUrl: fileUrl || "/dummy-file.zip",
        imageUrl: imageUrl || "",
        isActive: true,
      }
    });

    redirect("/admin/products");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-black">Add New Product</h1>
      </div>

      <div className="bg-white dark:bg-[#1E1E2D] rounded-xl border border-gray-200 dark:border-[#2B2B40] shadow-sm p-6">
        <form action={createProduct} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Title</label>
            <input type="text" name="title" required className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" required rows={4} className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
              <input type="number" step="0.01" name="price" required className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input type="text" name="category" placeholder="e.g. Software, E-books" className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
              <input type="url" name="imageUrl" placeholder="https://..." className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File URL (Download)</label>
              <input type="text" name="fileUrl" placeholder="/path/to/file.zip" className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-[#3699FF] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
