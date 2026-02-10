import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  Code, 
  ExternalLink, 
  ChevronRight, 
  History,
  Terminal as TerminalIcon,
  Zap,
  AlertTriangle,
  Layers,
  Flag,
  Settings,
  Activity,
  Coins,
  Bug,
  Loader2, // Added for build status
  CheckCircle, // Added for build status
  XCircle, // Added for build status
  Play, // Added for start build button
  Sparkle, // Added for AI explanation
  X // Added for close button
} from 'lucide-react';
import Terminal from './components/Terminal';
import ChatInterface from './components/ChatInterface';
import { 
  BITCOIN_METADATA, 
  DEPENDENCIES, 
  BUILD_STEPS, 
  TECHNICAL_ANALYSIS, 
  INTRODUCTION, 
  SETUP_INSTRUCTIONS 
} from './constants';
import { BuildStepWithStatus } from './types'; // Import the new interface
import { explainTechnicalDetail } from './services/geminiService'; // Import the new service function

const initialBuildStepsWithStatus: BuildStepWithStatus[] = BUILD_STEPS.map(step => ({
  ...step,
  status: 'pending',
}));

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'readme' | 'dependencies' | 'build' | 'ai' | 'dive' | 'setup'>('readme');
  const [isMining, setIsMining] = useState(false);
  const [buildStepsStatus, setBuildStepsStatus] = useState<BuildStepWithStatus[]>(initialBuildStepsWithStatus);
  const [overallBuildStatus, setOverallBuildStatus] = useState<'idle' | 'in-progress' | 'completed' | 'failed'>('idle');
  
  // State for AI explanation in Deep Dive
  const [aiExplanationContent, setAiExplanationContent] = useState<string | null>(null);
  const [aiExplanationLoading, setAiExplanationLoading] = useState<boolean>(false);
  const [aiExplanationItemId, setAiExplanationItemId] = useState<string | null>(null); // To track which item's explanation is open

  const simulateBuild = async () => {
    setOverallBuildStatus('in-progress');
    setBuildStepsStatus(initialBuildStepsWithStatus); // Reset all statuses to pending

    for (let i = 0; i < initialBuildStepsWithStatus.length; i++) {
      // Set current step to building
      setBuildStepsStatus(prev => {
        const newStatus = [...prev];
        newStatus[i] = { ...newStatus[i], status: 'building' };
        return newStatus;
      });

      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Simulate delay

      // Randomly decide success or failure
      const success = Math.random() > 0.15; // 15% chance of failure for demonstration

      setBuildStepsStatus(prev => {
        const newStatus = [...prev];
        newStatus[i] = { ...newStatus[i], status: success ? 'complete' : 'failed' };
        return newStatus;
      });

      if (!success) {
        setOverallBuildStatus('failed');
        return; // Stop on first failure
      }
    }
    setOverallBuildStatus('completed');
  };

  const handleAiExplain = async (id: string, title: string, content: string) => {
    if (aiExplanationItemId === id && aiExplanationContent) {
      // If same item is clicked and already open, close it
      setAiExplanationContent(null);
      setAiExplanationItemId(null);
      return;
    }

    setAiExplanationContent(null); // Clear previous explanation
    setAiExplanationItemId(id); // Set the ID of the current item
    setAiExplanationLoading(true);
    const explanation = await explainTechnicalDetail(title, content);
    setAiExplanationContent(explanation);
    setAiExplanationLoading(false);
  };

  const readmeLines = [
    `BitCoin v${BITCOIN_METADATA.version}`,
    "",
    BITCOIN_METADATA.copyright,
    `เผยแพร่ภายใต้ใบอนุญาต ${BITCOIN_METADATA.license}`,
    `ดูรายละเอียด: ${BITCOIN_METADATA.licenseUrl}`,
    "",
    "บทนำ (Introduction):",
    "-------------------",
    INTRODUCTION.content,
    "",
    "ระบบปฏิบัติการที่รองรับ:",
    `- ${SETUP_INSTRUCTIONS.os_support}`,
    "",
    "การเชื่อมต่อเครือข่าย:",
    "- ค้นหาโหนดอัตโนมัติ...",
    "- กรุณาเปิดพอร์ต 8333 สำหรับการเชื่อมต่อขาเข้า",
    "",
    "Satoshi: \"Bitcoin does not use any encryption. If you want to do the exact opposite...\"",
    "Establishing peer-to-peer network...",
    "Done.",
  ];

  return (
    <div className="min-h-screen pb-20 px-4 pt-8 md:px-12 lg:px-24 max-w-7xl mx-auto relative">
      {/* Header */}
      <header className="mb-12 border-b border-[#003b00] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2 flex items-center gap-3">
            <span className="text-black bg-[#00ff41] px-2 py-0.5 rounded">BITCOIN</span>
            <span className="text-[#00ff41]">v0.01</span>
          </h1>
          <p className="text-sm opacity-60 flex items-center gap-2">
            <History size={14} />
            Genesis Snapshot: January 3, 2009
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4">
          <button 
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-2 text-[10px] md:text-xs uppercase tracking-widest border transition-all ${activeTab === 'readme' ? 'border-[#00ff41] bg-[#003b00]/20' : 'border-[#003b00] hover:border-[#00ff41]'}`}
          >
            README (TH)
          </button>
          <button 
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-2 text-[10px] md:text-xs uppercase tracking-widest border transition-all ${activeTab === 'setup' ? 'border-[#00ff41] bg-[#003b00]/20' : 'border-[#003b00] hover:border-[#00ff41]'}`}
          >
            Setup
          </button>
          <button 
            onClick={() => setActiveTab('dependencies')}
            className={`px-3 py-2 text-[10px] md:text-xs uppercase tracking-widest border transition-all ${activeTab === 'dependencies' ? 'border-[#00ff41] bg-[#003b00]/20' : 'border-[#003b00] hover:border-[#00ff41]'}`}
          >
            Deps
          </button>
          <button 
            onClick={() => setActiveTab('build')} // New tab for build process
            className={`px-3 py-2 text-[10px] md:text-xs uppercase tracking-widest border transition-all ${activeTab === 'build' ? 'border-[#00ff41] bg-[#003b00]/20' : 'border-[#003b00] hover:border-[#00ff41]'}`}
          >
            Build
          </button>
          <button 
            onClick={() => setActiveTab('dive')}
            className={`px-3 py-2 text-[10px] md:text-xs uppercase tracking-widest border transition-all ${activeTab === 'dive' ? 'border-[#00ff41] bg-[#003b00]/20' : 'border-[#003b00] hover:border-[#00ff41]'}`}
          >
            Deep Dive
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-2 text-[10px] md:text-xs uppercase tracking-widest border transition-all ${activeTab === 'ai' ? 'border-[#00ff41] bg-[#003b00]/20' : 'border-[#003b00] hover:border-[#00ff41]'}`}
          >
            AI History
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Primary Content */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'readme' && (
            <section className="space-y-6 animate-in fade-in duration-700">
              <div className="flex items-center gap-2 text-[#00ff41]">
                <TerminalIcon size={20} />
                <h2 className="text-xl font-semibold">System Terminal (v0.01)</h2>
              </div>
              <Terminal lines={readmeLines} />
              
              {/* New Generate Coins button for README tab */}
              <div className="p-4 bg-black/40 border border-[#003b00] rounded text-xs text-center">
                <p className="mb-3 opacity-70">
                  <span className="font-bold text-[#00ff41]">README Instruction:</span> หากต้องการสนับสนุนเครือข่าย ให้ไปที่: ตัวเลือก -> สร้างเหรียญ (Generate Coins)
                </p>
                <button 
                  onClick={() => setIsMining(!isMining)}
                  className={`w-full py-2 px-4 rounded font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                    isMining 
                    ? 'bg-[#00ff41] text-black shadow-[0_0_15px_#00ff41]' 
                    : 'bg-[#003b00] text-[#00ff41] border border-[#00ff41]/50'
                  }`}
                >
                  {isMining ? <Coins size={16} className="animate-pulse" /> : <Coins size={16} />}
                  {isMining ? 'STAMPING BLOCKS...' : 'GENERATE COINS'}
                </button>
              </div>

              <div className="p-4 bg-[#003b00]/10 border border-[#003b00] rounded">
                <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-[#00ff41]">
                  <Activity size={16} />
                  Network Philosophy
                </h3>
                <p className="text-xs leading-relaxed opacity-70">
                  {INTRODUCTION.content}
                </p>
              </div>
            </section>
          )}

          {activeTab === 'setup' && (
            <section className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-2 text-[#00ff41]">
                <Settings size={20} />
                <h2 className="text-xl font-semibold">{SETUP_INSTRUCTIONS.title}</h2>
              </div>
              <div className="space-y-4">
                {SETUP_INSTRUCTIONS.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 border border-[#003b00] bg-black/40 rounded">
                    <div className="mt-1 w-6 h-6 flex items-center justify-center border border-[#00ff41] text-[#00ff41] text-[10px] font-bold rounded-full flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-[#003b00]/20 border border-[#00ff41]/30 rounded text-xs">
                <span className="font-bold text-[#00ff41]">Technical Reward:</span> ในการสนับสนุนเครือข่าย คุณจะได้รับเหรียญเมื่อสร้างบล็อกสำเร็จ (Block Rewards).
              </div>
            </section>
          )}

          {activeTab === 'dependencies' && (
            <section className="space-y-6 animate-in slide-in-from-left duration-500">
              <div className="flex items-center gap-2 text-[#00ff41]">
                <Database size={20} />
                <h2 className="text-xl font-semibold">Required Libraries (2009 Stack)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEPENDENCIES.map((dep, idx) => (
                  <div key={idx} className="p-6 border border-[#003b00] rounded-lg bg-black hover:border-[#00ff41] transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-[#00ff41] group-hover:drop-shadow-[0_0_8px_#00ff41]">{dep.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 bg-[#003b00] text-[#00ff41] rounded">{dep.license}</span>
                    </div>
                    <p className="text-sm opacity-60 mb-6 min-h-[4rem]">{dep.description}</p>
                    <div className="flex flex-col gap-2 text-[11px] font-mono">
                      <div className="flex items-center gap-2 opacity-40">
                        <ChevronRight size={12} />
                        Path: {dep.path}
                      </div>
                      <a 
                        href={dep.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-[#00ff41] hover:underline"
                      >
                        <ExternalLink size={12} />
                        Download Source
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'build' && (
            <section className="space-y-6 animate-in fade-in duration-700">
              <div className="flex items-center gap-2 text-[#00ff41]">
                <Code size={20} />
                <h2 className="text-xl font-semibold">Bitcoin v0.01 Build Process</h2>
              </div>

              {/* Start/Reset Build Button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={simulateBuild}
                  disabled={overallBuildStatus === 'in-progress'}
                  className={`px-6 py-3 rounded font-bold text-sm uppercase transition-all flex items-center gap-2 ${
                    overallBuildStatus === 'in-progress'
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[#00ff41] text-black shadow-[0_0_15px_#00ff41] hover:bg-opacity-80'
                  }`}
                >
                  {overallBuildStatus === 'in-progress' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> BUILDING...
                    </>
                  ) : overallBuildStatus === 'completed' ? (
                    <>
                      <CheckCircle size={18} /> BUILD COMPLETE
                    </>
                  ) : overallBuildStatus === 'failed' ? (
                    <>
                      <XCircle size={18} /> BUILD FAILED
                    </>
                  ) : (
                    <>
                      <Play size={18} /> START BUILD
                    </>
                  )}
                </button>
                {overallBuildStatus !== 'idle' && (
                  <button
                    onClick={() => {
                      setBuildStepsStatus(initialBuildStepsWithStatus);
                      setOverallBuildStatus('idle');
                    }}
                    className="px-4 py-2 border border-[#003b00] text-[#00ff41] text-xs uppercase rounded hover:border-[#00ff41] transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Build Steps List */}
              <div className="space-y-8">
                {buildStepsStatus.map((step, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300
                      ${step.status === 'pending' ? 'bg-[#003b00] border border-[#00ff41]' : ''}
                      ${step.status === 'building' ? 'bg-yellow-500' : ''}
                      ${step.status === 'complete' ? 'bg-green-500' : ''}
                      ${step.status === 'failed' ? 'bg-red-500' : ''}
                    `}>
                      {step.status === 'building' && <Loader2 size={10} className="text-black animate-spin" />}
                      {step.status === 'complete' && <CheckCircle size={10} className="text-black" />}
                      {step.status === 'failed' && <XCircle size={10} className="text-black" />}
                    </div>
                    <div className={`border-l border-[#003b00]/40 pb-8 ${idx === buildStepsStatus.length - 1 ? 'border-l-0 pb-0' : ''}`}>
                      <h3 className="text-lg font-semibold text-[#00ff41] mb-2">{step.title}</h3>
                      <ul className="text-sm opacity-60 space-y-2 mb-3 list-disc list-inside">
                        {step.instructions.map((ins, i) => (
                          <li key={i}>{ins}</li>
                        ))}
                      </ul>
                      {step.command && (
                        <div className="bg-black p-3 rounded text-xs font-mono border border-[#003b00] overflow-x-auto whitespace-nowrap">
                          <span className="text-pink-500">$</span> {step.command}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'dive' && (
            <section className="space-y-8 animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-2 text-[#00ff41]">
                <Layers size={20} />
                <h2 className="text-xl font-semibold">Technical Deep Dive</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {TECHNICAL_ANALYSIS.compilers.map((comp, i) => (
                    <div key={`compiler-${i}`} className="p-6 bg-black border border-[#003b00] rounded-lg">
                      <h3 className="text-[#00ff41] font-bold flex items-center gap-2 mb-3">
                        <Cpu size={16} />
                        {comp.name}
                        <button 
                          onClick={() => handleAiExplain(`compiler-${i}`, comp.name, `${comp.purpose} ${comp.details}`)}
                          className="ml-auto text-[#00ff41] opacity-70 hover:opacity-100 transition-opacity"
                          aria-label={`Explain ${comp.name} with AI`}
                        >
                          <Sparkle size={16} />
                        </button>
                      </h3>
                      <p className="text-xs opacity-70 mb-4">{comp.purpose}</p>
                      <div className="p-3 bg-[#003b00]/10 rounded border border-[#003b00]/30 font-mono text-[10px] mb-3">
                        <span className="text-[#00ff41]">FLAGS:</span> {comp.flags}
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-50 italic">{comp.details}</p>
                      {aiExplanationItemId === `compiler-${i}` && (
                        <div className="mt-4 p-3 bg-black/80 border border-[#00ff41]/30 rounded text-xs italic relative animate-in fade-in">
                          <button 
                            onClick={() => {setAiExplanationContent(null); setAiExplanationItemId(null);}}
                            className="absolute top-1 right-1 text-[#00ff41] opacity-70 hover:opacity-100"
                            aria-label="Close AI explanation"
                          >
                            <X size={12} />
                          </button>
                          {aiExplanationLoading ? (
                            <div className="flex items-center gap-2 text-[#00ff41] animate-pulse">
                              <Loader2 size={12} className="animate-spin" />
                              <span>AI is thinking...</span>
                            </div>
                          ) : (
                            <p>{aiExplanationContent}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-black border border-[#003b00] rounded-lg">
                  <h3 className="text-[#00ff41] font-bold flex items-center gap-2 mb-4">
                    <Flag size={16} />
                    MSVC 6.0 Flag Elaboration
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {TECHNICAL_ANALYSIS.msvc_flag_details.map((detail, i) => (
                      <div key={`msvc-flag-${i}`} className="p-4 border border-[#003b00]/30 rounded bg-[#003b00]/5 flex flex-col md:flex-row gap-4">
                        <div className="font-mono text-[#00ff41] text-lg min-w-[100px] flex items-center">{detail.flag}</div>
                        <div>
                          <h4 className="text-xs font-bold text-[#00ff41] uppercase mb-1 flex items-center gap-2">
                            {detail.name}
                            <button 
                              onClick={() => handleAiExplain(`msvc-flag-${i}`, detail.name, detail.description)}
                              className="text-[#00ff41] opacity-70 hover:opacity-100 transition-opacity"
                              aria-label={`Explain ${detail.name} with AI`}
                            >
                              <Sparkle size={14} />
                            </button>
                          </h4>
                          <p className="text-xs opacity-70 leading-relaxed">{detail.description}</p>
                        </div>
                        {aiExplanationItemId === `msvc-flag-${i}` && (
                          <div className="mt-4 md:mt-0 md:ml-4 p-3 bg-black/80 border border-[#00ff41]/30 rounded text-xs italic relative animate-in fade-in">
                            <button 
                              onClick={() => {setAiExplanationContent(null); setAiExplanationItemId(null);}}
                              className="absolute top-1 right-1 text-[#00ff41] opacity-70 hover:opacity-100"
                              aria-label="Close AI explanation"
                            >
                              <X size={12} />
                            </button>
                            {aiExplanationLoading ? (
                              <div className="flex items-center gap-2 text-[#00ff41] animate-pulse">
                                <Loader2 size={12} className="animate-spin" />
                                <span>AI is thinking...</span>
                              </div>
                            ) : (
                              <p>{aiExplanationContent}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-black border border-[#003b00] rounded-lg">
                  <h3 className="text-[#00ff41] font-bold flex items-center gap-2 mb-4">
                    <Zap size={16} />
                    OpenSSL Minimal Build Patches
                  </h3>
                  <div className="space-y-4">
                    {TECHNICAL_ANALYSIS.openssl_hacks.map((hack, i) => (
                      <div key={`openssl-hack-${i}`} className="flex flex-col gap-2 p-4 border-l-2 border-[#00ff41]/50 bg-[#003b00]/5">
                        <div className="font-mono text-sm text-[#00ff41] flex items-center gap-2">
                          {hack.flag}
                          <button 
                            onClick={() => handleAiExplain(`openssl-hack-${i}`, hack.flag, `${hack.meaning} ${hack.rationale}`)}
                            className="text-[#00ff41] opacity-70 hover:opacity-100 transition-opacity"
                            aria-label={`Explain ${hack.flag} with AI`}
                          >
                            <Sparkle size={14} />
                          </button>
                        </div>
                        <div className="text-xs">
                          <div className="font-bold mb-1">{hack.meaning}</div>
                          <div className="opacity-60">{hack.rationale}</div>
                        </div>
                        {aiExplanationItemId === `openssl-hack-${i}` && (
                          <div className="mt-2 p-3 bg-black/80 border border-[#00ff41]/30 rounded text-xs italic relative animate-in fade-in">
                            <button 
                              onClick={() => {setAiExplanationContent(null); setAiExplanationItemId(null);}}
                              className="absolute top-1 right-1 text-[#00ff41] opacity-70 hover:opacity-100"
                              aria-label="Close AI explanation"
                            >
                              <X size={12} />
                            </button>
                            {aiExplanationLoading ? (
                              <div className="flex items-center gap-2 text-[#00ff41] animate-pulse">
                                <Loader2 size={12} className="animate-spin" />
                                <span>AI is thinking...</span>
                              </div>
                            ) : (
                              <p>{aiExplanationContent}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-[#003b00]/5 border border-[#003b00] rounded-lg">
                  <h3 className="text-[#00ff41] font-bold flex items-center gap-2 mb-4">
                    <AlertTriangle size={16} />
                    Common Build Pitfalls (2009-era)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {TECHNICAL_ANALYSIS.pitfalls.map((pit, i) => (
                      <div key={`pitfall-${i}`} className="p-4 border border-[#003b00]/30 rounded bg-black/40">
                        <h4 className="text-[11px] font-bold text-[#00ff41] mb-2 uppercase flex items-center gap-1">
                          <Bug size={12} /> {pit.title}
                          <button 
                            onClick={() => handleAiExplain(`pitfall-${i}`, pit.title, pit.description)}
                            className="ml-auto text-[#00ff41] opacity-70 hover:opacity-100 transition-opacity"
                            aria-label={`Explain ${pit.title} with AI`}
                          >
                            <Sparkle size={12} />
                          </button>
                        </h4>
                        <p className="text-[10px] opacity-60 leading-relaxed">{pit.description}</p>
                        {aiExplanationItemId === `pitfall-${i}` && (
                          <div className="mt-2 p-3 bg-black/80 border border-[#00ff41]/30 rounded text-xs italic relative animate-in fade-in">
                            <button 
                              onClick={() => {setAiExplanationContent(null); setAiExplanationItemId(null);}}
                              className="absolute top-1 right-1 text-[#00ff41] opacity-70 hover:opacity-100"
                              aria-label="Close AI explanation"
                            >
                              <X size={12} />
                            </button>
                            {aiExplanationLoading ? (
                              <div className="flex items-center gap-2 text-[#00ff41] animate-pulse">
                                <Loader2 size={12} className="animate-spin" />
                                <span>AI is thinking...</span>
                              </div>
                            ) : (
                              <p>{aiExplanationContent}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'ai' && (
            <section className="space-y-6 animate-in zoom-in duration-500">
              <div className="flex items-center gap-2 text-[#00ff41]">
                <Cpu size={20} />
                <h2 className="text-xl font-semibold">AI Blockchain Archeologist</h2>
              </div>
              <ChatInterface />
            </section>
          )}
        </div>

        {/* Right Column: Mining Control & Network Status (removed static build procedure) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Mining Control (Interactive Historical Option) */}
          <div className="p-6 border border-[#00ff41]/30 rounded-lg bg-black shadow-[0_0_15px_rgba(0,255,65,0.1)]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#00ff41] mb-4 flex items-center gap-2">
              <Coins size={16} />
              สร้างเหรียญ (Mining)
            </h2>
            <div className="space-y-4">
              <p className="text-[10px] opacity-60 leading-relaxed">
                คอมพิวเตอร์ของคุณกำลังแก้ปัญหาที่ยากมากเพื่อล็อกบล็อกธุรกรรม
              </p>
              <button 
                onClick={() => setIsMining(!isMining)}
                className={`w-full py-2 px-4 rounded font-bold text-xs uppercase transition-all ${
                  isMining 
                  ? 'bg-[#00ff41] text-black shadow-[0_0_15px_#00ff41]' 
                  : 'bg-[#003b00] text-[#00ff41] border border-[#00ff41]/50'
                }`}
              >
                {isMining ? 'STAMPING BLOCKS...' : 'GENERATE COINS'}
              </button>
              {isMining && (
                <div className="flex flex-col gap-1">
                  <div className="h-1 bg-[#003b00] w-full rounded-full overflow-hidden">
                    <div className="h-full bg-[#00ff41] animate-[pulse_1.5s_infinite]" style={{ width: '45%' }} />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono opacity-40">
                    <span>CPU LOAD: IDLE TASK</span>
                    <span>DIFF: 1</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border border-[#003b00] rounded-lg bg-black shadow-[inset_0_0_10px_rgba(0,255,65,0.05)]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#00ff41] mb-4">Network Status</h2>
            <div className="space-y-3 text-[11px] font-mono">
              <div className="flex justify-between items-center opacity-60">
                <span>Protocol Version:</span>
                <span className="text-[#00ff41]">1</span>
              </div>
              <div className="flex justify-between items-center opacity-60">
                <span>Port Mapping:</span>
                <span className="text-[#00ff41]">8333</span>
              </div>
              <div className="flex justify-between items-center opacity-60">
                <span>Block Reward:</span>
                <span className="text-[#00ff41]">50.00 BTC</span>
              </div>
              <div className="pt-3 border-t border-[#003b00]/30 mt-3">
                <div className="flex items-center gap-2 text-[#00ff41] animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41]" />
                  <span>SYNCHRONIZING GENESIS...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 pt-8 border-t border-[#003b00]/30 text-center opacity-40 text-[10px] uppercase tracking-[0.2em]">
        <p>&copy; 2009 {BITCOIN_METADATA.author} | {BITCOIN_METADATA.license}</p>
      </footer>
    </div>
  );
};

export default App;