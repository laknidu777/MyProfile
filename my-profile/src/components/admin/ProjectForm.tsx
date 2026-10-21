"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Wand2,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
  Layers,
  FileText,
  Link2,
  Code2,
  Sliders,
} from "lucide-react";
import { ProjectCategory } from "@/types/project";
import { ProjectInput, projectSchema } from "@/lib/validations";
import { createProject, updateProject } from "@/actions/projects";

interface ProjectFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    description: string;
    category: ProjectCategory;
    imageUrl?: string | null;
    projectUrl?: string | null;
    githubUrl?: string | null;
    technologies: string[];
    featured: boolean;
    published: boolean;
    sortOrder: number;
    client?: string | null;
    role?: string | null;
    impact?: string | null;
    statusText?: string | null;
  };
  defaultCategory?: ProjectCategory;
}

export default function ProjectForm({ initialData, defaultCategory }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<ProjectInput>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    summary: initialData?.summary || "",
    description: initialData?.description || "",
    category: initialData?.category || defaultCategory || ProjectCategory.PERSONAL,
    imageUrl: initialData?.imageUrl || "",
    projectUrl: initialData?.projectUrl || "",
    githubUrl: initialData?.githubUrl || "",
    technologies: initialData?.technologies || [],
    featured: initialData?.featured || false,
    published: initialData?.published || false,
    sortOrder: initialData?.sortOrder ?? 0,
    client: initialData?.client || "",
    role: initialData?.role || "",
    impact: initialData?.impact || "",
    statusText: initialData?.statusText || "",
  });

  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Helper to auto-generate slug from title
  const generateSlug = () => {
    if (!formData.title) return;
    const generated = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug: generated }));
  };

  // Add technology tag
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.technologies.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, trimmed],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tagToRemove),
    }));
  };

  const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate client-side first
    const parsed = projectSchema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Please correct form errors.");
      return;
    }

    startTransition(async () => {
      let res;
      if (isEditing && initialData?.id) {
        res = await updateProject(initialData.id, formData);
      } else {
        res = await createProject(formData);
      }

      if (res.success) {
        setSuccess(isEditing ? "Project updated successfully!" : "Project created successfully!");
        setTimeout(() => {
          router.push("/admin/projects");
          router.refresh();
        }, 800);
      } else {
        setError(res.error || "Failed to save project.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isEditing ? `Edit: ${initialData.title}` : "Create New Project"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Fill in the information below to add or modify this project.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{isEditing ? "Update Project" : "Save Project"}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-emerald-300 text-sm">
          <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* SECTION 1: Basic Information */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Layers size={16} />
          <span>Section 1 &bull; Basic Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Neon Nexus"
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                URL Slug *
              </label>
              <button
                type="button"
                onClick={generateSlug}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Wand2 size={12} />
                <span>Auto-generate</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase() }))}
              placeholder="e.g. neon-nexus"
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Short Summary */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Short Summary *
          </label>
          <input
            type="text"
            required
            value={formData.summary}
            onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
            placeholder="A concise 1-2 sentence overview shown in project cards and previews"
            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* SECTION 2: Category & Category Details */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Layers size={16} />
          <span>Section 2 &bull; Category & Details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value as ProjectCategory }))
              }
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value={ProjectCategory.FREELANCE} className="bg-[#0e0f17]">
                Freelance & Client Work
              </option>
              <option value={ProjectCategory.PERSONAL} className="bg-[#0e0f17]">
                Personal Projects & Open Source
              </option>
              <option value={ProjectCategory.RESEARCH} className="bg-[#0e0f17]">
                Research & Publications
              </option>
              <option value={ProjectCategory.GAME} className="bg-[#0e0f17]">
                Games & Interactive Experiments
              </option>
            </select>
          </div>

          {/* Status Text */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Badge / Status Text (Optional)
            </label>
            <input
              type="text"
              value={formData.statusText || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, statusText: e.target.value }))}
              placeholder="e.g. Completed, In Progress, Playable Prototype, Experimental"
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category-specific fields */}
        {formData.category === ProjectCategory.FREELANCE && (
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-4">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Freelance Client Metadata
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-300 mb-1">Client Name</label>
                <input
                  type="text"
                  value={formData.client || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value }))}
                  placeholder="e.g. Global Finance Tech"
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Your Role</label>
                <input
                  type="text"
                  value={formData.role || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g. Lead Frontend Developer"
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">Key Impact / Metric</label>
              <input
                type="text"
                value={formData.impact || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, impact: e.target.value }))}
                placeholder="e.g. Improved perceived load time by 300% and increased conversion by 18%"
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {formData.category === ProjectCategory.RESEARCH && (
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Publication Metadata
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-300 mb-1">Authors</label>
                <input
                  type="text"
                  value={formData.role || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g. Laknidu Thilakawardhana, Dr. Jane Smith"
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Venue / Conference & Year</label>
                <input
                  type="text"
                  value={formData.impact || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, impact: e.target.value }))}
                  placeholder="e.g. ACM CHI 2023 / IEEE UIST 2021"
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Description */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <FileText size={16} />
          <span>Section 3 &bull; Detailed Description</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Full Description *
          </label>
          <textarea
            required
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Detailed description of features, technical challenges solved, architecture, and results..."
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>
      </div>

      {/* SECTION 4: Media and Links */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Link2 size={16} />
          <span>Section 4 &bull; Media & Links</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cover Image URL */}
          <div className="space-y-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
            {formData.imageUrl && (
              <div className="mt-2 rounded-xl overflow-hidden border border-white/10 h-28 bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Live URL */}
          <div className="space-y-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Live Demo / Project URL
            </label>
            <input
              type="url"
              value={formData.projectUrl || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, projectUrl: e.target.value }))}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* GitHub URL */}
          <div className="space-y-2 md:col-span-1">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              GitHub / Source Code URL
            </label>
            <input
              type="url"
              value={formData.githubUrl || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
              placeholder="https://github.com/laknidu777/..."
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: Technologies */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Code2 size={16} />
          <span>Section 5 &bull; Technologies & Tags</span>
        </div>

        <p className="text-xs text-gray-400">
          Add tags one by one. Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Enter</kbd> or click &quot;Add&quot;.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDownTag}
            placeholder="Type technology (e.g. Next.js, TypeScript, Three.js)..."
            className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>

        {/* Tags List */}
        <div className="flex flex-wrap gap-2 pt-2">
          {formData.technologies.length === 0 ? (
            <span className="text-xs text-gray-400 italic">No technology tags added yet.</span>
          ) : (
            formData.technologies.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-400 transition-colors"
                >
                  <X size={13} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* SECTION 6: Publishing & Ordering Options */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Sliders size={16} />
          <span>Section 6 &bull; Publishing & Options</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Published Toggle */}
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
              className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-white/20 bg-transparent"
            />
            <div>
              <span className="block text-sm font-semibold text-white">Publish to Live Site</span>
              <span className="block text-xs text-gray-400 mt-0.5">
                If checked, this project will appear publicly on the portfolio.
              </span>
            </div>
          </label>

          {/* Featured Toggle */}
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
              className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-white/20 bg-transparent"
            />
            <div>
              <span className="block text-sm font-semibold text-white">Featured Project</span>
              <span className="block text-xs text-gray-400 mt-0.5">
                Highlights the project with prominent placement and styling.
              </span>
            </div>
          </label>

          {/* Sort Order */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Display Sort Order
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value, 10) || 0 }))
              }
              className="w-full px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
            />
            <span className="block text-[11px] text-gray-400">Lower numbers appear first.</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/projects"
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          <span>{isEditing ? "Save Changes" : "Create Project"}</span>
        </button>
      </div>
    </form>
  );
}
