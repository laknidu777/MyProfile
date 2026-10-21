import { prisma } from "@/lib/prisma";
import ProjectsManager from "@/components/admin/ProjectsManager";
import { ProjectCategory } from "@/generated/prisma/client";


export default async function ResearchProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { category: ProjectCategory.RESEARCH },
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
  });

  return (
    <ProjectsManager
      initialProjects={projects}
      lockedCategory={ProjectCategory.RESEARCH}
      title="Research & Publications"
      description="Manage academic research papers, findings, conference citations, and DOI links"
    />
  );
}
