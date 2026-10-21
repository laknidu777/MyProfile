"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Save, CheckCircle2, AlertCircle, Share2, MessageSquare } from "lucide-react";
import { ContactSettingsInput, contactSettingsSchema } from "@/lib/validations";
import { updateContactSettings } from "@/actions/settings";

interface ContactManagerProps {
  initialSettings: Record<string, string>;
}

export default function ContactManager({ initialSettings }: ContactManagerProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ContactSettingsInput>({
    contact_email: initialSettings["contact_email"] || "hello@example.com",
    contact_github: initialSettings["contact_github"] || "https://github.com",
    contact_linkedin: initialSettings["contact_linkedin"] || "https://linkedin.com",
    contact_twitter: initialSettings["contact_twitter"] || "https://twitter.com",
    contact_title: initialSettings["contact_title"] || "Let's build something amazing together.",
    contact_description:
      initialSettings["contact_description"] ||
      "Whether you have a freelance project, a research opportunity, or just want to say hi, my inbox is always open. I'll try my best to get back to you!",
  });

  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    const parsed = contactSettingsSchema.safeParse(formData);
    if (!parsed.success) {
      setNotice({
        type: "error",
        text: parsed.error.issues[0]?.message || "Validation failed",
      });
      return;
    }

    startTransition(async () => {
      const res = await updateContactSettings(formData);
      if (res.success) {
        setNotice({ type: "success", text: "Contact and social settings saved successfully!" });
        router.refresh();
        setTimeout(() => setNotice(null), 3000);
      } else {
        setNotice({ type: "error", text: res.error || "Failed to update contact settings" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-16">
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Contact & Social Links</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your public communication channels, GitHub, LinkedIn, and social profiles
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 self-start sm:self-auto"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          <span>Save Contact Info</span>
        </button>
      </div>

      {/* Contact Channels */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Mail size={16} />
          <span>Direct Contact Details</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Primary Contact Email *
          </label>
          <input
            type="email"
            required
            value={formData.contact_email}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_email: e.target.value }))}
            placeholder="hello@example.com"
            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Social Profiles */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Share2 size={16} />
          <span>Professional Social Links</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              GitHub Profile URL
            </label>
            <input
              type="url"
              value={formData.contact_github || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, contact_github: e.target.value }))}
              placeholder="https://github.com/laknidu777"
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={formData.contact_linkedin || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, contact_linkedin: e.target.value }))
              }
              placeholder="https://linkedin.com/in/..."
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Twitter / X Profile URL
            </label>
            <input
              type="url"
              value={formData.contact_twitter || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, contact_twitter: e.target.value }))
              }
              placeholder="https://twitter.com/..."
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Section Headings */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <MessageSquare size={16} />
          <span>Contact Section Presentation</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Section Callout Title
          </label>
          <input
            type="text"
            value={formData.contact_title || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_title: e.target.value }))}
            placeholder="e.g. Let's build something amazing together."
            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Section Body Text
          </label>
          <textarea
            rows={3}
            value={formData.contact_description || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, contact_description: e.target.value }))
            }
            placeholder="Subtext displayed on the contact section..."
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>
      </div>
    </form>
  );
}
