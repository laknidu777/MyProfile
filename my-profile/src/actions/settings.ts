"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import {
  profileSettingsSchema,
  ProfileSettingsInput,
  contactSettingsSchema,
  ContactSettingsInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function updateProfileSettings(data: ProfileSettingsInput) {
  await requireAdmin();

  const validated = profileSettingsSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Validation failed",
    };
  }

  try {
    for (const [key, value] of Object.entries(validated.data)) {
      if (value !== undefined) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: value || "" },
          create: { key, value: value || "" },
        });
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/profile");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to update profile settings:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update profile settings",
    };
  }
}

export async function updateContactSettings(data: ContactSettingsInput) {
  await requireAdmin();

  const validated = contactSettingsSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Validation failed",
    };
  }

  try {
    for (const [key, value] of Object.entries(validated.data)) {
      if (value !== undefined) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: value || "" },
          create: { key, value: value || "" },
        });
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/contact");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to update contact settings:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update contact settings",
    };
  }
}

export async function updateSiteGeneralSettings(settings: Record<string, string>) {
  await requireAdmin();

  try {
    for (const [key, value] of Object.entries(settings)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: value ?? "" },
        create: { key, value: value ?? "" },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to update general settings:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update settings",
    };
  }
}
