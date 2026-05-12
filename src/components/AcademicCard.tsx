import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AcademicProps {
  education: Array<{
    institution: string;
    area: string;
    score: string;
    startDate: string;
    endDate: string;
    courses: string[];
  }>;
}

export const AcademicCard: React.FC<AcademicProps> = ({ education }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length >= 2) return `${parts[1]}.${parts[0]}`;
    return dateStr;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/20 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-primary/10">
          <CardTitle className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
            <GraduationCap className="w-4 h-4" /> Academic_Credentials
          </CardTitle>
        </CardHeader>
        <div className="flex-grow overflow-y-auto max-h-[350px] scrollbar-terminal">
          <CardContent className="pt-4 space-y-4">
            {education.map((edu, idx) => (
              <div key={idx} className="relative pl-4 border-l border-primary/20 space-y-1">
                <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-primary/40" />
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-foreground line-clamp-1">{edu.institution}</h4>
                </div>
                <p className="text-[11px] text-primary font-medium">{edu.area}</p>
                <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                  <span>GPA: {edu.score}</span>
                  <span>{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};