import { prisma } from "@/lib/prisma";
import ProjectsManager from "@/components/admin/ProjectsManager";
import { ProjectCategory } from "@/generated/prisma/client";


export default async function PersonalProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { category: ProjectCategory.PERSONAL },
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
  });

  return (
    <ProjectsManager
      initialProjects={projects}
      lockedCategory={ProjectCategory.PERSONAL}
      title="Personal Projects"
      description="Manage open-source tools, side projects, and developer prototypes"
    />
  );
}
