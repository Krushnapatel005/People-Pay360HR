'use client';
import React, { useState } from 'react';
import { Building2, Palette, Bell, Lock, Database, Globe, Zap, Save } from 'lucide-react';
import { Tabs } from '../../../components/ui/tabs';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';

const SETTING_TABS = [
  { id: 'company',       label: 'Company' },
  { id: 'appearance',    label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security',      label: 'Security' },
  { id: 'integrations',  label: 'Integrations' },
  { id: 'payroll',       label: 'Payroll' },
];

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-200">{label}</p>
        {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked((v) => !v)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-brand-600' : 'bg-slate-700'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <Breadcrumbs />
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Configure your PeoplePay360 workspace</p>
      </div>

      <Tabs tabs={SETTING_TABS} activeTab={activeTab} onChange={setActiveTab} variant="pill" />

      <div className="animate-slide-up">
        {activeTab === 'company' && (
          <div className="space-y-5">
            <SettingSection title="Company Profile">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {['Company Name', 'Legal Name', 'Registration Number', 'Industry'].map((label) => (
                  <div key={label}>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">{label}</label>
                    <input defaultValue={label === 'Company Name' ? 'Acme Corp India Pvt. Ltd.' : label === 'Legal Name' ? 'Acme Corp India Pvt. Ltd.' : label === 'Industry' ? 'Technology' : 'CIN/2018/KA/0042'} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500 input-transition" />
                  </div>
                ))}
              </div>
            </SettingSection>

            <SettingSection title="Localisation">
              <SettingRow label="Country" description="Determines payroll rules and tax compliance"><select className="text-xs bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"><option>India</option></select></SettingRow>
              <SettingRow label="Currency" description="Default currency for payroll and contracts"><select className="text-xs bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"><option>INR — Indian Rupee</option></select></SettingRow>
              <SettingRow label="Timezone" description="Used for attendance and scheduling"><select className="text-xs bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"><option>Asia/Kolkata (IST +05:30)</option></select></SettingRow>
            </SettingSection>
          </div>
        )}

        {activeTab === 'appearance' && (
          <SettingSection title="Appearance">
            <SettingRow label="Dark Mode" description="Enable dark mode across the application"><Toggle defaultChecked /></SettingRow>
            <SettingRow label="Compact Mode" description="Use a denser layout for tables and forms"><Toggle /></SettingRow>
            <SettingRow label="Accent Color" description="Primary brand color used across the UI">
              <div className="flex items-center gap-2">
                {['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'].map((c) => (
                  <button key={c} className="w-6 h-6 rounded-full border-2 border-transparent hover:border-white transition-colors" style={{ backgroundColor: c }} aria-label={`Set accent color to ${c}`} />
                ))}
              </div>
            </SettingRow>
          </SettingSection>
        )}

        {activeTab === 'notifications' && (
          <SettingSection title="Notification Preferences">
            {[
              { label: 'New Time Off Requests', desc: 'Notify when an employee submits a leave request', on: true },
              { label: 'Payrun Status Changes', desc: 'Alerts for computed, validated, and paid events', on: true },
              { label: 'Contract Expiry Reminders', desc: 'Notify 30, 15, and 7 days before expiry', on: true },
              { label: 'Attendance Anomalies', desc: 'Alert for unusual check-in/check-out patterns', on: false },
              { label: 'New Employee Onboarded', desc: 'Notify HR team when a new profile is created', on: true },
              { label: 'Monthly Payroll Summary', desc: 'Send summary report on payroll completion', on: false },
            ].map((n) => (
              <SettingRow key={n.label} label={n.label} description={n.desc}><Toggle defaultChecked={n.on} /></SettingRow>
            ))}
          </SettingSection>
        )}

        {activeTab === 'security' && (
          <div className="space-y-5">
            <SettingSection title="Authentication">
              <SettingRow label="Two-Factor Authentication" description="Require 2FA for all admin and payroll users"><Toggle /></SettingRow>
              <SettingRow label="Session Timeout" description="Automatically log out after inactivity">
                <select className="text-xs bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option>30 minutes</option><option>1 hour</option><option>4 hours</option>
                </select>
              </SettingRow>
              <SettingRow label="Single Sign-On (SSO)" description="Integrate with Google Workspace or Azure AD"><Toggle /></SettingRow>
            </SettingSection>

            <SettingSection title="Password Policy">
              <SettingRow label="Minimum Length" description="Minimum characters required">
                <input type="number" defaultValue={8} min={6} max={20} className="w-20 px-3 py-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </SettingRow>
              <SettingRow label="Require Special Characters" description="Enforce special characters in passwords"><Toggle defaultChecked /></SettingRow>
            </SettingSection>
          </div>
        )}

        {activeTab === 'integrations' && (
          <SettingSection title="Integrations">
            {[
              { name: 'Slack', desc: 'Send HR alerts and approvals to Slack channels', connected: true },
              { name: 'Google Workspace', desc: 'Sync employee data and calendar', connected: false },
              { name: 'Razorpay', desc: 'Process payroll disbursements via Razorpay', connected: false },
              { name: 'QuickBooks', desc: 'Sync payroll data with accounting', connected: false },
            ].map((integration) => (
              <SettingRow key={integration.name} label={integration.name} description={integration.desc}>
                <button className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${integration.connected ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20' : 'text-brand-400 bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500/20'}`}>
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
              </SettingRow>
            ))}
          </SettingSection>
        )}

        {activeTab === 'payroll' && (
          <SettingSection title="Payroll Configuration">
            <SettingRow label="Payroll Frequency" description="How often payroll is processed">
              <select className="text-xs bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"><option>Monthly</option><option>Bi-weekly</option><option>Weekly</option></select>
            </SettingRow>
            <SettingRow label="Pay Day" description="Default payday of the month">
              <select className="text-xs bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"><option>1st</option><option>28th</option><option>Last day</option></select>
            </SettingRow>
            <SettingRow label="Auto-compute on Month End" description="Automatically compute payrun on last day"><Toggle /></SettingRow>
            <SettingRow label="PF Contribution Rate" description="Employee PF contribution percentage">
              <input type="number" defaultValue={12} className="w-20 px-3 py-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </SettingRow>
          </SettingSection>
        )}

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-brand-sm transition-all">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
