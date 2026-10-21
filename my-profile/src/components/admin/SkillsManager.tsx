"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  FileEdit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Tag,
} from "lucide-react";
import { SkillInput, skillSchema } from "@/lib/validations";
import { createSkill, updateSkill, deleteSkill } from "@/actions/skills";
import ConfirmModal from "./ConfirmModal";

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: number | null;
  sortOrder: number;
}

interface SkillsManagerProps {
  initialSkills: SkillItem[];
}

const defaultCategories = [
  "Frontend Development",
  "Backend Development",
  "Databases & Storage",
  "DevOps & Cloud",
  "Languages",
  "Tools & Others",
];

export default function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const router = useRouter();
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SkillItem | null>(null);

  // Deletion State
  const [deleteTarget, setDeleteTarget] = useState<SkillItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<SkillInput>({
    name: "",
    category: "Frontend Development",
    level: 85,
    sortOrder: 0,
  });
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Extract all unique categories
  const allCategories = Array.from(
    new Set([...defaultCategories, ...skills.map((s) => s.category)])
  );

  const openCreateModal = (presetCategory?: string) => {
    setEditingItem(null);
    setIsCustomCategory(false);
    setCustomCategoryText("");
    setFormData({
      name: "",
      category: presetCategory || (selectedCategory !== "ALL" ? selectedCategory : "Frontend Development"),
      level: 85,
      sortOrder: skills.length + 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: SkillItem) => {
    setEditingItem(item);
    const isCustom = !defaultCategories.includes(item.category);
    setIsCustomCategory(isCustom);
    setCustomCategoryText(isCustom ? item.category : "");
    setFormData({
      name: item.name,
      category: item.category,
      level: item.level ?? 80,
      sortOrder: item.sortOrder,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const effectiveCategory = isCustomCategory ? customCategoryText.trim() : formData.category;
    if (!effectiveCategory) {
      setFormError("Category is required");
      return;
    }

    const payload: SkillInput = {
      ...formData,
      category: effectiveCategory,
    };

    const parsed = skillSchema.safeParse(payload);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Validation error");
      return;
    }

    startTransition(async () => {
      let res;
      if (editingItem) {
        res = await updateSkill(editingItem.id, payload);
      } else {
        res = await createSkill(payload);
      }

      if (res.success) {
        setIsModalOpen(false);
        setNotice({
          type: "success",
          text: editingItem ? "Skill updated successfully!" : "Skill created successfully!",
        });
        router.refresh();
        setTimeout(() => setNotice(null), 3000);
      } else {
        setFormError(res.error || "Failed to save skill");
      }
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    const res = await deleteSkill(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setNotice({ type: "success", text: `Deleted "${deleteTarget.name}" from ${deleteTarget.category}` });
      setDeleteTarget(null);
      router.refresh();
      setTimeout(() => setNotice(null), 3000);
    } else {
      setNotice({ type: "error", text: res.error || "Failed to delete skill" });
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const displayedCategories =
    selectedCategory === "ALL"
      ? Object.keys(skillsByCategory)
      : [selectedCategory];

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
          <h1 className="text-2xl font-bold text-white tracking-tight">Technical Skills</h1>
          <p className="text-sm text-gray-400 mt-1">
            Organize skills by technology domains, proficiencies, and presentation order
          </p>
        </div>

        <button
          onClick={() => openCreateModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            selectedCategory === "ALL"
              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
              : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white"
          }`}
        >
          All Categories ({skills.length})
        </button>

        {allCategories.map((cat) => {
          const count = skillsByCategory[cat]?.length || 0;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                selectedCategory === cat
                  ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                  : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Grouped Skills Display */}
      <div className="space-y-6">
        {displayedCategories.map((cat) => {
          const categorySkills = skillsByCategory[cat] || [];
          if (categorySkills.length === 0 && selectedCategory !== "ALL") {
            return (
              <div key={cat} className="p-8 text-center text-sm text-gray-400 bg-[#0b0c13] rounded-3xl border border-white/10">
                No skills found in &quot;{cat}&quot;.
                <button
                  onClick={() => openCreateModal(cat)}
                  className="block mx-auto mt-2 text-indigo-400 hover:underline"
                >
                  Add a skill to this category
                </button>
              </div>
            );
          }

          return (
            <div
              key={cat}
              className="bg-[#0b0c13] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Tag size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">{cat}</h2>
                    <span className="text-xs text-gray-400">
                      {categorySkills.length} skill{categorySkills.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openCreateModal(cat)}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>Add to {cat}</span>
                </button>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-2xl p-3.5 flex items-center justify-between transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-medium text-sm text-white group-hover:text-indigo-300 truncate">
                        {skill.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                        {skill.level && <span>Proficiency: {skill.level}%</span>}
                        <span>&bull;</span>
                        <span>#{skill.sortOrder}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(skill)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white"
                        title="Edit skill"
                      >
                        <FileEdit size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(skill)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-gray-400 hover:text-rose-400"
                        title="Delete skill"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => !isPending && setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md bg-[#0e0f17] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {editingItem ? "Edit Skill" : "Add Technical Skill"}
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
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Next.js, PostgreSQL, Docker"
                  className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(!isCustomCategory)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    {isCustomCategory ? "Choose from standard list" : "+ Create new category"}
                  </button>
                </div>

                {isCustomCategory ? (
                  <input
                    type="text"
                    required
                    value={customCategoryText}
                    onChange={(e) => setCustomCategoryText(e.target.value)}
                    placeholder="Enter custom category name..."
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {allCategories.map((c) => (
                      <option key={c} value={c} className="bg-[#0e0f17]">
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Proficiency % ({formData.level ?? 80}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={formData.level ?? 80}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        level: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-indigo-500 mt-2"
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
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>{editingItem ? "Update" : "Save"}</span>
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
        title="Delete Skill"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from your skills catalog?`}
        confirmText="Delete Skill"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
