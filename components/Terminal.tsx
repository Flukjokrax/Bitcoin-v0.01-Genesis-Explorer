
import React, { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  lines: string[];
  speed?: number;
}

const Terminal: React.FC<TerminalProps> = ({ lines, speed = 20 }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLineIndex < lines.length) {
      const line = lines[currentLineIndex];
      if (currentText.length < line.length) {
        const timeout = setTimeout(() => {
          setCurrentText(prev => prev + line[currentText.length]);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        setDisplayedLines(prev => [...prev, line]);
        setCurrentText("");
        setCurrentLineIndex(prev => prev + 1);
      }
    }
  }, [currentLineIndex, currentText, lines, speed]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedLines, currentText]);

  return (
    <div 
      ref={terminalRef}
      className="bg-black/80 border border-[#003b00] p-6 rounded-lg font-mono text-sm leading-relaxed h-[400px] overflow-y-auto shadow-[0_0_20px_rgba(0,59,0,0.5)]"
    >
      {displayedLines.map((line, i) => (
        <div key={i} className="mb-1 text-[#00ff41]">{line}</div>
      ))}
      {currentLineIndex < lines.length && (
        <div className="text-[#00ff41]">
          {currentText}
          <span className="inline-block w-2 h-4 bg-[#00ff41] ml-1 animate-pulse" />
        </div>
      )}
      {currentLineIndex >= lines.length && (
        <div className="text-[#00ff41]">
          <span className="opacity-50">$</span>
          <span className="inline-block w-2 h-4 bg-[#00ff41] ml-1 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default Terminal;
