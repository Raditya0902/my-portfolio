import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProfessionalProps {
  work: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    summary?: string;
    highlights?: string[];
  }>;
}

export const ProfessionalCard: React.FC<ProfessionalProps> = ({ work }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
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
        <div className="flex-grow overflow-y-auto max-h-[400px] scrollbar-terminal">
          <CardContent className="pt-4 space-y-4">
            {work.map((job, idx) => (
              <div key={idx} className="relative pl-4 border-l border-primary/20 space-y-1">
                <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-primary/40" />
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-foreground">{job.company}</h4>
                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap ml-2">{formatDate(job.startDate)} — {formatDate(job.endDate)}</span>
                </div>
                <p className="text-xs text-primary font-medium">{job.position}</p>
                {job.summary && <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{job.summary}</p>}
              </div>
            ))}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};