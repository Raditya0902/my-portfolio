import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HandshakeProps {
  email: string;
  linkedinUrl: string;
}

export default function Handshake({ email, linkedinUrl }: HandshakeProps) {
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const term = input.toLowerCase().trim();
    if (term === 'contact' || term === 'connect') {
      triggerConnection();
    }
  }, [input]);

  const triggerConnection = async () => {
    setIsConnected(true);
    const connectionLogs = [
      '>> INITIATING_SECURE_HANDSHAKE...',
      '>> ESTABLISHING_ENCRYPTED_TUNNEL...',
      '>> PROTOCOL_ACCEPTED: ADITYA_RALLAPALLI',
      '>> FETCHING_COMMUNICATION_CHANNELS...',
      '>> CONNECTION_STABLE'
    ];

    for (const log of connectionLogs) {
      setLogs(prev => [...prev, log]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="min-h-[300px] h-full bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-center p-8 md:p-12 text-center group hover:bg-primary/10 transition-all overflow-hidden relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity z-0">
          <div 
            className="w-full h-full" 
            style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, var(--primary) 0, var(--primary) 1px, transparent 0, transparent 50%)', 
              backgroundSize: '10px 10px' 
            }}
          ></div>
        </div>

        <div className="relative z-10 w-full space-y-6">
          <AnimatePresence mode="wait">
            {!isConnected ? (
              <motion.div
                key="input-stage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Initialize_Handshake</p>
                <h3 className="text-2xl md:text-3xl font-black group-hover:text-primary transition-colors uppercase leading-tight italic">
                  "Build the future of Agentic Systems"
                </h3>
                
                <div className="max-w-xs mx-auto relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Awaiting_Connection_Request..."
                    className="w-full bg-transparent border-b border-primary/30 py-2 text-center font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-[oklch(0.7_0.05_250)]/50"
                    autoFocus
                  />
                  <div className="mt-2 text-[8px] text-muted-foreground/60 uppercase font-mono tracking-tighter">
                    Tip: type 'contact' or 'connect' to proceed
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="connection-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 text-left font-mono max-w-md mx-auto"
              >
                <div className="space-y-1">
                  {logs.map((log, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-[10px] ${i === logs.length - 1 ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {log}
                    </motion.p>
                  ))}
                </div>

                {logs.length === 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 border-t border-primary/20 space-y-3"
                  >
                    <div className="flex flex-col space-y-1">
                      <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Email_Channel:</span>
                      <a href={`mailto:${email}`} className="text-sm md:text-base font-bold text-primary hover:underline transition-all decoration-primary/30 underline-offset-4">
                        {email}
                      </a>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Secure_Node:</span>
                      <a 
                        href={linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm md:text-base font-bold text-primary hover:underline transition-all decoration-primary/30 underline-offset-4"
                      >
                        LinkedIn_Profile
                      </a>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}