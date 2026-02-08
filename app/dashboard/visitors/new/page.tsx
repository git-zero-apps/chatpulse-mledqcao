"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function NewVisitorPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const record: Record<string, unknown> = {
      organization_id: formData.get("organization_id"),
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      location: formData.get("location"),
      browser: formData.get("browser"),
      current_page_url: formData.get("current_page_url"),
      first_seen_at: formData.get("first_seen_at"),
      last_seen_at: formData.get("last_seen_at"),
      total_conversations: formData.get("total_conversations") ? Number(formData.get("total_conversations")) : null,
      notes: formData.get("notes"),
    };

    const { error: insertError } = await supabase.from("visitors").insert(record);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/visitors");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/visitors" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Visitors
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Visitor</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="organization_id" className="label">Organization Id</label>
          <input id="organization_id" name="organization_id" type="text" className="input" placeholder="Enter organization id" required />
        </div>
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" name="name" type="text" className="input" placeholder="Enter name" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" className="input" placeholder="Enter email" />
        </div>
        <div>
          <label htmlFor="company" className="label">Company</label>
          <input id="company" name="company" type="text" className="input" placeholder="Enter company" />
        </div>
        <div>
          <label htmlFor="location" className="label">Location</label>
          <input id="location" name="location" type="text" className="input" placeholder="Enter location" />
        </div>
        <div>
          <label htmlFor="browser" className="label">Browser</label>
          <input id="browser" name="browser" type="text" className="input" placeholder="Enter browser" />
        </div>
        <div>
          <label htmlFor="current_page_url" className="label">Current Page Url</label>
          <input id="current_page_url" name="current_page_url" type="url" className="input" placeholder="Enter current page url" />
        </div>
        <div>
          <label htmlFor="first_seen_at" className="label">First Seen At</label>
          <input id="first_seen_at" name="first_seen_at" type="datetime-local" className="input" placeholder="Enter first seen at" />
        </div>
        <div>
          <label htmlFor="last_seen_at" className="label">Last Seen At</label>
          <input id="last_seen_at" name="last_seen_at" type="datetime-local" className="input" placeholder="Enter last seen at" />
        </div>
        <div>
          <label htmlFor="total_conversations" className="label">Total Conversations</label>
          <input id="total_conversations" name="total_conversations" type="number" className="input" placeholder="Enter total conversations" />
        </div>
        <div>
          <label htmlFor="notes" className="label">Notes</label>
          <textarea id="notes" name="notes" rows={4} className="input" placeholder="Enter notes" />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Create Visitor"}
          </button>
          <Link href="/dashboard/visitors" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
