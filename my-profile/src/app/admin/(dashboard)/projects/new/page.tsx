import ProjectForm from "@/components/admin/ProjectForm";
import { ProjectCategory } from "@/generated/prisma/client";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function NewProjectPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const defaultCategory =
    params.category && Object.values(ProjectCategory).includes(params.category as ProjectCategory)
      ? (params.category as ProjectCategory)
      : ProjectCategory.PERSONAL;

  return <ProjectForm defaultCategory={defaultCategory} />;
}
