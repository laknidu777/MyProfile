export const ProjectCategory = {
  FREELANCE: "FREELANCE",
  PERSONAL: "PERSONAL",
  RESEARCH: "RESEARCH",
  GAME: "GAME",
} as const;

export type ProjectCategory = (typeof ProjectCategory)[keyof typeof ProjectCategory];

export const CATEGORY_DISPLAY_NAMES: Record<ProjectCategory, string> = {
  FREELANCE: "Freelance",
  PERSONAL: "Personal Project",
  RESEARCH: "Research & Paper",
  GAME: "Game & Experiment",
};
