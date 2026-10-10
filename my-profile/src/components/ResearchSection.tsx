import SectionLayout from "./SectionLayout";
import { BookOpen, Download, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function ResearchSection() {
  const publications = [
    {
      title: "Interactive Visualization of Quantum State Transitions in Web Environments",
      authors: "Laknidu Thilakawardhana, Dr. Jane Smith",
      venue: "ACM Conference on Human Factors in Computing Systems (CHI)",
      year: "2023",
      summary: "This paper presents a novel framework for rendering complex quantum state transitions in standard web browsers using WebGL and WebAssembly, lowering the barrier to entry for educational tools.",
      keywords: ["Data Visualization", "WebGL", "Educational Tech"],
      doiUrl: "#",
      pdfUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Analyzing the Impact of Micro-Animations on User Retention in SaaS Platforms",
      authors: "Laknidu Thilakawardhana, Alex Johnson",
      venue: "International Symposium on User Interface Software and Technology (UIST)",
      year: "2021",
      summary: "An empirical study analyzing over 50,000 user sessions to determine the correlation between subtle interface animations and user engagement metrics in enterprise software.",
      keywords: ["HCI", "UX Research", "Micro-interactions"],
      doiUrl: "#",
      pdfUrl: "#",
      githubUrl: null
    }
  ];

  return (
    <SectionLayout id="research" title="Research & Publications">
      <div className="space-y-8">
        {publications.map((pub, idx) => (
          <motion.div 
            key={pub.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group flex flex-col md:flex-row gap-6 bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all"
          >
            <div className="flex-shrink-0 pt-1">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {pub.title}
                </h3>
                <span className="px-3 py-1 bg-white/10 text-gray-300 text-sm font-medium rounded-full whitespace-nowrap self-start">
                  {pub.year}
                </span>
              </div>
              
              <p className="text-indigo-400 text-sm font-medium mb-4">
                {pub.authors} &bull; <span className="text-gray-400 italic">{pub.venue}</span>
              </p>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {pub.summary}
              </p>
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {pub.keywords.map(kw => (
                    <span key={kw} className="text-xs font-medium text-gray-400 bg-black/50 px-2 py-1 rounded">
                      #{kw}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4">
                  {pub.doiUrl && (
                    <a href={pub.doiUrl} className="flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
                      <ExternalLink size={16} className="mr-1.5" /> DOI
                    </a>
                  )}
                  {pub.pdfUrl && (
                    <a href={pub.pdfUrl} className="flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Download size={16} className="mr-1.5" /> PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionLayout>
  );
}
