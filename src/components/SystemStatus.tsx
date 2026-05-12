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
    <Card className="h-full bg-black/40 border-primary/20 backdrop-blur-md overflow-hidden flex flex-col gap-0 py-0">
      <CardHeader className="px-3 py-2 border-b border-primary/10 flex flex-row items-center justify-between space-y-0 shrink-0">
        <CardTitle className="text-xs font-mono uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500 animate-pulse" /> Live_Telemetry
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          <span className="text-[10px] font-mono text-green-500 uppercase tracking-tighter">System_Online</span>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-grow flex-col gap-2 overflow-hidden p-2">
        {/* Current Focus Section */}
        <div className="shrink-0 space-y-1">
          <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground uppercase">
            <Radio className="w-3 h-3 text-primary" /> Current_Focus
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded px-2 py-1.5">
            <motion.p 
              className="line-clamp-2 text-[11px] leading-snug font-mono text-[oklch(0.85_0.15_150)]"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {focus}
            </motion.p>
          </div>
        </div>

        {/* Git Feed Section */}
        <div className="flex min-h-0 flex-grow flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground uppercase">
            <GitCommit className="w-3 h-3" /> Recent_Commits
          </div>
          <div className="relative min-h-0 flex-grow space-y-1 overflow-y-auto pr-1 scrollbar-terminal">
            {commits.length === 0 ? (
              <div className="flex h-full items-center justify-center py-2 text-center">
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
                    <div className="flex items-start gap-2 rounded p-1 transition-colors hover:bg-white/5">
                      <Terminal className="w-3 h-3 mt-0.5 text-muted-foreground group-hover:text-primary" />
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[9px] font-bold text-primary truncate">
                            {(() => {
                              const lowerRepo = commit.repo.toLowerCase();
                              if (lowerRepo === 'raditya0902' || lowerRepo === 'raditya0902/raditya0902') {
                                return 'GitHub Profile';
                              }
                              return commit.repo.split('/')[1] || commit.repo;
                            })()}
                          </span>
                          <span className="text-[8px] font-mono text-muted-foreground whitespace-nowrap">
                            {commit.url.split('/').pop()?.substring(0, 7)}
                          </span>
                        </div>
                        <p className="text-[10px] text-foreground/70 group-hover:text-foreground">
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
