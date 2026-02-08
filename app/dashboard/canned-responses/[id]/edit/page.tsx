"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditCannedResponsPage() {
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
        .from("canned_responses")
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
      title: formData.get("title"),
      body: formData.get("body"),
      shortcut_code: formData.get("shortcut_code"),
      category: formData.get("category"),
      use_count: formData.get("use_count") ? Number(formData.get("use_count")) : null,
      created_by: formData.get("created_by"),
    };

    const { error: updateError } = await supabase
      .from("canned_responses")
      .update(updates)
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/canned-responses");
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
        <p className="text-sm text-red-700">Canned Respons not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/canned-responses" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Canned Responses
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Canned Respons</h1>
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
          <label htmlFor="title" className="label">Title</label>
          <input id="title" name="title" type="text" className="input" defaultValue={String(record.title ?? "")} required />
        </div>
        <div>
          <label htmlFor="body" className="label">Body</label>
          <textarea id="body" name="body" rows={4} className="input" defaultValue={String(record.body ?? "")} required />
        </div>
        <div>
          <label htmlFor="shortcut_code" className="label">Shortcut Code</label>
          <input id="shortcut_code" name="shortcut_code" type="text" className="input" defaultValue={String(record.shortcut_code ?? "")} required />
        </div>
        <div>
          <label htmlFor="category" className="label">Category</label>
          <input id="category" name="category" type="text" className="input" defaultValue={String(record.category ?? "")} />
        </div>
        <div>
          <label htmlFor="use_count" className="label">Use Count</label>
          <input id="use_count" name="use_count" type="number" className="input" defaultValue={String(record.use_count ?? "")} />
        </div>
        <div>
          <label htmlFor="created_by" className="label">Created By</label>
          <input id="created_by" name="created_by" type="text" className="input" defaultValue={String(record.created_by ?? "")} />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Update Canned Respons"}
          </button>
          <Link href="/dashboard/canned-responses" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
