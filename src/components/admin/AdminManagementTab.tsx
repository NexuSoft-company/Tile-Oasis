/**
 * Admin Accounts & Role Hierarchy Management Tab
 * Tile Oasis: Sanctuary Match (com.tileoasis.sanctuarymatch)
 *
 * RESTRICTED TO: SUPER_ADMIN ONLY
 * Strict Invariants:
 * - shahroz.mughal.31@gmail.com cannot be deleted, downgraded, or disabled.
 */

import React, { useState } from 'react';
import { AdminAccount, AdminRole, AdminPermission, AdminSession } from '../../types/adminDashboard';
import {
  globalAdminAuthService,
  PRIMARY_SUPER_ADMIN_EMAIL,
  ALL_PERMISSIONS,
  ROLE_DEFAULT_PERMISSIONS,
} from '../../services/admin/AdminAuthService';
import { globalAdminService } from '../../services/admin/AdminService';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  X,
  Mail,
  User,
  Clock,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  Key,
} from 'lucide-react';

interface AdminManagementTabProps {
  currentSession: AdminSession;
  onRefresh: () => void;
}

export const AdminManagementTab: React.FC<AdminManagementTabProps> = ({
  currentSession,
  onRefresh,
}) => {
  const [admins, setAdmins] = useState<AdminAccount[]>(globalAdminAuthService.getAllAdmins());
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);

  // Security Credentials State
  const [securitySettings, setSecuritySettings] = useState(() => globalAdminAuthService.getSecuritySettings());
  const [showCurrentKey, setShowCurrentKey] = useState<boolean>(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [newSecretKeyInput, setNewSecretKeyInput] = useState<string>('');
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

  // New admin form state
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<AdminRole>('ADMIN');
  const [selectedPermissions, setSelectedPermissions] = useState<AdminPermission[]>([
    ...ROLE_DEFAULT_PERMISSIONS.ADMIN,
  ]);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const isSuperAdmin = currentSession.role === 'SUPER_ADMIN';

  const handleRoleSelect = (newRole: AdminRole) => {
    setRole(newRole);
    setSelectedPermissions([...ROLE_DEFAULT_PERMISSIONS[newRole]]);
  };

  const handlePermissionToggle = (perm: AdminPermission) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const res = globalAdminAuthService.addAdmin(currentSession, {
      name,
      email,
      role,
      permissions: selectedPermissions,
      status: 'ACTIVE',
    });

    if (!res.success) {
      setErrorNotice(res.message);
      return;
    }

    globalAdminService.recordAuditLog({
      adminEmail: currentSession.email,
      action: `Created Admin Account: ${name} (${email})`,
      category: 'ROLE',
      targetId: email,
      newValue: `Role: ${role}`,
    });

    setNotice(res.message);
    setErrorNotice(null);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setAdmins(globalAdminAuthService.getAllAdmins());
    onRefresh();
  };

  const handleToggleStatus = (target: AdminAccount) => {
    const nextStatus = target.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    const res = globalAdminAuthService.updateAdmin(currentSession, target.id, {
      status: nextStatus,
    });

    if (!res.success) {
      setErrorNotice(res.message);
      return;
    }

    globalAdminService.recordAuditLog({
      adminEmail: currentSession.email,
      action: `Updated Admin Status for ${target.name} to ${nextStatus}`,
      category: 'ROLE',
      targetId: target.email,
      newValue: nextStatus,
    });

    setNotice(res.message);
    setErrorNotice(null);
    setAdmins(globalAdminAuthService.getAllAdmins());
    onRefresh();
  };

  const handleDelete = (target: AdminAccount) => {
    const res = globalAdminAuthService.deleteAdmin(currentSession, target.id);
    if (!res.success) {
      setErrorNotice(res.message);
      return;
    }

    globalAdminService.recordAuditLog({
      adminEmail: currentSession.email,
      action: `Deleted Admin Account: ${target.name} (${target.email})`,
      category: 'ROLE',
      targetId: target.email,
    });

    setNotice(res.message);
    setErrorNotice(null);
    setAdmins(globalAdminAuthService.getAllAdmins());
    onRefresh();
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasswordInput.trim()) {
      setSecurityError('Current Administrator Password is required to make security modifications.');
      return;
    }
    const res = globalAdminAuthService.updateMasterCredentials(
      currentPasswordInput,
      newPasswordInput ? newPasswordInput : undefined,
      newSecretKeyInput ? newSecretKeyInput : undefined
    );
    if (!res.success) {
      setSecurityError(res.message);
      setSecurityNotice(null);
      return;
    }
    setSecurityNotice(res.message);
    setSecurityError(null);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setNewSecretKeyInput('');
    setSecuritySettings(globalAdminAuthService.getSecuritySettings());
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 bg-slate-900/90 border border-rose-500/40 rounded-3xl text-center space-y-4 max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-base font-black text-white">Super Admin Access Only</h3>
        <p className="text-xs text-slate-400">
          Only the Primary Super Admin (<strong className="text-teal-400">{PRIMARY_SUPER_ADMIN_EMAIL}</strong>) possesses authorization to configure administrative roles and permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span>Administrator Accounts & Role-Based Access Control (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure staff accounts, assign operational permissions, and audit Super Admin authorization.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 flex items-center space-x-1.5 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Admin</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-2xl flex items-center justify-between animate-in fade-in">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-teal-400 hover:text-white">✕</button>
        </div>
      )}

      {errorNotice && (
        <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-2xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button onClick={() => setErrorNotice(null)} className="text-rose-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Admin Accounts Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
              <tr>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Permissions</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {admins.map((adm) => {
                const isPrimary = globalAdminAuthService.isPrimarySuperAdmin(adm.email);
                return (
                  <tr key={adm.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold border border-teal-500/30">
                          {(adm?.name || adm?.email || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-white">{adm?.name || adm?.email || 'Admin'}</span>
                            {isPrimary && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase tracking-wider">
                                Primary Owner
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {adm.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          adm.role === 'SUPER_ADMIN'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : adm.role === 'ADMIN'
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {adm.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          adm.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {adm.status}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-mono text-slate-300">
                        {adm.permissions.length} grants
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-400 font-mono">
                      {adm.lastLogin
                        ? new Date(adm.lastLogin).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' })
                        : 'Never'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isPrimary ? (
                        <span className="text-[10px] text-amber-400/80 font-bold italic">
                          Protected System Owner
                        </span>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleToggleStatus(adm)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                              adm.status === 'ACTIVE'
                                ? 'text-rose-300 border-rose-500/30 hover:bg-rose-500/10'
                                : 'text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10'
                            }`}
                          >
                            {adm.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleDelete(adm)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded"
                            title="Delete Admin Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Security & Secret Key Configuration */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <span>Master Security Gateway & Password Settings</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  Active Protection
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage your Master Secret Key and Admin Password to prevent unauthorized access.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Current Secret Key:</span>
            <span className="font-mono font-bold text-teal-300">
              {showCurrentKey ? securitySettings.masterSecretKey : '••••••'}
            </span>
            <button
              type="button"
              onClick={() => setShowCurrentKey(!showCurrentKey)}
              className="text-slate-400 hover:text-white p-1"
              title={showCurrentKey ? 'Hide key' : 'Show key'}
            >
              {showCurrentKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-teal-400" />}
            </button>
          </div>
        </div>

        {securityNotice && (
          <div className="p-3 bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-2xl flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
              <span>{securityNotice}</span>
            </div>
            <button onClick={() => setSecurityNotice(null)} className="text-teal-400 hover:text-white">✕</button>
          </div>
        )}

        {securityError && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-2xl flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{securityError}</span>
            </div>
            <button onClick={() => setSecurityError(null)} className="text-rose-400 hover:text-white">✕</button>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Current Password (Required)</span>
            </label>
            <input
              type="password"
              required
              value={currentPasswordInput}
              onChange={(e) => setCurrentPasswordInput(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1">
              <Key className="w-3.5 h-3.5 text-teal-400" />
              <span>New Master Password (Optional)</span>
            </label>
            <input
              type="text"
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              placeholder="Leave empty to keep current"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-teal-300 placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>New Master Secret Key (Optional)</span>
            </label>
            <input
              type="text"
              value={newSecretKeyInput}
              onChange={(e) => setNewSecretKeyInput(e.target.value)}
              placeholder="Leave empty to keep current"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-amber-300 placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 font-mono"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Master Credentials</span>
            </button>
          </div>
        </form>
      </div>

      {/* Add New Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 relative text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <UserPlus className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-black text-white">Add Administrator Account</h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Staff Member Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Jane Doe"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Administrator Gmail Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Assigned Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['ADMIN', 'SUPPORT', 'CONTENT_MANAGER', 'SUPER_ADMIN'] as AdminRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleSelect(r)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-left ${
                        role === r
                          ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="truncate">{r.replace('_', ' ')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Permissions Checklist</label>
                <div className="grid grid-cols-2 gap-1.5 p-3 bg-slate-950 rounded-xl border border-slate-800 max-h-40 overflow-y-auto">
                  {ALL_PERMISSIONS.map((perm) => {
                    const checked = selectedPermissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        className="flex items-center space-x-2 text-[11px] text-slate-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handlePermissionToggle(perm)}
                          className="w-3.5 h-3.5 accent-teal-500 rounded cursor-pointer"
                        />
                        <span className="truncate">{perm.replace(/_/g, ' ')}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-teal-500/20"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
