import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderCode, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectProps {
  project: {
    name: string;
    description: string;
    url?: string;
    tech: string[];
    metrics?: string;
  };
}

export const ProjectCard: React.FC<ProjectProps> = ({ project }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="bg-card/40 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all group h-full flex flex-col">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base font-bold text-primary group-hover:text-primary transition-colors flex items-center gap-2">
              <FolderCode className="w-4 h-4" /> {project.name}
            </CardTitle>
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <p className="text-xs text-foreground/80 leading-relaxed">
              {project.description}
            </p>
            {project.metrics && (
              <div className="bg-primary/10 border border-primary/20 rounded px-2 py-1">
                <p className="text-[10px] font-mono text-primary">
                  <span className="opacity-50">&gt;</span> METRIC: {project.metrics}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.tech.map((t) => (
              <Badge key={t} variant="outline" className="text-[9px] font-mono border-primary/20 px-1.5 py-0">
                {t}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};