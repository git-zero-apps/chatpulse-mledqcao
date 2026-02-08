"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditWidgetSettingPage() {
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
        .from("widget_settings")
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
      position: formData.get("position"),
      primary_color: formData.get("primary_color"),
      greeting_message: formData.get("greeting_message"),
      offline_message: formData.get("offline_message"),
      business_hours_enabled: formData.get("business_hours_enabled") === "on",
      business_hours: formData.get("business_hours"),
      avatar_url: formData.get("avatar_url"),
      logo_url: formData.get("logo_url"),
      show_branding: formData.get("show_branding") === "on",
      widget_code: formData.get("widget_code"),
    };

    const { error: updateError } = await supabase
      .from("widget_settings")
      .update(updates)
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/widget-settings");
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
        <p className="text-sm text-red-700">Widget Setting not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/widget-settings" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Widget Settings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Widget Setting</h1>
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
          <label htmlFor="position" className="label">Position</label>
          <input id="position" name="position" type="text" className="input" defaultValue={String(record.position ?? "")} />
        </div>
        <div>
          <label htmlFor="primary_color" className="label">Primary Color</label>
          <input id="primary_color" name="primary_color" type="text" className="input" defaultValue={String(record.primary_color ?? "")} />
        </div>
        <div>
          <label htmlFor="greeting_message" className="label">Greeting Message</label>
          <input id="greeting_message" name="greeting_message" type="text" className="input" defaultValue={String(record.greeting_message ?? "")} />
        </div>
        <div>
          <label htmlFor="offline_message" className="label">Offline Message</label>
          <input id="offline_message" name="offline_message" type="text" className="input" defaultValue={String(record.offline_message ?? "")} />
        </div>
        <div className="flex items-center gap-3">
          <input id="business_hours_enabled" name="business_hours_enabled" type="checkbox" defaultChecked={!!record.business_hours_enabled} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          <label htmlFor="business_hours_enabled" className="text-sm font-medium text-gray-700">Business Hours Enabled</label>
        </div>
        <div>
          <label htmlFor="business_hours" className="label">Business Hours</label>
          <input id="business_hours" name="business_hours" type="text" className="input" defaultValue={String(record.business_hours ?? "")} />
        </div>
        <div>
          <label htmlFor="avatar_url" className="label">Avatar Url</label>
          <input id="avatar_url" name="avatar_url" type="url" className="input" defaultValue={String(record.avatar_url ?? "")} />
        </div>
        <div>
          <label htmlFor="logo_url" className="label">Logo Url</label>
          <input id="logo_url" name="logo_url" type="url" className="input" defaultValue={String(record.logo_url ?? "")} />
        </div>
        <div className="flex items-center gap-3">
          <input id="show_branding" name="show_branding" type="checkbox" defaultChecked={!!record.show_branding} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          <label htmlFor="show_branding" className="text-sm font-medium text-gray-700">Show Branding</label>
        </div>
        <div>
          <label htmlFor="widget_code" className="label">Widget Code</label>
          <input id="widget_code" name="widget_code" type="text" className="input" defaultValue={String(record.widget_code ?? "")} required />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Update Widget Setting"}
          </button>
          <Link href="/dashboard/widget-settings" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
