/**
 * Economy Management Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 */

import React, { useState } from 'react';
import { EconomyConfigSetting } from '../../types/adminDashboard';
import { globalAdminService } from '../../services/admin/AdminService';
import {
  Coins,
  Gem,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface AdminEconomyTabProps {
  adminEmail: string;
  onRefresh: () => void;
}

export const AdminEconomyTab: React.FC<AdminEconomyTabProps> = ({ adminEmail, onRefresh }) => {
  const configs = globalAdminService.getEconomyConfigs();
  const [selectedSetting, setSelectedSetting] = useState<EconomyConfigSetting | null>(null);
  const [newValueInput, setNewValueInput] = useState<number>(100);
  const [justificationReason, setJustificationReason] = useState<string>('Routine economy faucet calibration');
  const [notice, setNotice] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleOpenEdit = (setting: EconomyConfigSetting) => {
    setSelectedSetting(setting);
    setNewValueInput(setting.currentValue);
    setShowConfirm(false);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSetting) return;

    if (newValueInput < selectedSetting.minValue || newValueInput > selectedSetting.maxValue) {
      alert(`Value must be between ${selectedSetting.minValue} and ${selectedSetting.maxValue} ${selectedSetting.unit}`);
      return;
    }

    setShowConfirm(true);
  };

  const handleExecuteChange = () => {
    if (!selectedSetting) return;

    const res = globalAdminService.updateEconomyConfig(
      adminEmail,
      selectedSetting.id,
      newValueInput,
      justificationReason
    );

    if (res.success) {
      setNotice(res.message);
      setSelectedSetting(null);
      setShowConfirm(false);
      onRefresh();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>Sanctuary Economy & Currency Faucet Calibration</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure system-wide coin faucets, 3-star gem bonuses, streak multipliers, and booster sink prices.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-teal-400 font-bold">
            Safe Bounds Enforced
          </span>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-2xl flex items-center justify-between animate-in fade-in">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-teal-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configs.map((setting) => (
          <div
            key={setting.id}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-teal-400 font-mono font-bold uppercase tracking-wider">
                  {setting.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Range: {setting.minValue} - {setting.maxValue} {setting.unit}
                </span>
              </div>
              <h3 className="text-sm font-black text-white">{setting.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{setting.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Active Value</span>
                <span className="text-lg font-black text-amber-300 font-mono">
                  {setting.currentValue} <span className="text-xs font-sans text-slate-300">{setting.unit}</span>
                </span>
              </div>

              <button
                onClick={() => handleOpenEdit(setting)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center space-x-1"
              >
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span>Adjust</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Adjust Modal */}
      {selectedSetting && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Adjust: {selectedSetting.name}</h3>
              <button onClick={() => setSelectedSetting(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {showConfirm ? (
              <div className="space-y-4 text-center py-2 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white">Confirm Economy Parameter Calibration</h4>
                  <p className="text-xs text-slate-400">
                    Changing from <span className="text-slate-200 line-through font-mono font-bold">{selectedSetting.currentValue} {selectedSetting.unit}</span> to{' '}
                    <span className="text-amber-300 font-mono font-black">{newValueInput} {selectedSetting.unit}</span>.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>Audit Admin:</span>
                    <span className="font-mono text-slate-200">{adminEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reason:</span>
                    <span className="text-teal-300">{justificationReason}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleExecuteChange}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black"
                  >
                    Confirm & Apply
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex justify-between">
                    <span>New Value</span>
                    <span className="text-teal-400 font-mono font-bold">
                      {newValueInput} {selectedSetting.unit}
                    </span>
                  </label>
                  <input
                    type="number"
                    step={selectedSetting.category === 'ADS' ? '0.1' : '1'}
                    min={selectedSetting.minValue}
                    max={selectedSetting.maxValue}
                    value={newValueInput}
                    onChange={(e) => setNewValueInput(parseFloat(e.target.value) || selectedSetting.minValue)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Boundaries: Min {selectedSetting.minValue} → Max {selectedSetting.maxValue} {selectedSetting.unit}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Justification / Audit Reason</label>
                  <textarea
                    required
                    rows={2}
                    value={justificationReason}
                    onChange={(e) => setJustificationReason(e.target.value)}
                    placeholder="e.g., Adjusting reward to maintain coin sink balance..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedSetting(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-black"
                  >
                    Review Calibration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
