import { prisma } from "@/lib/prisma";
import ProjectsManager from "@/components/admin/ProjectsManager";
import { ProjectCategory } from "@/generated/prisma/client";


export default async function FreelanceProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { category: ProjectCategory.FREELANCE },
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
  });

  return (
    <ProjectsManager
      initialProjects={projects}
      lockedCategory={ProjectCategory.FREELANCE}
      title="Freelance Projects"
      description="Manage client engagements, project overviews, business impact, and deliverables"
    />
  );
}
