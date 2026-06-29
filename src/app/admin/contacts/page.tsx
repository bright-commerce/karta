import { prisma } from "@/lib/prisma";
import ContactReplyForm from "./ContactReplyForm";

export const dynamic = "force-dynamic";

export default async function ContactsAdminPage() {
  const contacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Contact Submissions</h1>
      
      {contacts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No contact messages yet.</p>
      ) : (
        <div className="grid gap-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{contact.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  contact.status === 'REPLIED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {contact.status}
                </span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-lg mb-4 text-sm text-gray-800 whitespace-pre-wrap">
                {contact.message}
              </div>

              {contact.status === 'UNREAD' && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h4 className="font-semibold text-sm mb-2">Reply to {contact.name}</h4>
                  <ContactReplyForm contactId={contact.id} email={contact.email} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
