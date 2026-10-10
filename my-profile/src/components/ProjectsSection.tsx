import SectionLayout from "./SectionLayout";
import { ExternalLink } from "lucide-react";
import { Github } from "./Icons";
import { motion } from "framer-motion";

export default function ProjectsSection() {
  const projects = [
    {
      title: "Neon Nexus",
      description: "A cyberpunk-themed productivity dashboard built with React and Three.js. Reimagines daily tasks as missions in a neon-lit metropolis.",
      tags: ["React", "Three.js", "TailwindCSS"],
      status: "Completed",
      github: "#",
      demo: "#",
      featured: true
    },
    {
      title: "Quantum State Manager",
      description: "An experimental state management library for React focusing on predictable state mutations and time-travel debugging.",
      tags: ["TypeScript", "React", "State Management"],
      status: "In Progress",
      github: "#",
      demo: "#",
      featured: false
    },
    {
      title: "Echoes of Eternity",
      description: "An open-source text adventure engine built in Rust, compiled to WebAssembly for browser playability.",
      tags: ["Rust", "WASM", "Web Audio API"],
      status: "Experimental",
      github: "#",
      demo: "#",
      featured: true
    }
  ];

  return (
    <SectionLayout id="projects" title="Personal Projects & Open Source">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <motion.div 
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`group relative rounded-2xl bg-[#050505]/50 backdrop-blur-md border border-white/10 overflow-hidden hover:border-indigo-500/50 hover:bg-[#050505]/70 transition-all duration-300 ${project.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
          >
            <div className="p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-300">
                  {project.status}
                </div>
                <div className="flex space-x-3">
                  <a href={project.github} className="text-gray-400 hover:text-white transition-colors">
                    <Github size={20} />
                  </a>
                  <a href={project.demo} className="text-gray-400 hover:text-white transition-colors">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-400 mb-6 flex-grow leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium text-indigo-300 bg-indigo-500/10 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </SectionLayout>
  );
}
