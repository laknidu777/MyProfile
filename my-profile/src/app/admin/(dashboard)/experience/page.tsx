import { prisma } from "@/lib/prisma";
import ExperienceManager from "@/components/admin/ExperienceManager";


export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { startDate: "desc" },
    ],
  });

  return <ExperienceManager initialExperiences={experiences} />;
}
