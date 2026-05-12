import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Database, Layout, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface SkillsProps {
  skills: {
    languages: string[];
    ai_ml: string[];
    infrastructure: string[];
    security: string[];
    databases: string[];
  };
}

export const SkillsCard: React.FC<SkillsProps> = ({ skills }) => {
  const categories = [
    { name: 'Core', items: skills.languages, icon: <Cpu className="w-4 h-4" /> },
    { name: 'AI/ML', items: skills.ai_ml, icon: <Zap className="w-4 h-4 text-yellow-500" /> },
    { name: 'Infrastructure', items: skills.infrastructure, icon: <Layout className="w-4 h-4" /> },
    { name: 'Databases', items: skills.databases, icon: <Database className="w-4 h-4" /> },
    { name: 'Security', items: skills.security, icon: <ShieldCheck className="w-4 h-4 text-green-500" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full self-stretch"
    >
      <Card className="h-full self-stretch bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden flex flex-col">
        <CardHeader className="pb-3 border-b border-primary/10">
          <CardTitle className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Tech_Stack
          </CardTitle>
        </CardHeader>
        <div className="flex-grow overflow-y-auto scrollbar-terminal">
          <CardContent className="pt-4 space-y-4">
            {categories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {category.icon}
                {category.name}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {category.items.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="text-[10px] py-0 px-2 font-mono bg-secondary/30 hover:bg-primary/20 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};
