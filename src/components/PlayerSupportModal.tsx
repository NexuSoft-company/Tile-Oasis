import React, { useState } from 'react';
import { globalSupportService } from '../services/admin/SupportService';
import { globalAudioService } from '../services/AudioService';
import { SupportCategory } from '../types/adminDashboard';
import { FAQ_DATABASE, SUPPORT_LANGUAGES, AppLanguage } from '../data/faqData';
import {
  X,
  MessageSquare,
  Bug,
  HelpCircle,
  Lightbulb,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HeadphonesIcon
} from 'lucide-react';

interface PlayerSupportModalProps {
  onClose: () => void;
}

export const PlayerSupportModal: React.FC<PlayerSupportModalProps> = ({ onClose }) => {
  const [activeLanguage, setActiveLanguage] = useState<AppLanguage>('en');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState<boolean>(false);

  // Form State
  const [category, setCategory] = useState<SupportCategory>('HELP');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFaqToggle = (id: string) => {
    globalAudioService.emit('ButtonPressed');
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    // Hardcoded for the current session/player. Real app would pull from user context.
    globalSupportService.submitTicket({
      userId: 'player_1',
      userName: 'Local Sanctuary Master',
      userEmail: 'shahroz.mughal.31@gmail.com',
      category,
      subject,
      message,
    });

    globalAudioService.emit('ButtonPressed');
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-in fade-in">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-center space-y-4">
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              onClose();
            }}
            className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">Message Sent</h2>
          <p className="text-sm text-slate-300">
            Thank you! Our support team will review your message shortly.
          </p>
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              onClose();
            }}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center shadow-inner">
              <HeadphonesIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                {showContactForm ? 'Contact Team' : 'Help & Support'}
              </h2>
              <span className="text-[10px] text-teal-400 font-bold font-mono">
                {showContactForm ? 'SEND US A MESSAGE' : 'FREQUENTLY ASKED QUESTIONS'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-800 rounded-full text-slate-400 transition-colors relative z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Content Body */}
        <div className="overflow-y-auto flex-1 flex flex-col">
          {!showContactForm ? (
            /* ================= VIEW 1: FAQ DATABASE ================= */
            <div className="p-4 space-y-4">
              
              {/* Language Selector */}
              <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto hide-scrollbar">
                {SUPPORT_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      globalAudioService.emit('ButtonPressed');
                      setActiveLanguage(lang.code);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      activeLanguage === lang.code 
                        ? 'bg-teal-500 text-slate-950' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="space-y-2 pb-6">
                {FAQ_DATABASE.map(faq => {
                  const isExpanded = expandedFaqId === faq.id;
                  const direction = activeLanguage === 'ur' || activeLanguage === 'ar' ? 'rtl' : 'ltr';
                  return (
                    <div 
                      key={faq.id} 
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isExpanded ? 'bg-slate-800/50 border-teal-500/30' : 'bg-slate-950 border-slate-800'
                      }`}
                      dir={direction}
                    >
                      <button
                        onClick={() => handleFaqToggle(faq.id)}
                        className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-white hover:bg-slate-900/50 transition-colors"
                      >
                        <span className="flex-1 pr-4 leading-relaxed">{faq.q[activeLanguage]}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 pt-0 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 mt-2 pt-3 bg-slate-900/30">
                          {faq.a[activeLanguage]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ================= VIEW 2: CONTACT ADMIN FORM ================= */
            <div className="p-4 space-y-5">
              <form id="support-form" onSubmit={handleSubmitContact} className="space-y-4">
                
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">How can we help?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'HELP', icon: HelpCircle, label: 'General' },
                      { id: 'BUG', icon: Bug, label: 'Bug' },
                      { id: 'SUGGESTION', icon: Lightbulb, label: 'Idea' }
                    ].map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          globalAudioService.emit('ButtonPressed');
                          setCategory(c.id as SupportCategory);
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          category === c.id 
                            ? 'bg-teal-500/20 border-teal-500 text-teal-300' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <c.icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Briefly describe the issue..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Message</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide more details here..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                  />
                </div>

              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex flex-col space-y-2">
          {!showContactForm ? (
            <>
              <p className="text-center text-[10px] text-slate-500 mb-1">Still need help? Only messages sent from here will reach the Admin Dashboard.</p>
              <button
                onClick={() => {
                  globalAudioService.emit('ButtonPressed');
                  setShowContactForm(true);
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm active:scale-95 transition-all flex items-center justify-center space-x-2 border border-slate-700"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Our Team</span>
              </button>
            </>
          ) : (
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  globalAudioService.emit('ButtonPressed');
                  setShowContactForm(false);
                }}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm active:scale-95 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                form="support-form"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Ticket</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
