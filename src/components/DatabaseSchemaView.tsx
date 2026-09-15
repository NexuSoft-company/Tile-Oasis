import React, { useState } from 'react';
import { DATABASE_ENTITIES } from '../data/phase1Data';
import { Database, Table, Key, ShieldCheck, Hash } from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState(DATABASE_ENTITIES[0]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>PostgreSQL Relational Schema & Indices</span>
          </h3>
          <p className="text-xs text-slate-400">Strict constraints, foreign keys, and indexes for maximum performance and data integrity.</p>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-md font-mono">PostgreSQL 16</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Selector */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 px-1">Tables ({DATABASE_ENTITIES.length})</span>
          {DATABASE_ENTITIES.map(entity => (
            <button
              key={entity.tableName}
              onClick={() => setSelectedTable(entity)}
              className={`w-full text-left p-3 rounded-xl border transition-all text-xs space-y-1 ${
                selectedTable.tableName === entity.tableName
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-mono font-bold flex items-center space-x-2">
                <Table className="w-3.5 h-3.5 text-emerald-400" />
                <span>{entity.tableName}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{entity.description}</p>
            </button>
          ))}
        </div>

        {/* Selected Table Fields */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400">public.{selectedTable.tableName}</span>
              <p className="text-xs text-slate-400">{selectedTable.description}</p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono">
              {selectedTable.fields.length} Columns
            </span>
          </div>

          {/* Fields Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950">
                  <th className="p-2.5">Column Name</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Constraints</th>
                  <th className="p-2.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
                {selectedTable.fields.map(col => (
                  <tr key={col.name} className="hover:bg-slate-950/50">
                    <td className="p-2.5 font-bold text-slate-100 flex items-center space-x-1.5">
                      {col.constraints.includes('PRIMARY KEY') && <Key className="w-3 h-3 text-amber-400 shrink-0" />}
                      <span>{col.name}</span>
                    </td>
                    <td className="p-2.5 text-indigo-400">{col.type}</td>
                    <td className="p-2.5 text-slate-400 font-sans">
                      <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700">
                        {col.constraints}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-400 font-sans">{col.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Indexes */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <span className="font-bold text-slate-200 text-xs flex items-center space-x-1.5">
              <Hash className="w-3.5 h-3.5 text-blue-400" />
              <span>Table Indexes</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedTable.indexes.map(idx => (
                <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs font-mono">
                  {idx}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
