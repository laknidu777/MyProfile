import SectionLayout from "./SectionLayout";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export interface FreelanceDisplayItem {
  client?: string | null;
  title: string;
  role?: string | null;
  summary?: string;
  description?: string;
  impact?: string | null;
  technologies: string[];
  projectUrl?: string | null;
}

interface FreelanceSectionProps {
  projects?: FreelanceDisplayItem[];
}

export default function FreelanceSection({ projects: dynamicProjects }: FreelanceSectionProps) {
  const fallbackProjects: FreelanceDisplayItem[] = [
    {
      client: "Global Finance Tech",
      title: "Dashboard Redesign",
      role: "Lead Frontend Developer",
      summary: "A complete overhaul of a legacy financial dashboard used by hundreds of advisors.",
      impact: "Improved perceived load time by 300% and increased user task completion rate by 45%.",
      technologies: ["React", "Redux Toolkit", "Tailwind CSS", "Recharts"],
      projectUrl: "#",
    },
    {
      client: "E-Commerce Startup",
      title: "Headless Storefront",
      role: "Full Stack Consultant",
      summary: "Built a high-performance headless e-commerce storefront integrated with Shopify Plus.",
      impact: "Achieved a perfect 100 Lighthouse performance score and increased conversion rate by 18%.",
      technologies: ["Next.js", "Shopify Storefront API", "Framer Motion"],
      projectUrl: "#",
    },
  ];

  const displayList =
    dynamicProjects && dynamicProjects.length > 0 ? dynamicProjects : fallbackProjects;

  return (
    <SectionLayout id="freelance" title="Freelance & Client Work">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {displayList.map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative bg-[#050505]/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-[#050505]/70 hover:border-white/10 transition-all overflow-hidden"
          >
            {/* Background decorative gradient */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-medium text-indigo-400 mb-1">
                    {project.client || "Client Engagement"}
                  </p>
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                </div>
                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-indigo-500 hover:scale-110 transition-all"
                    aria-label="View Project"
                  >
                    <ArrowUpRight size={20} />
                  </a>
                )}
              </div>

              <div className="mb-6 space-y-4">
                {project.role && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Role
                    </h4>
                    <p className="text-gray-200">{project.role}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Overview
                  </h4>
                  <p className="text-gray-300">{project.summary || project.description}</p>
                </div>
                {project.impact && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Impact
                    </h4>
                    <p className="text-green-400">{project.impact}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-medium text-gray-300 bg-black/30 px-3 py-1.5 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionLayout>
  );
}
