export const dynamic = "force-dynamic";

export default function SettingsAdminPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8">Settings</h1>
      
      <div className="bg-white dark:bg-[#1E1E2D] rounded-xl border border-gray-200 dark:border-[#2B2B40] shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Name</label>
            <input type="text" defaultValue="Karta" className="w-full max-w-md px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
            <input type="email" defaultValue="admin@bykarta.com" className="w-full max-w-md px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
          </div>
          <button className="bg-[#3699FF] text-white px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E2D] rounded-xl border border-gray-200 dark:border-[#2B2B40] shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">API Keys & Integrations</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your Cashfree and Cloudflare R2 credentials via environment variables in Easypanel.</p>
          <div className="p-4 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg text-sm text-gray-700 dark:text-gray-300 font-mono">
            CASHFREE_APP_ID=***<br/>
            CASHFREE_SECRET_KEY=***<br/>
            R2_ACCESS_KEY_ID=***
          </div>
        </div>
      </div>
    </div>
  );
}
