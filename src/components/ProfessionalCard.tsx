import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProfessionalProps {
  work: Array<{
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
    title?: string;
    organization?: string;
    date?: string;
    role?: string;
    description?: string;
  }>;
}

export const ProfessionalCard: React.FC<ProfessionalProps> = ({ work }) => {
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    if (!dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length >= 2) return `${parts[1]}.${parts[0]}`;
    return dateStr;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/20 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-primary/10">
          <CardTitle className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Professional_History
          </CardTitle>
        </CardHeader>
        <div className="flex-grow overflow-y-auto scrollbar-terminal">
          <CardContent className="pt-4 space-y-4">
            {work.map((job, idx) => {
              const displayTitle = job.title || job.company;
              const displayDate = job.date || `${formatDate(job.startDate)} — ${formatDate(job.endDate)}`;
              const displayRole = job.role || job.position;
              const displayDesc = job.description || job.summary;

              return (
                <div key={idx} className="relative pl-4 border-l border-primary/20 space-y-1">
                  <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-primary/40" />
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-foreground">{displayTitle}</h4>
                    <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap ml-2">{displayDate}</span>
                  </div>
                  {job.organization && (
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{job.organization}</p>
                  )}
                  <p className="text-xs text-primary font-medium">{displayRole}</p>
                  {displayDesc && <p className="text-[11px] text-muted-foreground leading-relaxed">{displayDesc}</p>}
                </div>
              );
            })}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};