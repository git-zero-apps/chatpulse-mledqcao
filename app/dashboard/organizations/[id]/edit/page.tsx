"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditOrganizationPage() {
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
        .from("organizations")
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
      name: formData.get("name"),
      owner_id: formData.get("owner_id"),
      subscription_plan: formData.get("subscription_plan"),
      subscription_status: formData.get("subscription_status"),
      stripe_customer_id: formData.get("stripe_customer_id"),
      stripe_subscription_id: formData.get("stripe_subscription_id"),
      agent_limit: formData.get("agent_limit") ? Number(formData.get("agent_limit")) : null,
      conversation_limit: formData.get("conversation_limit") ? Number(formData.get("conversation_limit")) : null,
    };

    const { error: updateError } = await supabase
      .from("organizations")
      .update(updates)
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/organizations");
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
        <p className="text-sm text-red-700">Organization not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/organizations" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Organizations
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Organization</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" name="name" type="text" className="input" defaultValue={String(record.name ?? "")} required />
        </div>
        <div>
          <label htmlFor="owner_id" className="label">Owner Id</label>
          <input id="owner_id" name="owner_id" type="text" className="input" defaultValue={String(record.owner_id ?? "")} required />
        </div>
        <div>
          <label htmlFor="subscription_plan" className="label">Subscription Plan</label>
          <input id="subscription_plan" name="subscription_plan" type="text" className="input" defaultValue={String(record.subscription_plan ?? "")} />
        </div>
        <div>
          <label htmlFor="subscription_status" className="label">Subscription Status</label>
          <input id="subscription_status" name="subscription_status" type="text" className="input" defaultValue={String(record.subscription_status ?? "")} />
        </div>
        <div>
          <label htmlFor="stripe_customer_id" className="label">Stripe Customer Id</label>
          <input id="stripe_customer_id" name="stripe_customer_id" type="text" className="input" defaultValue={String(record.stripe_customer_id ?? "")} />
        </div>
        <div>
          <label htmlFor="stripe_subscription_id" className="label">Stripe Subscription Id</label>
          <input id="stripe_subscription_id" name="stripe_subscription_id" type="text" className="input" defaultValue={String(record.stripe_subscription_id ?? "")} />
        </div>
        <div>
          <label htmlFor="agent_limit" className="label">Agent Limit</label>
          <input id="agent_limit" name="agent_limit" type="number" className="input" defaultValue={String(record.agent_limit ?? "")} />
        </div>
        <div>
          <label htmlFor="conversation_limit" className="label">Conversation Limit</label>
          <input id="conversation_limit" name="conversation_limit" type="number" className="input" defaultValue={String(record.conversation_limit ?? "")} />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Update Organization"}
          </button>
          <Link href="/dashboard/organizations" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
