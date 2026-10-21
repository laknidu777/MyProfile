"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  FileEdit,
  Trash2,
  Globe,
  EyeOff,
  Star,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Github } from "@/components/Icons";
import { ProjectCategory } from "@/types/project";
import { deleteProject, toggleProjectPublish, toggleProjectFeatured } from "@/actions/projects";
import ConfirmModal from "./ConfirmModal";

export interface ProjectListItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: ProjectCategory;
  published: boolean;
  featured: boolean;
  sortOrder: number;
  imageUrl: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  technologies: string[];
  client: string | null;
  role: string | null;
  impact: string | null;
  statusText: string | null;
  updatedAt: Date | string;
}

interface ProjectsManagerProps {
  initialProjects: ProjectListItem[];
  lockedCategory?: ProjectCategory;
  title?: string;
  description?: string;
}

const categoryLabels: Record<ProjectCategory, string> = {
  FREELANCE: "Freelance",
  PERSONAL: "Personal Project",
  RESEARCH: "Research & Paper",
  GAME: "Game / Experiment",
};

const categoryBadgeColors: Record<ProjectCategory, string> = {
  FREELANCE: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  PERSONAL: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  RESEARCH: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  GAME: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

export default function ProjectsManager({
  initialProjects,
  lockedCategory,
  title = "Projects",
  description = "Manage, create, filter and publish portfolio projects",
}: ProjectsManagerProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectListItem[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(lockedCategory || "ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [featuredFilter, setFeaturedFilter] = useState<"ALL" | "FEATURED">("ALL");

  // Notification message
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<ProjectListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleTogglePublish = async (id: string, current: boolean) => {
    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !current } : p))
    );

    startTransition(async () => {
      const res = await toggleProjectPublish(id, !current);
      if (!res.success) {
        // Rollback
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: current } : p))
        );
        setNotice({ type: "error", text: res.error || "Failed to update publish state" });
      } else {
        setNotice({
          type: "success",
          text: !current ? "Project published to live portfolio" : "Project reverted to draft",
        });
        setTimeout(() => setNotice(null), 3000);
      }
    });
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
    );

    startTransition(async () => {
      const res = await toggleProjectFeatured(id, !current);
      if (!res.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, featured: current } : p))
        );
        setNotice({ type: "error", text: res.error || "Failed to update featured flag" });
      } else {
        setNotice({
          type: "success",
          text: !current ? "Project marked as featured" : "Project removed from featured",
        });
        setTimeout(() => setNotice(null), 3000);
      }
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    const res = await deleteProject(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setNotice({ type: "success", text: `Deleted "${deleteTarget.title}" successfully` });
      setDeleteTarget(null);
      router.refresh();
      setTimeout(() => setNotice(null), 3000);
    } else {
      setNotice({ type: "error", text: res.error || "Failed to delete project" });
    }
  };

  // Filter items
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(search.toLowerCase())) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "ALL" ? true : p.category === categoryFilter;

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "PUBLISHED"
        ? p.published
        : !p.published;

    const matchesFeatured =
      featuredFilter === "ALL" ? true : p.featured;

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
  });

  const createHref = lockedCategory
    ? `/admin/projects/new?category=${lockedCategory}`
    : "/admin/projects/new";

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-sm transition-all duration-300 ${
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
            onClick={() => setNotice(null)}
            className="text-xs uppercase tracking-wider font-semibold opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>

        <Link
          href={createHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Project</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, technology, slug..."
            className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Category Filter (if not locked) */}
          {!lockedCategory && (
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-gray-400 hidden sm:inline" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs font-medium text-gray-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL" className="bg-[#0e0f17]">All Categories</option>
                <option value={ProjectCategory.FREELANCE} className="bg-[#0e0f17]">Freelance</option>
                <option value={ProjectCategory.PERSONAL} className="bg-[#0e0f17]">Personal</option>
                <option value={ProjectCategory.RESEARCH} className="bg-[#0e0f17]">Research</option>
                <option value={ProjectCategory.GAME} className="bg-[#0e0f17]">Game</option>
              </select>
            </div>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | "PUBLISHED" | "DRAFT")}
            className="px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs font-medium text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL" className="bg-[#0e0f17]">All Status</option>
            <option value="PUBLISHED" className="bg-[#0e0f17]">Published Only</option>
            <option value="DRAFT" className="bg-[#0e0f17]">Drafts Only</option>
          </select>

          {/* Featured Filter */}
          <button
            onClick={() => setFeaturedFilter((prev) => (prev === "ALL" ? "FEATURED" : "ALL"))}
            className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              featuredFilter === "FEATURED"
                ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                : "bg-white/[0.04] border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Star size={13} className={featuredFilter === "FEATURED" ? "fill-amber-400 text-amber-400" : ""} />
            <span>Featured</span>
          </button>
        </div>
      </div>

      {/* Projects Table List */}
      <div className="bg-[#0b0c13] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm">No projects match the selected criteria.</p>
            {(search || statusFilter !== "ALL" || featuredFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setFeaturedFilter("ALL");
                  if (!lockedCategory) setCategoryFilter("ALL");
                }}
                className="mt-3 text-xs text-indigo-400 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Project Info</th>
                  {!lockedCategory && <th className="py-3.5 px-4">Category</th>}
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Links</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Title, slug, summary */}
                    <td className="py-4 px-6 max-w-xs sm:max-w-md">
                      <div className="flex items-start gap-3">
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-white/5 border border-white/10 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs flex-shrink-0">
                            {p.title.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                            <span className="truncate">{p.title}</span>
                            {p.statusText && (
                              <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-400 font-normal">
                                {p.statusText}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">/{p.slug}</div>
                          {p.summary && (
                            <p className="text-xs text-gray-400 line-clamp-1 mt-1">{p.summary}</p>
                          )}
                          {/* Tags pill */}
                          {p.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {p.technologies.slice(0, 4).map((tech) => (
                                <span
                                  key={tech}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-gray-300"
                                >
                                  {tech}
                                </span>
                              ))}
                              {p.technologies.length > 4 && (
                                <span className="text-[10px] text-gray-400 self-center">
                                  +{p.technologies.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    {!lockedCategory && (
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                            categoryBadgeColors[p.category]
                          }`}
                        >
                          {categoryLabels[p.category]}
                        </span>
                      </td>
                    )}

                    {/* Order */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-400 font-mono">
                      #{p.sortOrder}
                    </td>

                    {/* Published Toggle */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(p.id, p.published)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                          p.published
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30"
                        }`}
                        title={p.published ? "Click to set to Draft" : "Click to Publish"}
                      >
                        {p.published ? <Globe size={12} /> : <EyeOff size={12} />}
                        <span>{p.published ? "Published" : "Draft"}</span>
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(p.id, p.featured)}
                        disabled={isPending}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.featured
                            ? "text-amber-400 hover:text-amber-300 bg-amber-500/10"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                        }`}
                        title={p.featured ? "Remove featured" : "Mark as featured"}
                      >
                        <Star size={16} className={p.featured ? "fill-amber-400" : ""} />
                      </button>
                    </td>

                    {/* External Links */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {p.projectUrl ? (
                          <a
                            href={p.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded text-gray-400 hover:text-indigo-400 hover:bg-white/5 transition-colors"
                            title="Live demo link"
                          >
                            <ExternalLink size={14} />
                          </a>
                        ) : null}
                        {p.githubUrl ? (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="GitHub source link"
                          >
                            <Github size={14} />
                          </a>
                        ) : null}
                      </div>
                    </td>

                    {/* Edit & Delete Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/projects/${p.id}/edit`}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                          title="Edit project"
                        >
                          <FileEdit size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This cannot be undone and will remove it from the public portfolio.`}
        confirmText="Delete Project"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
