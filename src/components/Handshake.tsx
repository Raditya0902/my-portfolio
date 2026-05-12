import React from 'react';

interface HandshakeProps {
  email: string;
  linkedinUrl: string;
}

const githubUrl = 'https://github.com/Raditya0902';
const resumeUrl = 'https://github.com/Raditya0902';

export default function Handshake({ email, linkedinUrl }: HandshakeProps) {
  const rows = [
    { label: 'STATUS:', value: 'AVAILABLE_FOR_HIRE' },
    { label: 'LOCATION:', value: 'Tempe, AZ — open to remote' },
    { label: 'RESPONSE:', value: '< 24h' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="min-h-[300px] h-full bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-center p-8 md:p-12 text-center group hover:bg-primary/10 transition-all overflow-hidden relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity z-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, var(--primary) 0, var(--primary) 1px, transparent 0, transparent 50%)',
              backgroundSize: '10px 10px',
            }}
          />
        </div>

        <div className="relative z-10 w-fit mx-auto font-mono text-left">
          <div className="space-y-2 text-xs md:text-sm leading-relaxed">
            {rows.map((row) => (
              <p key={row.label} className="grid grid-cols-[auto_6.5rem_1fr] gap-2">
                <span className="text-green-500">&gt;</span>
                <span className="text-muted-foreground">{row.label}</span>
                <span className="text-foreground">{row.value}</span>
              </p>
            ))}

            <p className="grid grid-cols-[auto_6.5rem_1fr] gap-2">
              <span className="text-green-500">&gt;</span>
              <span className="text-muted-foreground">CONTACT:</span>
              <a href={`mailto:${email}`} className="text-foreground no-underline hover:underline underline-offset-4">
                {email}
              </a>
            </p>

            <p className="grid grid-cols-[auto_6.5rem_1fr] gap-2">
              <span className="text-green-500">&gt;</span>
              <span className="text-muted-foreground">LINKS:</span>
              <span className="text-foreground">
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-foreground no-underline hover:underline underline-offset-4">
                  GitHub
                </a>
                <span> · </span>
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-foreground no-underline hover:underline underline-offset-4">
                  LinkedIn
                </a>
                <span className="handshake-cursor" aria-hidden="true">|</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes handshake-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }

          .handshake-cursor {
            display: inline-block;
            margin-left: 0.25rem;
            animation: handshake-blink 1s step-end infinite;
          }
        `}
      </style>
    </div>
  );
}
