import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileProps {
  basics: {
    name: string;
    label: string;
    email: string;
    url: string;
    summary: string;
    location: string;
    profiles: Array<{
      network: string;
      username: string;
      url: string;
    }>;
  };
}

export const ProfileCard: React.FC<ProfileProps> = ({ basics }) => {
  const getIcon = (network: string) => {
    switch (network.toLowerCase()) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                {basics.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 font-mono uppercase tracking-widest">
                {basics.label}
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] border-primary/30">
              STABLE_V1.0
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between space-y-4">
          <p className="text-sm leading-relaxed text-foreground/80">
            {basics.summary}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{basics.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              <a href={`mailto:${basics.email}`} className="hover:text-primary transition-colors underline decoration-primary/30">
                {basics.email}
              </a>
            </div>
            
            <div className="flex gap-3 pt-2">
              {basics.profiles.map((profile) => (
                <a
                  key={profile.network}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md bg-secondary/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
                  title={profile.network}
                >
                  {getIcon(profile.network)}
                </a>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};