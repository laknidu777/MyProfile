import SectionLayout from "./SectionLayout";
import { motion } from "framer-motion";

interface AboutSectionProps {
  profile?: {
    aboutP1?: string;
    aboutP2?: string;
    aboutP3?: string;
  };
}

export default function AboutSection({ profile }: AboutSectionProps) {
  const p1 =
    profile?.aboutP1 ||
    "I am a Software Engineer and Researcher with a passion for building scalable web applications and exploring the intersection of design, interaction, and deep technical engineering.";
  const p2 =
    profile?.aboutP2 ||
    "My approach to solving problems involves a healthy mix of rigorous academic research, rapid prototyping, and a relentless focus on the end-user experience. I believe that the best products are not just functional, but delightfully interactive and meticulously crafted.";
  const p3 =
    profile?.aboutP3 ||
    "When I'm not writing code for web platforms or optimizing backend services, you can find me tinkering with game engines, contributing to open-source developer tools, or reading up on the latest advancements in artificial intelligence and human-computer interaction.";

  return (
    <SectionLayout id="about" title="About Me">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-lg text-gray-300 leading-relaxed"
        >
          <p>{p1}</p>
          <p>{p2}</p>
          <p>{p3}</p>

          <div className="pt-4 flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-[#050505]/50 backdrop-blur-md rounded-lg border border-white/10 text-sm font-medium text-indigo-300">
              Web Architecture
            </div>
            <div className="px-4 py-2 bg-[#050505]/50 backdrop-blur-md rounded-lg border border-white/10 text-sm font-medium text-purple-300">
              Interactive Design
            </div>
            <div className="px-4 py-2 bg-[#050505]/50 backdrop-blur-md rounded-lg border border-white/10 text-sm font-medium text-pink-300">
              Performance Optimization
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-2xl transform rotate-3 scale-105 blur-xl" />

          <div className="relative bg-[#050505]/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 aspect-square flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* Abstract visual representing tech stack */}
            <div className="w-32 h-32 relative animate-[spin_10s_linear_infinite]">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
              <div className="absolute inset-2 rounded-full border-2 border-purple-500/30 border-l-purple-500 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-4 rounded-full border-2 border-pink-500/30 border-b-pink-500 animate-[spin_20s_linear_infinite]" />
            </div>

            <h3 className="mt-8 text-2xl font-bold text-white tracking-widest text-center">
              INNOVATE.<br />
              ITERATE.<br />
              BUILD.
            </h3>
          </div>
        </motion.div>
      </div>
    </SectionLayout>
  );
}
