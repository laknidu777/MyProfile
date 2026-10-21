import { prisma } from "@/lib/prisma";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";


export default async function AdminSettingsPage() {
  const [settings, projectsCount, experienceCount, skillsCount] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.project.count(),
    prisma.experience.count(),
    prisma.skill.count(),
  ]);

  const settingsMap = settings.reduce<Record<string, string>>((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return (
    <SiteSettingsManager
      initialSettings={settingsMap}
      diagnostics={{
        projectsCount,
        experienceCount,
        skillsCount,
        settingsCount: settings.length,
        dbProvider: "PostgreSQL",
      }}
    />
  );
}
