"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { skillSchema, SkillInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createSkill(data: SkillInput) {
  await requireAdmin();

  const validated = skillSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Validation failed",
    };
  }

  const { name, category, level, sortOrder } = validated.data;

  // Check unique (name, category)
  const existing = await prisma.skill.findUnique({
    where: {
      name_category: {
        name,
        category,
      },
    },
  });

  if (existing) {
    return {
      success: false,
      error: `Skill "${name}" already exists under category "${category}".`,
    };
  }

  try {
    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        level: level ?? null,
        sortOrder,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/skills");
    revalidatePath("/");

    return { success: true, data: skill };
  } catch (err: unknown) {
    console.error("Failed to create skill:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create skill",
    };
  }
}

export async function updateSkill(id: string, data: SkillInput) {
  await requireAdmin();

  if (!id) {
    return { success: false, error: "ID is required" };
  }

  const validated = skillSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Validation failed",
    };
  }

  const { name, category, level, sortOrder } = validated.data;

  // Check unique constraint collision
  const existing = await prisma.skill.findFirst({
    where: {
      name,
      category,
      NOT: { id },
    },
  });

  if (existing) {
    return {
      success: false,
      error: `Another skill with name "${name}" in "${category}" already exists.`,
    };
  }

  try {
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        category,
        level: level ?? null,
        sortOrder,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/skills");
    revalidatePath("/");

    return { success: true, data: skill };
  } catch (err: unknown) {
    console.error("Failed to update skill:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update skill",
    };
  }
}

export async function deleteSkill(id: string) {
  await requireAdmin();

  try {
    await prisma.skill.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/skills");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to delete skill:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete skill",
    };
  }
}
