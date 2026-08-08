import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import bcrypt from "bcryptjs";

export default function NewSellerPage() {
  async function createSeller(formData: FormData) {
    "use server";
    
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("A user with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        name: username,
        password: hashedPassword,
        role: "SELLER",
      }
    });

    redirect("/admin/users");
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/sellers" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-black">Add New Seller</h1>
      </div>

      <div className="bg-white dark:bg-[#1E1E2D] rounded-xl border border-gray-200 dark:border-[#2B2B40] shadow-sm p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Directly onboard a seller by creating an account for them. Their password will be securely hashed before saving.
        </p>

        <form action={createSeller} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input type="email" name="email" required className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username (Name)</label>
            <input type="text" name="username" required className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Password</label>
            <input type="password" name="password" required className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-[#3699FF] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Create Seller Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
