import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, GitCommit, Radio, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommitData {
  repo: string;
  message: string;
  url: string;
  timestamp: string;
}

export const SystemStatus: React.FC<{ focus?: string, commits?: CommitData[] }> = ({ focus = "Architecting Agentic RAG Workflows at ASU", commits = [] }) => {
  return (
    <Card className="h-full bg-black/40 border-primary/20 backdrop-blur-md overflow-hidden flex flex-col">
      <CardHeader className="p-3 border-b border-primary/10 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-mono uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500 animate-pulse" /> Live_Telemetry
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          <span className="text-[10px] font-mono text-green-500 uppercase tracking-tighter">System_Online</span>
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow flex flex-col space-y-4 overflow-hidden">
        {/* Current Focus Section */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground uppercase">
            <Radio className="w-3 h-3 text-primary" /> Current_Focus
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded p-2">
            <motion.p 
              className="text-xs font-mono text-[oklch(0.85_0.15_150)]"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {focus}
            </motion.p>
          </div>
        </div>

        {/* Git Feed Section */}
        <div className="space-y-2 flex-grow overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground uppercase">
            <GitCommit className="w-3 h-3" /> Recent_Commits
          </div>
          <div className="space-y-2 flex-grow overflow-y-auto max-h-[120px] scrollbar-terminal relative">
            {commits.length === 0 ? (
              <div className="py-8 text-center flex items-center justify-center h-full">
                <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] leading-relaxed text-center w-full">
                  [SYSTEM_REPORT]: IDLE_STATE<br/>// NO_EXTERNAL_COMMITS_FETCHED
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {commits.map((commit, idx) => (
                  <motion.a
                    key={`${commit.url}-${idx}`}
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="block group"
                  >
                    <div className="flex items-start gap-2 p-1.5 rounded hover:bg-white/5 transition-colors">
                      <Terminal className="w-3 h-3 mt-0.5 text-muted-foreground group-hover:text-primary" />
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[9px] font-bold text-primary truncate">
                            {commit.repo.split('/')[1] || commit.repo}
                          </span>
                          <span className="text-[8px] font-mono text-muted-foreground whitespace-nowrap">
                            {commit.url.split('/').pop()?.substring(0, 7)}
                          </span>
                        </div>
                        <p className="text-[10px] text-foreground/70 truncate group-hover:text-foreground">
                          {commit.message}
                        </p>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};