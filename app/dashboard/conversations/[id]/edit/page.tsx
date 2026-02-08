"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditConversationPage() {
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
        .from("conversations")
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
      organization_id: formData.get("organization_id"),
      visitor_id: formData.get("visitor_id"),
      assigned_agent_id: formData.get("assigned_agent_id"),
      status: formData.get("status"),
      channel: formData.get("channel"),
      started_at: formData.get("started_at"),
      ended_at: formData.get("ended_at"),
      rating: formData.get("rating") ? Number(formData.get("rating")) : null,
      tags: formData.get("tags"),
      visitor_name: formData.get("visitor_name"),
      visitor_email: formData.get("visitor_email"),
      first_response_time_seconds: formData.get("first_response_time_seconds") ? Number(formData.get("first_response_time_seconds")) : null,
    };

    const { error: updateError } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/conversations");
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
        <p className="text-sm text-red-700">Conversation not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/conversations" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Conversations
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Conversation</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="organization_id" className="label">Organization Id</label>
          <input id="organization_id" name="organization_id" type="text" className="input" defaultValue={String(record.organization_id ?? "")} required />
        </div>
        <div>
          <label htmlFor="visitor_id" className="label">Visitor Id</label>
          <input id="visitor_id" name="visitor_id" type="text" className="input" defaultValue={String(record.visitor_id ?? "")} required />
        </div>
        <div>
          <label htmlFor="assigned_agent_id" className="label">Assigned Agent Id</label>
          <input id="assigned_agent_id" name="assigned_agent_id" type="text" className="input" defaultValue={String(record.assigned_agent_id ?? "")} />
        </div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <input id="status" name="status" type="text" className="input" defaultValue={String(record.status ?? "")} />
        </div>
        <div>
          <label htmlFor="channel" className="label">Channel</label>
          <input id="channel" name="channel" type="text" className="input" defaultValue={String(record.channel ?? "")} />
        </div>
        <div>
          <label htmlFor="started_at" className="label">Started At</label>
          <input id="started_at" name="started_at" type="datetime-local" className="input" defaultValue={String(record.started_at ?? "")} />
        </div>
        <div>
          <label htmlFor="ended_at" className="label">Ended At</label>
          <input id="ended_at" name="ended_at" type="datetime-local" className="input" defaultValue={String(record.ended_at ?? "")} />
        </div>
        <div>
          <label htmlFor="rating" className="label">Rating</label>
          <input id="rating" name="rating" type="number" className="input" defaultValue={String(record.rating ?? "")} />
        </div>
        <div>
          <label htmlFor="tags" className="label">Tags</label>
          <input id="tags" name="tags" type="text" className="input" defaultValue={String(record.tags ?? "")} />
        </div>
        <div>
          <label htmlFor="visitor_name" className="label">Visitor Name</label>
          <input id="visitor_name" name="visitor_name" type="text" className="input" defaultValue={String(record.visitor_name ?? "")} />
        </div>
        <div>
          <label htmlFor="visitor_email" className="label">Visitor Email</label>
          <input id="visitor_email" name="visitor_email" type="email" className="input" defaultValue={String(record.visitor_email ?? "")} />
        </div>
        <div>
          <label htmlFor="first_response_time_seconds" className="label">First Response Time Seconds</label>
          <input id="first_response_time_seconds" name="first_response_time_seconds" type="number" className="input" defaultValue={String(record.first_response_time_seconds ?? "")} />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Update Conversation"}
          </button>
          <Link href="/dashboard/conversations" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
