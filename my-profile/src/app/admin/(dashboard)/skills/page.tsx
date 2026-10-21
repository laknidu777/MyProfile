import { prisma } from "@/lib/prisma";
import SkillsManager from "@/components/admin/SkillsManager";


export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [
      { category: "asc" },
      { sortOrder: "asc" },
      { name: "asc" },
    ],
  });

  return <SkillsManager initialSkills={skills} />;
}
