import { prisma } from "@/lib/prisma";
import ProjectsManager from "@/components/admin/ProjectsManager";
import { ProjectCategory } from "@/generated/prisma/client";


export default async function GamesProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { category: ProjectCategory.GAME },
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
  });

  return (
    <ProjectsManager
      initialProjects={projects}
      lockedCategory={ProjectCategory.GAME}
      title="Games & Interactive Experiments"
      description="Manage game engines, playable WebGL/native prototypes, and interactive experiences"
    />
  );
}
