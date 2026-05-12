import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface LatestCommit {
  repo: string;
  message: string;
  url: string;
  timestamp: string;
}

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
  skillTags?: string[];
  statusBlock?: {
    SEEKING: string;
    STATUS: string;
  };
  activityBlock?: {
    learning: string;
    building: string;
    leetcode: string;
  };
  latestCommit?: LatestCommit;
}

const truncateCommitMessage = (message: string) => message.length > 52 ? message.slice(0, 52) : message;

const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const diffMs = Date.now() - date.getTime();

  if (diffMs < 60_000) {
    return 'just now';
  }

  const units = [
    { label: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
    { label: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
    { label: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
    { label: 'day', ms: 24 * 60 * 60 * 1000 },
    { label: 'hour', ms: 60 * 60 * 1000 },
    { label: 'minute', ms: 60 * 1000 },
  ];

  const unit = units.find((item) => diffMs >= item.ms);

  if (!unit) {
    return 'just now';
  }

  const value = Math.floor(diffMs / unit.ms);

  return `${value} ${unit.label}${value === 1 ? '' : 's'} ago`;
};

const getRepoName = (repo: string) => {
  const lowerRepo = repo.toLowerCase();
  if (lowerRepo === 'raditya0902' || lowerRepo === 'raditya0902/raditya0902') {
    return 'GitHub Profile';
  }
  return repo.split('/')[1] || repo;
};

const getShortSha = (url: string) => url.split('/').filter(Boolean).pop()?.slice(0, 7) || '';

export const ProfileCard: React.FC<ProfileProps> = ({ basics, skillTags = [], statusBlock, activityBlock, latestCommit }) => {
  const statusRows = statusBlock ? [
    ['SEEKING', statusBlock.SEEKING],
    ['STATUS', statusBlock.STATUS],
  ] : [];

  const activityRows = activityBlock ? [
    ['LEARNING', activityBlock.learning],
    ['BUILDING', activityBlock.building],
    ['LEETCODE', activityBlock.leetcode],
  ] : [];

  const latestCommitRows = latestCommit ? [
    ['LATEST_COMMIT', truncateCommitMessage(latestCommit.message)],
    ['REPO', `${getRepoName(latestCommit.repo)} · ${getShortSha(latestCommit.url)} · ${formatRelativeTime(latestCommit.timestamp)}`],
  ].filter(([, value]) => Boolean(value)) : [];

  return (    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors flex flex-col overflow-hidden">
        <CardHeader className="pb-2 shrink-0">
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
        <CardContent className="flex-grow flex flex-col gap-3 pt-0 pb-6 overflow-y-auto scrollbar-terminal min-h-0">
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-foreground/80">
              {basics.summary}
            </p>
            {skillTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skillTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-primary/15 bg-primary/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {statusRows.length > 0 && (
              <div className="space-y-1.5 rounded border border-primary/10 bg-primary/5 px-3 py-2 font-mono">
                {statusRows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[auto_5.5rem_1fr] items-baseline gap-2 text-[10px] tracking-wider">
                    <span className="text-green-500">&gt;</span>
                    <span className="text-muted-foreground uppercase">{label}</span>
                    <span className="text-foreground normal-case">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            {latestCommitRows.length === 2 && (
              <div className="space-y-1.5 rounded border border-primary/10 bg-primary/5 px-3 py-2 font-mono">
                {latestCommitRows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[auto_5.5rem_1fr] items-baseline gap-2 text-[10px] tracking-wider">
                    <span className="text-green-500">&gt;</span>
                    <span className="text-muted-foreground uppercase">{label}</span>
                    <span className="text-foreground normal-case">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {activityRows.length > 0 && (
              <div className="space-y-1.5 rounded border border-primary/10 bg-primary/5 px-3 py-2 font-mono">
                {activityRows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[auto_5.5rem_1fr] items-baseline gap-2 text-[10px] tracking-wider">
                    <span className="text-green-500">&gt;</span>
                    <span className="text-muted-foreground uppercase">{label}</span>
                    <span className="text-foreground normal-case">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
