import SectionLayout from "./SectionLayout";
import { Code2, Database, Layout, Server, Settings, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function SkillsSection() {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <Layout className="text-blue-400" size={24} />,
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML/CSS"]
    },
    {
      title: "Backend Development",
      icon: <Server className="text-green-400" size={24} />,
      skills: ["Node.js", "Express", "Python", "RESTful APIs", "GraphQL"]
    },
    {
      title: "Databases & Storage",
      icon: <Database className="text-yellow-400" size={24} />,
      skills: ["PostgreSQL", "MongoDB", "Redis", "Firebase"]
    },
    {
      title: "DevOps & Cloud",
      icon: <Settings className="text-purple-400" size={24} />,
      skills: ["Docker", "AWS", "Vercel", "GitHub Actions", "CI/CD"]
    },
    {
      title: "Languages",
      icon: <Code2 className="text-pink-400" size={24} />,
      skills: ["JavaScript", "TypeScript", "Python", "C++", "Java"]
    },
    {
      title: "Tools & Others",
      icon: <Terminal className="text-indigo-400" size={24} />,
      skills: ["Git", "Linux", "Figma", "Jest", "Webpack"]
    }
  ];

  return (
    <SectionLayout id="skills" title="Technical Skills">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, idx) => (
          <motion.div 
            key={category.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-white/5 rounded-lg">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">{category.title}</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {category.skills.map(skill => (
                <span 
                  key={skill}
                  className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-black/40 rounded-md border border-white/10 hover:border-white/30 hover:text-white transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionLayout>
  );
}
