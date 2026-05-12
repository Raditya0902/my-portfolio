import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderCode, Github } from "lucide-react";
import { motion } from "framer-motion";

interface Project {
  name: string;
  description?: string | null;
  url?: string;
  topics?: string[];
  language?: string | null;
  tech: string[];
  stargazers_count?: number;
  metrics?: string;
}

interface ProjectProps {
  project: Project;
}

const getProjectTags = (project: Project) => {
  const visibleTopics = project.topics?.filter((topic) => topic.toLowerCase() !== 'portfolio') ?? [];

  return (visibleTopics.length > 0
    ? visibleTopics
    : project.language
      ? [project.language]
      : project.tech
  ).filter((tag): tag is string => Boolean(tag));
};

const getStarCount = (project: Project) => (
  project.stargazers_count ?? Number(project.metrics?.match(/^(\d+)\s+stars?$/i)?.[1] ?? NaN)
);

export const ProjectCard: React.FC<ProjectProps> = ({ project }) => {
  const starCount = getStarCount(project);
  const showMetric = Boolean(project.metrics && starCount > 0);
  const hasDescription = Boolean(project.description?.trim());
  const tags = getProjectTags(project);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className="bg-card/40 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all group h-full flex flex-col gap-0 overflow-hidden py-0">
        <CardHeader className="p-4 pb-2 shrink-0">
          <div className="flex justify-between items-start gap-3">
            <CardTitle className="min-w-0 text-base font-bold text-primary group-hover:text-primary transition-colors flex items-start gap-2 leading-tight">
              <FolderCode className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{project.name}</span>
            </CardTitle>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                aria-label={`${project.name} GitHub repository`}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent className="min-h-0 flex-grow overflow-y-auto p-4 pt-0 scrollbar-terminal">
          <div className="space-y-3">
            {hasDescription && (
              <p className="text-xs text-foreground/80 leading-relaxed">
                {project.description}
              </p>
            )}
            {showMetric && (
              <div className="bg-primary/10 border border-primary/20 rounded px-2 py-1">
                <p className="text-[10px] font-mono text-primary">
                  <span className="opacity-50">&gt;</span> METRIC: {project.metrics}
                </p>
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[9px] font-mono border-primary/20 px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
