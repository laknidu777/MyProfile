"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Settings, Save, CheckCircle2, AlertCircle, Database, Server, Shield } from "lucide-react";
import { updateSiteGeneralSettings } from "@/actions/settings";

interface SiteSettingsManagerProps {
  initialSettings: Record<string, string>;
  diagnostics: {
    projectsCount: number;
    experienceCount: number;
    skillsCount: number;
    settingsCount: number;
    dbProvider: string;
  };
}

export default function SiteSettingsManager({
  initialSettings,
  diagnostics,
}: SiteSettingsManagerProps) {
  const router = useRouter();

  const [siteTitle, setSiteTitle] = useState(
    initialSettings["site_title"] || "Laknidu Thilakawardhana | Software Engineer & Researcher"
  );
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(
    initialSettings["google_analytics_id"] || ""
  );

  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    startTransition(async () => {
      const res = await updateSiteGeneralSettings({
        site_title: siteTitle,
        google_analytics_id: googleAnalyticsId,
      });

      if (res.success) {
        setNotice({ type: "success", text: "Site settings updated successfully!" });
        router.refresh();
        setTimeout(() => setNotice(null), 3000);
      } else {
        setNotice({ type: "error", text: res.error || "Failed to update settings" });
      }
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {notice && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-sm transition-all ${
            notice.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs uppercase tracking-wider font-semibold opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Website Settings</h1>
          <p className="text-sm text-gray-400 mt-1">
            Configure site metadata, general preferences, and review database health
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 self-start sm:self-auto"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          <span>Save Settings</span>
        </button>
      </div>

      {/* General Configuration Form */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Settings size={16} />
          <span>General Metadata</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Default Browser Title
          </label>
          <input
            type="text"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            placeholder="Laknidu Thilakawardhana | Software Engineer & Researcher"
            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Analytics Measurement ID (Optional)
          </label>
          <input
            type="text"
            value={googleAnalyticsId}
            onChange={(e) => setGoogleAnalyticsId(e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Database & Infrastructure Diagnostics */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Database size={16} />
          <span>System & Database Diagnostics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Total Projects</div>
            <div className="text-2xl font-bold text-white mt-1">{diagnostics.projectsCount}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Experience Items</div>
            <div className="text-2xl font-bold text-white mt-1">{diagnostics.experienceCount}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Catalog Skills</div>
            <div className="text-2xl font-bold text-white mt-1">{diagnostics.skillsCount}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Saved Settings</div>
            <div className="text-2xl font-bold text-white mt-1">{diagnostics.settingsCount}</div>
          </div>
        </div>

        <div className="space-y-3 pt-2 text-xs text-gray-400">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="flex items-center gap-2">
              <Database size={14} className="text-emerald-400" />
              <span>Database Engine</span>
            </span>
            <span className="font-mono text-white">PostgreSQL 17 (Prisma v7.10.1 PG Adapter)</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="flex items-center gap-2">
              <Server size={14} className="text-indigo-400" />
              <span>Application Framework</span>
            </span>
            <span className="font-mono text-white">Next.js 16 (App Router) &bull; React 19</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="flex items-center gap-2">
              <Shield size={14} className="text-purple-400" />
              <span>Authentication Mechanism</span>
            </span>
            <span className="font-mono text-white">NextAuth v5 (Bcrypt + JWT 8h)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
