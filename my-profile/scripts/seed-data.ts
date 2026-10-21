import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ProjectCategory } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log("Seeding portfolio data...");

  // 1. Projects
  const projects = [
    // Freelance
    {
      title: "Dashboard Redesign",
      slug: "dashboard-redesign",
      category: ProjectCategory.FREELANCE,
      client: "Global Finance Tech",
      role: "Lead Frontend Developer",
      summary: "A complete overhaul of a legacy financial dashboard used by hundreds of advisors.",
      description: "A complete overhaul of a legacy financial dashboard used by hundreds of advisors. Redesigned user journeys, reduced latency, and built real-time analytics widgets.",
      impact: "Improved perceived load time by 300% and increased user task completion rate by 45%.",
      technologies: ["React", "Redux Toolkit", "Tailwind CSS", "Recharts"],
      projectUrl: "https://example.com",
      featured: true,
      published: true,
      sortOrder: 1,
    },
    {
      title: "Headless Storefront",
      slug: "headless-storefront",
      category: ProjectCategory.FREELANCE,
      client: "E-Commerce Startup",
      role: "Full Stack Consultant",
      summary: "Built a high-performance headless e-commerce storefront integrated with Shopify Plus.",
      description: "Built a high-performance headless e-commerce storefront integrated with Shopify Plus. Features instantaneous client-side navigation and customized checkout workflows.",
      impact: "Achieved a perfect 100 Lighthouse performance score and increased conversion rate by 18%.",
      technologies: ["Next.js", "Shopify Storefront API", "Framer Motion"],
      projectUrl: "https://example.com",
      featured: true,
      published: true,
      sortOrder: 2,
    },
    // Personal
    {
      title: "Neon Nexus",
      slug: "neon-nexus",
      category: ProjectCategory.PERSONAL,
      summary: "A cyberpunk-themed productivity dashboard built with React and Three.js. Reimagines daily tasks as missions in a neon-lit metropolis.",
      description: "A cyberpunk-themed productivity dashboard built with React and Three.js. Reimagines daily tasks as missions in a neon-lit metropolis with procedural visual effects.",
      technologies: ["React", "Three.js", "TailwindCSS"],
      statusText: "Completed",
      githubUrl: "https://github.com",
      projectUrl: "https://example.com",
      featured: true,
      published: true,
      sortOrder: 1,
    },
    {
      title: "Quantum State Manager",
      slug: "quantum-state-manager",
      category: ProjectCategory.PERSONAL,
      summary: "An experimental state management library for React focusing on predictable state mutations and time-travel debugging.",
      description: "An experimental state management library for React focusing on predictable state mutations, snapshotting, and zero-overhead devtools time-travel debugging.",
      technologies: ["TypeScript", "React", "State Management"],
      statusText: "In Progress",
      githubUrl: "https://github.com",
      projectUrl: "https://example.com",
      featured: false,
      published: true,
      sortOrder: 2,
    },
    {
      title: "Echoes of Eternity",
      slug: "echoes-of-eternity",
      category: ProjectCategory.PERSONAL,
      summary: "An open-source text adventure engine built in Rust, compiled to WebAssembly for browser playability.",
      description: "An open-source text adventure engine built in Rust, compiled to WebAssembly for seamless 60fps browser playability with dynamic ambient audio synthesis.",
      technologies: ["Rust", "WASM", "Web Audio API"],
      statusText: "Experimental",
      githubUrl: "https://github.com",
      projectUrl: "https://example.com",
      featured: true,
      published: true,
      sortOrder: 3,
    },
    // Research
    {
      title: "Interactive Visualization of Quantum State Transitions in Web Environments",
      slug: "quantum-state-transitions-paper",
      category: ProjectCategory.RESEARCH,
      role: "Laknidu Thilakawardhana, Dr. Jane Smith",
      impact: "ACM Conference on Human Factors in Computing Systems (CHI) • 2023",
      summary: "This paper presents a novel framework for rendering complex quantum state transitions in standard web browsers using WebGL and WebAssembly.",
      description: "This paper presents a novel framework for rendering complex quantum state transitions in standard web browsers using WebGL and WebAssembly, lowering the barrier to entry for educational tools.",
      technologies: ["Data Visualization", "WebGL", "Educational Tech"],
      projectUrl: "https://doi.org",
      githubUrl: "https://github.com",
      featured: true,
      published: true,
      sortOrder: 1,
    },
    {
      title: "Analyzing the Impact of Micro-Animations on User Retention in SaaS Platforms",
      slug: "micro-animations-retention-study",
      category: ProjectCategory.RESEARCH,
      role: "Laknidu Thilakawardhana, Alex Johnson",
      impact: "International Symposium on User Interface Software and Technology (UIST) • 2021",
      summary: "An empirical study analyzing over 50,000 user sessions to determine the correlation between subtle interface animations and user engagement metrics.",
      description: "An empirical study analyzing over 50,000 user sessions to determine the correlation between subtle interface animations and user engagement metrics in enterprise software.",
      technologies: ["HCI", "UX Research", "Micro-interactions"],
      projectUrl: "https://doi.org",
      featured: false,
      published: true,
      sortOrder: 2,
    },
    // Games
    {
      title: "Starborne: Genesis",
      slug: "starborne-genesis",
      category: ProjectCategory.GAME,
      summary: "A fast-paced 2D space shooter with procedural enemy generation and a custom physics engine built from scratch.",
      description: "A fast-paced 2D space shooter with procedural enemy generation and a custom physics engine built from scratch using SFML and modern C++.",
      technologies: ["C++", "SFML", "Box2D"],
      statusText: "Playable Prototype",
      imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      githubUrl: "https://github.com",
      projectUrl: "https://itch.io",
      featured: true,
      published: true,
      sortOrder: 1,
    },
    {
      title: "Neon Tactics",
      slug: "neon-tactics",
      category: ProjectCategory.GAME,
      summary: "Turn-based tactical RPG set in a cyberpunk dystopia. Features complex AI behaviors and a dynamic lighting system.",
      description: "Turn-based tactical RPG set in a cyberpunk dystopia. Features complex AI behaviors, grid pathfinding, and custom shader lighting pipelines.",
      technologies: ["Unity", "C#", "HLSL"],
      statusText: "In Development",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      githubUrl: "https://github.com",
      featured: false,
      published: true,
      sortOrder: 2,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
  console.log(`✓ Seeded ${projects.length} projects`);

  // 2. Experiences
  const experiences = [
    {
      position: "Senior Software Engineer",
      company: "TechNova Solutions",
      employmentType: "Full-time",
      location: "San Francisco, CA (Remote)",
      startDate: new Date("2024-01-01"),
      current: true,
      description: "Leading the frontend architecture team for a suite of enterprise SaaS products. Implementing micro-frontends and optimizing rendering performance, resulting in a 40% decrease in load times.",
      technologies: ["React", "TypeScript", "Next.js", "GraphQL"],
      sortOrder: 1,
    },
    {
      position: "Full Stack Developer",
      company: "Creative Digital Agency",
      employmentType: "Full-time",
      location: "New York, NY",
      startDate: new Date("2021-06-01"),
      endDate: new Date("2023-12-31"),
      current: false,
      description: "Developed and maintained interactive web applications for high-profile clients. Built custom CMS solutions, integrated complex third-party APIs, and mentored junior developers.",
      technologies: ["Vue.js", "Node.js", "PostgreSQL", "AWS"],
      sortOrder: 2,
    },
    {
      position: "Research Assistant",
      company: "University Human-Computer Interaction Lab",
      employmentType: "Part-time",
      location: "Boston, MA",
      startDate: new Date("2019-09-01"),
      endDate: new Date("2021-05-31"),
      current: false,
      description: "Conducted research on novel interaction techniques for web-based collaborative tools. Co-authored two papers accepted at top-tier HCI conferences.",
      technologies: ["JavaScript", "Python", "WebSockets", "D3.js"],
      sortOrder: 3,
    },
  ];

  for (const exp of experiences) {
    const existing = await prisma.experience.findFirst({
      where: { company: exp.company, position: exp.position },
    });
    if (existing) {
      await prisma.experience.update({ where: { id: existing.id }, data: exp });
    } else {
      await prisma.experience.create({ data: exp });
    }
  }
  console.log(`✓ Seeded ${experiences.length} experience records`);

  // 3. Skills
  const skillCategories = [
    {
      category: "Frontend Development",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML/CSS"],
    },
    {
      category: "Backend Development",
      skills: ["Node.js", "Express", "Python", "RESTful APIs", "GraphQL"],
    },
    {
      category: "Databases & Storage",
      skills: ["PostgreSQL", "MongoDB", "Redis", "Firebase"],
    },
    {
      category: "DevOps & Cloud",
      skills: ["Docker", "AWS", "Vercel", "GitHub Actions", "CI/CD"],
    },
    {
      category: "Languages",
      skills: ["JavaScript", "TypeScript", "Python", "C++", "Java"],
    },
    {
      category: "Tools & Others",
      skills: ["Git", "Linux", "Figma", "Jest", "Webpack"],
    },
  ];

  let skillCount = 0;
  for (const cat of skillCategories) {
    let order = 1;
    for (const name of cat.skills) {
      await prisma.skill.upsert({
        where: {
          name_category: {
            name,
            category: cat.category,
          },
        },
        update: { sortOrder: order },
        create: {
          name,
          category: cat.category,
          level: 90,
          sortOrder: order,
        },
      });
      order++;
      skillCount++;
    }
  }
  console.log(`✓ Seeded ${skillCount} skills`);

  // 4. Site Settings (Profile, Contact, Site)
  const settings: Record<string, string> = {
    profile_name: "Laknidu Thilakawardhana",
    profile_headline: "Software Engineer, Researcher, and Builder of interactive web experiences.",
    profile_bio: "Bridging the gap between design and deep technical engineering. Passionate about AI, Open Source, and crafting digital products that feel alive.",
    profile_about_p1: "I am a Software Engineer and Researcher with a passion for building scalable web applications and exploring the intersection of design, interaction, and deep technical engineering.",
    profile_about_p2: "My approach to solving problems involves a healthy mix of rigorous academic research, rapid prototyping, and a relentless focus on the end-user experience. I believe that the best products are not just functional, but delightfully interactive and meticulously crafted.",
    profile_about_p3: "When I'm not writing code for web platforms or optimizing backend services, you can find me tinkering with game engines, contributing to open-source developer tools, or reading up on the latest advancements in artificial intelligence and human-computer interaction.",
    profile_location: "United Kingdom",
    profile_resume_url: "/resume.pdf",
    profile_availability: "Available for freelance opportunities",
    contact_email: "hello@example.com",
    contact_github: "https://github.com",
    contact_linkedin: "https://linkedin.com",
    contact_twitter: "https://twitter.com",
    contact_title: "Let's build something amazing together.",
    contact_description: "Whether you have a freelance project, a research opportunity, or just want to say hi, my inbox is always open. I'll try my best to get back to you!",
    site_title: "Laknidu Thilakawardhana | Software Engineer & Researcher",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log(`✓ Seeded ${Object.keys(settings).length} site settings`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
