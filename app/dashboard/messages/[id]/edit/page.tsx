"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditMessagePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchRecord() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) setError(error.message);
      else setRecord(data);
      setFetching(false);
    }
    fetchRecord();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const updates: Record<string, unknown> = {
      conversation_id: formData.get("conversation_id"),
      sender_type: formData.get("sender_type"),
      sender_id: formData.get("sender_id"),
      body: formData.get("body"),
      attachments: formData.get("attachments"),
      read: formData.get("read") === "on",
      sent_at: formData.get("sent_at"),
    };

    const { error: updateError } = await supabase
      .from("messages")
      .update(updates)
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/messages");
      router.refresh();
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-sm text-red-700">Message not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/messages" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Messages
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Message</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="conversation_id" className="label">Conversation Id</label>
          <input id="conversation_id" name="conversation_id" type="text" className="input" defaultValue={String(record.conversation_id ?? "")} required />
        </div>
        <div>
          <label htmlFor="sender_type" className="label">Sender Type</label>
          <input id="sender_type" name="sender_type" type="text" className="input" defaultValue={String(record.sender_type ?? "")} required />
        </div>
        <div>
          <label htmlFor="sender_id" className="label">Sender Id</label>
          <input id="sender_id" name="sender_id" type="text" className="input" defaultValue={String(record.sender_id ?? "")} />
        </div>
        <div>
          <label htmlFor="body" className="label">Body</label>
          <textarea id="body" name="body" rows={4} className="input" defaultValue={String(record.body ?? "")} required />
        </div>
        <div>
          <label htmlFor="attachments" className="label">Attachments</label>
          <input id="attachments" name="attachments" type="text" className="input" defaultValue={String(record.attachments ?? "")} />
        </div>
        <div className="flex items-center gap-3">
          <input id="read" name="read" type="checkbox" defaultChecked={!!record.read} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          <label htmlFor="read" className="text-sm font-medium text-gray-700">Read</label>
        </div>
        <div>
          <label htmlFor="sent_at" className="label">Sent At</label>
          <input id="sent_at" name="sent_at" type="datetime-local" className="input" defaultValue={String(record.sent_at ?? "")} />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Update Message"}
          </button>
          <Link href="/dashboard/messages" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
