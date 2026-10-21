import SectionLayout from "./SectionLayout";
import { Mail } from "lucide-react";
import { Github, Linkedin, Twitter } from "./Icons";
import { motion } from "framer-motion";

interface ContactSectionProps {
  contact?: {
    email: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    title?: string;
    description?: string;
  };
}

export default function ContactSection({ contact }: ContactSectionProps) {
  const email = contact?.email || "hello@example.com";
  const github = contact?.github || "#";
  const linkedin = contact?.linkedin || "#";
  const twitter = contact?.twitter || "#";
  const title = contact?.title || "Let's build something amazing together.";
  const description =
    contact?.description ||
    "Whether you have a freelance project, a research opportunity, or just want to say hi, my inbox is always open. I'll try my best to get back to you!";

  return (
    <SectionLayout id="contact" title="Get In Touch">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-6">{title}</h3>
          <p className="text-gray-400 mb-8 leading-relaxed text-lg">{description}</p>

          <div className="space-y-6">
            <a
              href={`mailto:${email}`}
              className="flex items-center space-x-4 text-gray-300 hover:text-indigo-400 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <Mail size={20} />
              </div>
              <span className="text-lg">{email}</span>
            </a>

            <div className="flex items-center space-x-4 pt-4">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-sky-400 hover:bg-sky-500/20 transition-all"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-400">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-gray-400">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white transition-colors"
              placeholder="Freelance Project Inquiry"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-400">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white transition-colors resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/25 transition-all"
          >
            Send Message
          </motion.button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Form sends to <span className="text-indigo-400">{email}</span>.
          </p>
        </form>
      </div>
    </SectionLayout>
  );
}
