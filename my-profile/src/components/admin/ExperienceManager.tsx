"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Plus,
  FileEdit,
  Trash2,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
} from "lucide-react";
import { ExperienceInput, experienceSchema } from "@/lib/validations";
import { createExperience, updateExperience, deleteExperience } from "@/actions/experience";
import ConfirmModal from "./ConfirmModal";

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string | null;
  employmentType: string | null;
  description: string;
  startDate: Date | string;
  endDate: Date | string | null;
  current: boolean;
  technologies: string[];
  sortOrder: number;
}

interface ExperienceManagerProps {
  initialExperiences: ExperienceItem[];
}

export default function ExperienceManager({ initialExperiences }: ExperienceManagerProps) {
  const router = useRouter();
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);

  // Deletion State
  const [deleteTarget, setDeleteTarget] = useState<ExperienceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ExperienceInput>({
    company: "",
    position: "",
    location: "",
    employmentType: "Full-time",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
    technologies: [],
    sortOrder: 0,
  });

  const [techInput, setTechInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      company: "",
      position: "",
      location: "",
      employmentType: "Full-time",
      description: "",
      startDate: new Date().toISOString().substring(0, 10),
      endDate: "",
      current: true,
      technologies: [],
      sortOrder: experiences.length + 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ExperienceItem) => {
    setEditingItem(item);
    setFormData({
      company: item.company,
      position: item.position,
      location: item.location || "",
      employmentType: item.employmentType || "Full-time",
      description: item.description,
      startDate: new Date(item.startDate).toISOString().substring(0, 10),
      endDate: item.endDate ? new Date(item.endDate).toISOString().substring(0, 10) : "",
      current: item.current,
      technologies: item.technologies || [],
      sortOrder: item.sortOrder,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !formData.technologies.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, trimmed],
      }));
      setTechInput("");
    }
  };

  const handleRemoveTech = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsed = experienceSchema.safeParse(formData);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Validation error");
      return;
    }

    startTransition(async () => {
      let res;
      if (editingItem) {
        res = await updateExperience(editingItem.id, formData);
      } else {
        res = await createExperience(formData);
      }

      if (res.success) {
        setIsModalOpen(false);
        setNotice({
          type: "success",
          text: editingItem ? "Experience updated successfully!" : "Experience created successfully!",
        });
        router.refresh();
        setTimeout(() => setNotice(null), 3000);
      } else {
        setFormError(res.error || "Failed to save experience");
      }
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    const res = await deleteExperience(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setExperiences((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setNotice({ type: "success", text: `Deleted "${deleteTarget.position} at ${deleteTarget.company}"` });
      setDeleteTarget(null);
      router.refresh();
      setTimeout(() => setNotice(null), 3000);
    } else {
      setNotice({ type: "error", text: res.error || "Failed to delete experience" });
    }
  };

  const formatDateDisplay = (dateStr: Date | string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
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
            onClick={() => setNotice(null)}
            className="text-xs uppercase tracking-wider font-semibold opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Work Experience</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your career history, company roles, timeframes, and key responsibilities
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Experience List Cards */}
      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="bg-[#0b0c13] border border-white/10 rounded-3xl p-12 text-center text-gray-400 text-sm">
            No work experience added yet. Click &quot;Add Experience&quot; to begin.
          </div>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {exp.position}
                    </h3>
                    <span className="text-sm font-semibold text-indigo-400">&bull; {exp.company}</span>
                    {exp.employmentType && (
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300">
                        {exp.employmentType}
                      </span>
                    )}
                    {exp.current && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
                        Current Role
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-indigo-400" />
                      <span>
                        {formatDateDisplay(exp.startDate)} &mdash;{" "}
                        {exp.current ? "Present" : exp.endDate ? formatDateDisplay(exp.endDate) : "Present"}
                      </span>
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-indigo-400" />
                        <span>{exp.location}</span>
                      </span>
                    )}
                    <span className="text-gray-400 font-mono">Order: #{exp.sortOrder}</span>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed pt-1 whitespace-pre-line">
                    {exp.description}
                  </p>

                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-start">
                  <button
                    onClick={() => openEditModal(exp)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    title="Edit experience"
                  >
                    <FileEdit size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(exp)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete experience"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => !isPending && setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-[#0e0f17] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {editingItem ? "Edit Experience Entry" : "Add Work Experience"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isPending}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Job Title / Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. TechNova Solutions"
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. San Francisco, CA (Remote)"
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    value={formData.employmentType || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, employmentType: e.target.value }))}
                    placeholder="e.g. Full-time, Part-time, Contract"
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    disabled={formData.current}
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.current}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          current: e.target.checked,
                          endDate: e.target.checked ? "" : prev.endDate,
                        }))
                      }
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-white/20 bg-transparent"
                    />
                    <span className="text-xs font-medium text-gray-300">
                      I currently work in this role
                    </span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Role Description & Achievements *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Detail your responsibilities, team leadership, architectural contributions, and impact..."
                  className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 resize-y"
                />
              </div>

              {/* Technologies Tag input */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Technologies Used
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    placeholder="Type technology and press Enter..."
                    className="flex-1 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {formData.technologies.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="hover:text-rose-400"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPending}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  <span>{editingItem ? "Update Experience" : "Save Experience"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Experience Record"
        message={`Are you sure you want to delete the record for "${deleteTarget?.position} at ${deleteTarget?.company}"?`}
        confirmText="Delete Record"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
