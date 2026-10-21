import { prisma } from "@/lib/prisma";
import ProjectsManager from "@/components/admin/ProjectsManager";


export default async function AllProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
  });

  return (
    <ProjectsManager
      initialProjects={projects}
      title="All Projects"
      description="View, organize, and manage projects across all portfolio categories"
    />
  );
}
