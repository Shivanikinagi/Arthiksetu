import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
    Shield, ShieldCheck, Download, Trash2, ToggleLeft, ToggleRight,
    Lock, AlertTriangle, CheckCircle, FileText, Eye
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { PrivacyBadge } from './PrivacyBadge';

// Permission keys stored in localStorage
const PERMISSION_KEYS = [
    {
        key: 'perm_sms_parsing',
        label: 'SMS Parsing',
        desc: 'Allow ArthikSetu to read and categorise SMS messages for earnings tracking.',
        icon: FileText,
    },
    {
        key: 'perm_doc_upload',
        label: 'Document Upload',
        desc: 'Allow uploading ID documents for AI verification (in-memory only, no storage).',
        icon: Eye,
    },
    {
        key: 'perm_location',
        label: 'Location Access',
        desc: 'Allow approximate location for region-specific scheme recommendations.',
        icon: Shield,
    },
];

export function PrivacyDashboard() {
    const [permissions, setPermissions] = useState<Record<string, boolean>>(() => {
        const stored: Record<string, boolean> = {};
        PERMISSION_KEYS.forEach(p => {
            const val = localStorage.getItem(p.key);
            stored[p.key] = val === null ? true : val === 'true';
        });
        return stored;
    });

    const [nukeConfirm, setNukeConfirm] = useState(false);
    const [nukeLoading, setNukeLoading] = useState(false);
    const [nukeDone, setNukeDone] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    const togglePermission = (key: string) => {
        setPermissions(prev => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem(key, String(next[key]));
            return next;
        });
    };

    // Export data as JSON file download
    const handleExport = async () => {
        setExportLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/export_earnings`);
            const data = await res.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `arthiksetu_data_export_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            alert('Failed to export data. Please make sure the backend is running.');
        } finally {
            setExportLoading(false);
        }
    };

    // Delete all data
    const handleNuke = async () => {
        setNukeLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/delete_all_data`, { method: 'DELETE' });
            const data = await res.json();
            if (data.status === 'deleted') {
                setNukeDone(true);
                setNukeConfirm(false);
                // Clear local permissions too
                PERMISSION_KEYS.forEach(p => localStorage.removeItem(p.key));
                setPermissions(() => {
                    const reset: Record<string, boolean> = {};
                    PERMISSION_KEYS.forEach(p => { reset[p.key] = true; });
                    return reset;
                });
            }
        } catch {
            alert('Failed to delete data. Please ensure the backend is running.');
        } finally {
            setNukeLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-[#0A1F44]">Privacy Dashboard</h1>
                    <PrivacyBadge label="Your Data, Your Rules" />
                </div>
                <p className="text-gray-500 text-sm">
                    Control what ArthikSetu can access, export your data, or delete everything.
                </p>
            </div>

            {/* Trust Banner */}
            <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-green-700 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-green-900">Zero-Knowledge Design</p>
                        <p className="text-xs text-green-700">
                            ArthikSetu processes everything in-memory. No images, no full IDs, no browsing history is ever stored on disk or sent to third parties.
                        </p>
                    </div>
                </div>
            </Card>

            <div className="space-y-6">
                {/* Permission Toggles */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-[#0A1F44] mb-1 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-600" />
                        Permission Controls
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">Toggle what data ArthikSetu is allowed to access.</p>

                    <div className="space-y-4">
                        {PERMISSION_KEYS.map(perm => {
                            const Icon = perm.icon;
                            const enabled = permissions[perm.key];
                            return (
                                <div
                                    key={perm.key}
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                        enabled ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                            enabled ? 'bg-green-100' : 'bg-gray-200'
                                        }`}>
                                            <Icon className={`w-5 h-5 ${enabled ? 'text-green-700' : 'text-gray-400'}`} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">{perm.label}</p>
                                            <p className="text-xs text-gray-500">{perm.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => togglePermission(perm.key)}
                                        className="focus:outline-none"
                                        aria-label={`Toggle ${perm.label}`}
                                    >
                                        {enabled ? (
                                            <ToggleRight className="w-10 h-10 text-green-600" />
                                        ) : (
                                            <ToggleLeft className="w-10 h-10 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Export Data */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold text-[#0A1F44] mb-1 flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-600" />
                        Export Your Data
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">
                        Download all your earnings data in JSON format. You own your data — take it with you anytime.
                    </p>
                    <Button
                        onClick={handleExport}
                        disabled={exportLoading}
                        className="bg-[#0A1F44] hover:bg-[#0A2F54] text-white font-semibold"
                    >
                        {exportLoading ? (
                            <>Exporting…</>
                        ) : (
                            <><Download className="w-4 h-4 mr-2" />Export Data as JSON</>
                        )}
                    </Button>
                </Card>

                {/* Nuke Button */}
                <Card className="p-6 border-2 border-red-200 bg-red-50/30">
                    <h2 className="text-lg font-bold text-red-800 mb-1 flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        Delete All My Data
                    </h2>
                    <p className="text-xs text-gray-600 mb-4">
                        Permanently delete all earnings records, chat history, and stored data from the server. This action <strong>cannot be undone</strong>.
                    </p>

                    {nukeDone ? (
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-100 border border-green-300 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-green-700" />
                            <p className="text-sm font-semibold text-green-800">All data has been permanently deleted.</p>
                        </div>
                    ) : !nukeConfirm ? (
                        <Button
                            onClick={() => setNukeConfirm(true)}
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete All My Data
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-start gap-2 p-3 bg-red-100 border border-red-300 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-red-700 mt-0.5 shrink-0" />
                                <p className="text-sm text-red-800 font-medium">
                                    Are you absolutely sure? This will delete <strong>all</strong> earnings, chats, and stored sessions. There is no undo.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleNuke}
                                    disabled={nukeLoading}
                                    className="bg-red-700 hover:bg-red-800 text-white font-bold"
                                >
                                    {nukeLoading ? 'Deleting…' : 'Yes, Delete Everything'}
                                </Button>
                                <Button
                                    onClick={() => setNukeConfirm(false)}
                                    variant="outline"
                                    className="font-semibold"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Privacy Summary */}
                <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-700" />
                        What we DO and DON'T store
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-bold text-green-800 mb-2">✓ What we keep (session only)</p>
                            <ul className="text-xs text-green-700 space-y-1">
                                <li>• Earning amounts & categories</li>
                                <li>• Last 4 digits of document IDs</li>
                                <li>• Chat messages (in-memory)</li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-red-800 mb-2">✗ What we NEVER store</p>
                            <ul className="text-xs text-red-700 space-y-1">
                                <li>• Full Aadhaar / PAN numbers</li>
                                <li>• Document images or scans</li>
                                <li>• Passwords or banking info</li>
                                <li>• Location history or IP logs</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
