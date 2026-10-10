import SectionLayout from "./SectionLayout";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ExperienceSection() {
  const experiences = [
    {
      role: "Senior Software Engineer",
      company: "TechNova Solutions",
      type: "Full-time",
      location: "San Francisco, CA (Remote)",
      date: "Jan 2024 - Present",
      description: "Leading the frontend architecture team for a suite of enterprise SaaS products. Implementing micro-frontends and optimizing rendering performance, resulting in a 40% decrease in load times.",
      tech: ["React", "TypeScript", "Next.js", "GraphQL"]
    },
    {
      role: "Full Stack Developer",
      company: "Creative Digital Agency",
      type: "Full-time",
      location: "New York, NY",
      date: "Jun 2021 - Dec 2023",
      description: "Developed and maintained interactive web applications for high-profile clients. Built custom CMS solutions, integrated complex third-party APIs, and mentored junior developers.",
      tech: ["Vue.js", "Node.js", "PostgreSQL", "AWS"]
    },
    {
      role: "Research Assistant",
      company: "University Human-Computer Interaction Lab",
      type: "Part-time",
      location: "Boston, MA",
      date: "Sep 2019 - May 2021",
      description: "Conducted research on novel interaction techniques for web-based collaborative tools. Co-authored two papers accepted at top-tier HCI conferences.",
      tech: ["JavaScript", "Python", "WebSockets", "D3.js"]
    }
  ];

  return (
    <SectionLayout id="experience" title="Professional Experience">
      <div className="space-y-12 max-w-4xl mx-auto">
        {experiences.map((exp, idx) => (
          <motion.div 
            key={exp.role + exp.company}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative pl-8 md:pl-0"
          >
            {/* Timeline Line (Desktop only) */}
            <div className="hidden md:block absolute left-[50%] top-0 bottom-[-3rem] w-px bg-gradient-to-b from-indigo-500/50 to-transparent -translate-x-1/2 last:bottom-0"></div>
            
            <div className={`md:flex items-center justify-between w-full ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-indigo-500 border-4 border-[#050505] -translate-x-[5px] md:-translate-x-1/2 mt-1.5 md:mt-0 z-10"></div>
              
              {/* Empty space for alternating layout */}
              <div className="hidden md:block md:w-5/12"></div>
              
              {/* Content Card */}
              <div className="md:w-5/12 bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
                
                <div className="flex flex-wrap items-center text-sm font-medium text-indigo-400 mb-4 gap-x-4 gap-y-2">
                  <span className="flex items-center"><Briefcase size={14} className="mr-1.5" /> {exp.company}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{exp.type}</span>
                </div>
                
                <div className="flex flex-wrap items-center text-sm text-gray-400 mb-4 gap-x-4 gap-y-2">
                  <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {exp.date}</span>
                  <span className="flex items-center"><MapPin size={14} className="mr-1.5" /> {exp.location}</span>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {exp.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map(t => (
                    <span key={t} className="px-2.5 py-1 text-xs font-medium text-gray-300 bg-black/40 rounded-md border border-white/5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              
            </div>
          </motion.div>
        ))}
      </div>
    </SectionLayout>
  );
}
