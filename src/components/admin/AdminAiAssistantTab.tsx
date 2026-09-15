/**
 * AI Operations & Analytics Assistant Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState } from 'react';
import {
  globalAdminAiAssistantService,
  AiAssistantResponse,
} from '../../services/admin/AdminAiAssistantService';
import {
  Sliders,
  Send,
  Activity,
  User,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Clock,
} from 'lucide-react';

interface AdminAiAssistantTabProps {
  onNavigateTab: (tab: string) => void;
}

const PRELOADED_QUERIES = [
  'Which levels have the highest failure rate?',
  'Which boosters are used most?',
  'What support problems are most common?',
  'Which rewards are being claimed most?',
  'Show me unusual economy activity.',
  "Summarize today's important issues.",
];

export const AdminAiAssistantTab: React.FC<AdminAiAssistantTabProps> = ({ onNavigateTab }) => {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<AiAssistantResponse[]>([
    {
      id: 'init_welcome',
      query: 'System Status Check',
      answer:
        'Hello Super Admin. I am your Tile Oasis operational diagnostics console. You can run analytical queries regarding level balance drop-offs, tactical booster demand, ad performance, or customer support queues.',
      timestamp: Date.now(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSend = async (queryToRun: string) => {
    if (!queryToRun.trim() || isProcessing) return;

    setIsProcessing(true);
    setInputText('');

    const res = await globalAdminAiAssistantService.processQuery(queryToRun);
    setMessages((prev) => [...prev, res]);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-black uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Live-Ops Diagnostic Console</span>
          </div>
          <h2 className="text-lg font-black text-white">
            Tactical Operations & Diagnostic Console
          </h2>
          <p className="text-xs text-slate-400">
            Automated reasoning over game metrics, difficulty curves, and support queues. Direct destructive actions require manual Super Admin approval.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-teal-300 font-mono font-bold flex items-center space-x-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Safety Guard Active</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 block">Suggested Diagnostic Queries:</span>
        <div className="flex flex-wrap gap-2">
          {PRELOADED_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 hover:border-teal-500/40 transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[420px]">
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((m) => (
            <div key={m.id} className="space-y-2">
              {/* User Prompt */}
              {m.query !== 'System Status Check' && (
                <div className="flex items-start justify-end space-x-2">
                  <div className="bg-slate-800 text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-lg font-medium border border-slate-700">
                    {m.query}
                  </div>
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-teal-300 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* System Answer */}
              <div className="flex items-start space-x-2">
                <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl rounded-tl-none text-xs max-w-xl space-y-3 border border-slate-800 shadow-md">
                  <div className="leading-relaxed whitespace-pre-line">{m.answer}</div>

                  {/* Recommendation Proposal Box */}
                  {m.recommendedAction && (
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-teal-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-teal-400 uppercase tracking-wider flex items-center space-x-1">
                          <Sliders className="w-3 h-3" />
                          <span>Operational Recommendation</span>
                        </span>
                        {m.recommendedAction.requiresSuperAdminConfirmation && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Super Admin Approval Required
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-300">{m.recommendedAction.description}</p>

                      {m.recommendedAction.targetTab && (
                        <button
                          onClick={() => onNavigateTab(m.recommendedAction!.targetTab!)}
                          className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 transition-all"
                        >
                          <span>{m.recommendedAction.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center space-x-2 text-xs text-teal-400 p-3">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>Analyzing puzzle engine and economy telemetry...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Search diagnostic query on levels, booster usage, drop-offs, or players..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-medium"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Run Query</span>
          </button>
        </form>
      </div>
    </div>
  );
};
