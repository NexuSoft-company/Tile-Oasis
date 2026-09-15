import React, { useState } from 'react';
import { ShieldCheck, FileText, X, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';
import { globalAudioService } from '../services/AudioService';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'PRIVACY' | 'TERMS'>('PRIVACY');

  if (!isOpen) return null;

  const handleClose = () => {
    globalAudioService.emit('ButtonPressed');
    onClose();
  };

  return (
    <div
      id="privacy-policy-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="privacy-policy-modal-content"
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-slate-950/70 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide">Legal & Privacy</h2>
              <p className="text-[11px] text-slate-400">Tile Oasis: Sanctuary Match</p>
            </div>
          </div>
          <button
            id="close-privacy-policy-btn"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 px-5 pt-2 bg-slate-900/90 gap-2">
          <button
            id="tab-privacy-policy-btn"
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveTab('PRIVACY');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'PRIVACY'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
          <button
            id="tab-terms-service-btn"
            onClick={() => {
              globalAudioService.emit('ButtonPressed');
              setActiveTab('TERMS');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'TERMS'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs text-slate-300 leading-relaxed custom-scrollbar">
          {activeTab === 'PRIVACY' ? (
            <>
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-200 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy First:</strong> We do not require account registration or store your personal identification on external servers.
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-teal-400 mb-1">1. Information Stored Locally</h3>
                <p>
                  Game progression (levels completed, world badges, sanctuary unlocks, star scores) and currency balances (coins, gems, boosters) are saved directly on your device storage.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-teal-400 mb-1">2. Advertising (Google AdMob)</h3>
                <p>
                  We use Google AdMob to serve in-game banner, interstitial, and rewarded video ads. Google AdMob may utilize your device&apos;s Advertising ID (AD_ID) to deliver relevant ads and prevent fraud according to Google&apos;s Privacy Policy.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-teal-400 mb-1">3. Children&apos;s Privacy (COPPA)</h3>
                <p>
                  This game is rated for all ages. We do not knowingly collect personal information from children under 13.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-teal-400 mb-1">4. Data Deletion & Rights</h3>
                <p>
                  You can purge and delete your entire gameplay progress at any time using the <em>&quot;Reset Local Sanctuary Save&quot;</em> button in Settings.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>Developer Contact</span>
                </span>
                <p className="text-slate-400 text-[11px]">
                  For any privacy inquiries: <a href="mailto:nexusoft.company@gmail.com" className="text-teal-400 underline">nexusoft.company@gmail.com</a>
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-bold text-teal-400 mb-1">1. Acceptance of Terms</h3>
                <p>
                  By downloading, installing, or playing Tile Oasis: Sanctuary Match, you agree to these Terms of Service. If you do not agree, please do not use the application.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-teal-400 mb-1">2. License & Gameplay</h3>
                <p>
                  You are granted a personal, non-exclusive, non-transferable, revocable license to play the game for personal entertainment purposes.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-teal-400 mb-1">3. Virtual Items & Currencies</h3>
                <p>
                  Coins, gems, booster items, and sanctuary decorations earned or purchased within the game are purely virtual goods with no monetary value outside the application.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-teal-400 mb-1">4. Disclaimer of Warranties</h3>
                <p>
                  The application is provided &quot;as is&quot; without warranties of any kind. We strive for 100% bug-free solvability across all 9,999 levels, but cannot guarantee uninterrupted service.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <a
            id="view-web-privacy-policy-link"
            href="/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold flex items-center space-x-1"
          >
            <span>Open Web Version</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            id="confirm-privacy-modal-btn"
            onClick={handleClose}
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-teal-500/20"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
