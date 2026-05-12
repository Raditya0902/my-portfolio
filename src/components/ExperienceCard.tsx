import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExperienceProps {
  work: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    summary?: string;
    highlights?: string[];
  }>;
  education: Array<{
    institution: string;
    area: string;
    score: string;
    startDate: string;
    endDate: string;
    courses: string[];
  }>;
}

export const ExperienceCard: React.FC<ExperienceProps> = ({ work, education }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-full"
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/20 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-primary/10">
          <CardTitle className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> System_Logs
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent className="pt-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Professional_Experience
              </h3>
              {work.map((job, idx) => (
                <div key={idx} className="relative pl-4 border-l border-primary/20 space-y-1">
                  <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-primary/40" />
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-foreground">{job.company}</h4>
                    <span className="text-[10px] font-mono text-muted-foreground">{job.startDate} — {job.endDate}</span>
                  </div>
                  <p className="text-xs text-primary font-medium">{job.position}</p>
                  {job.summary && <p className="text-xs text-muted-foreground leading-relaxed">{job.summary}</p>}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <GraduationCap className="w-3 h-3" /> Academic_Credentials
              </h3>
              {education.map((edu, idx) => (
                <div key={idx} className="relative pl-4 border-l border-primary/20 space-y-1">
                  <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-primary/40" />
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-foreground">{edu.institution}</h4>
                    <span className="text-[10px] font-mono text-muted-foreground">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <p className="text-xs text-primary font-medium">{edu.area}</p>
                  <p className="text-[10px] text-muted-foreground">GPA: {edu.score}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </motion.div>
  );
};