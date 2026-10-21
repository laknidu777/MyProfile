"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { experienceSchema, ExperienceInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createExperience(data: ExperienceInput) {
  await requireAdmin();

  const validated = experienceSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Validation failed",
    };
  }

  const { startDate, endDate, current, ...rest } = validated.data;

  try {
    const exp = await prisma.experience.create({
      data: {
        company: rest.company,
        position: rest.position,
        location: rest.location || null,
        employmentType: rest.employmentType || null,
        description: rest.description,
        startDate: new Date(startDate),
        endDate: current || !endDate ? null : new Date(endDate),
        current,
        technologies: rest.technologies,
        sortOrder: rest.sortOrder,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/experience");
    revalidatePath("/");

    return { success: true, data: exp };
  } catch (err: unknown) {
    console.error("Failed to create experience:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create experience",
    };
  }
}

export async function updateExperience(id: string, data: ExperienceInput) {
  await requireAdmin();

  if (!id) {
    return { success: false, error: "ID is required" };
  }

  const validated = experienceSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Validation failed",
    };
  }

  const { startDate, endDate, current, ...rest } = validated.data;

  try {
    const exp = await prisma.experience.update({
      where: { id },
      data: {
        company: rest.company,
        position: rest.position,
        location: rest.location || null,
        employmentType: rest.employmentType || null,
        description: rest.description,
        startDate: new Date(startDate),
        endDate: current || !endDate ? null : new Date(endDate),
        current,
        technologies: rest.technologies,
        sortOrder: rest.sortOrder,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/experience");
    revalidatePath("/");

    return { success: true, data: exp };
  } catch (err: unknown) {
    console.error("Failed to update experience:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update experience",
    };
  }
}

export async function deleteExperience(id: string) {
  await requireAdmin();

  try {
    await prisma.experience.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/experience");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to delete experience:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete experience",
    };
  }
}
