
import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal as TerminalIcon, ShieldAlert } from 'lucide-react';
import { askSatoshi } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const response = await askSatoshi(input);
    
    const aiMsg: ChatMessage = {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] border border-[#003b00] rounded-lg bg-black/60 shadow-[0_0_30px_rgba(0,59,0,0.3)]">
      <div className="p-3 border-b border-[#003b00] flex items-center gap-2 text-xs uppercase tracking-widest text-[#00ff41]/70">
        <TerminalIcon size={14} />
        <span>Satoshi Archive Historian - Active Session</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <ShieldAlert size={48} className="mb-4" />
            <p>Ask about Berkeley DB, secp256k1, or why Bitcoin was built on C++ in 2009.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3 rounded border ${
              msg.role === 'user' 
                ? 'bg-[#003b00]/20 border-[#00ff41]/30 text-[#00ff41]' 
                : 'bg-black border-[#003b00] text-[#00ff41]'
            }`}>
              <div className="text-[10px] opacity-50 mb-1 flex justify-between gap-4">
                <span>{msg.role === 'user' ? 'YOU' : 'ARCHIVE_NODE'}</span>
                <span>{msg.timestamp.toLocaleTimeString()}</span>
              </div>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 items-center text-[#00ff41] text-xs animate-pulse">
            <div className="w-2 h-2 rounded-full bg-[#00ff41]" />
            <span>Decoding Genesis Block...</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#003b00] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Enter command or query..."
          className="flex-1 bg-black border border-[#003b00] rounded p-2 text-sm text-[#00ff41] focus:outline-none focus:border-[#00ff41] transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-[#003b00] hover:bg-[#00ff41] hover:text-black p-2 rounded transition-all disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
