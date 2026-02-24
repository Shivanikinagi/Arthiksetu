import { useState, useEffect, ChangeEvent } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
    Upload, CheckCircle, XCircle, Loader2, FileText,
    Shield, Lock, ExternalLink, BadgeCheck,
    ShieldCheck, Smartphone, AlertTriangle, ArrowRight, Info
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const ALL_DOC_TYPES = ['Aadhaar', 'PAN', 'Driving License', 'Voter ID', 'Passport', 'Income Proof'];

// Doc types that DigiLocker officially issues
const DIGILOCKER_SUPPORTED = ['Aadhaar', 'PAN', 'Driving License', 'Voter ID'];


export function DocumentVerification() {
    const [docType, setDocType] = useState('Aadhaar');

    // Verification method: 'digilocker' (primary) or 'upload' (fallback)
    const [method, setMethod] = useState<'digilocker' | 'upload'>('digilocker');

    // DigiLocker state
    const [digiLoading, setDigiLoading] = useState(false);

    // Upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);

    // Check for DigiLocker callback params on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const dlStatus = params.get('digilocker_status');
        if (dlStatus) {
            setUploadResult({
                status: dlStatus === 'verified' ? 'verified' : 'error',
                doc_type: params.get('doc_type') || docType,
                message: params.get('message') || (dlStatus === 'verified' ? 'Document verified via DigiLocker' : 'DigiLocker verification failed'),
                confidence_score: parseFloat(params.get('confidence') || '0.99'),
                source: 'DigiLocker',
                reason: dlStatus === 'verified'
                    ? 'Verified directly via Government of India DigiLocker — highest trust level.'
                    : params.get('message'),
            });
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    // Reset on doc type change
    useEffect(() => {
        setUploadResult(null);
        setSelectedFile(null);
        setPreview('');
        // Default to DigiLocker for supported doc types, upload for others
        setMethod(DIGILOCKER_SUPPORTED.includes(docType) ? 'digilocker' : 'upload');
    }, [docType]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUploadResult(null);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleDigiLockerVerify = async () => {
        setDigiLoading(true);
        try {
            const r = await fetch(`${API_BASE_URL}/api/digilocker/auth-url?doc_type=${encodeURIComponent(docType)}`);
            const data = await r.json();
            if (data.auth_url) {
                if (data.is_demo) {
                    // Demo mode — simulate the callback instantly
                    const stateVal = data.state;
                    const cbUrl = `${API_BASE_URL}/api/digilocker/callback?code=demo&state=${stateVal}`;
                    window.location.href = cbUrl;
                } else {
                    // Production — redirect to real DigiLocker
                    window.location.href = data.auth_url;
                }
            }
        } catch {
            setUploadResult({ status: 'error', message: 'Could not connect to DigiLocker. Try manual upload instead.', source: 'DigiLocker' });
        } finally {
            setDigiLoading(false);
        }
    };

    const handleUploadVerify = async () => {
        if (!selectedFile) return;
        setUploadLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('doc_type', docType);
        try {
            const response = await fetch(`${API_BASE_URL}/api/verify_document`, { method: 'POST', body: formData });
            const data = await response.json();
            setUploadResult({ ...data, source: 'AI Upload' });
        } catch {
            setUploadResult({ status: 'error', message: 'Failed to verify. Make sure backend is running.', source: 'AI Upload' });
        } finally {
            setUploadLoading(false);
        }
    };

    const isDigiLockerSupported = DIGILOCKER_SUPPORTED.includes(docType);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#0A1F44]">Document Verification</h1>
                <p className="text-gray-500 mt-2">
                    Verify your identity securely. We recommend DigiLocker for the fastest, most trusted verification.
                </p>
            </div>

            {/* Trust Banner */}
            <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-700 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-blue-900">Government-Backed Verification</p>
                        <p className="text-xs text-blue-700">
                            ArthikSetu uses DigiLocker (Govt. of India) as the primary verification source.
                            No documents are stored on our servers — your data stays with you.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Doc Type Selector */}
            <Card className="p-5 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Document Type</label>
                <div className="flex flex-wrap gap-2">
                    {ALL_DOC_TYPES.map(type => (
                        <button
                            key={type}
                            onClick={() => setDocType(type)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                                docType === type
                                    ? 'bg-[#0A1F44] text-white border-[#0A1F44]'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#0A1F44]'
                            }`}
                        >
                            {type}
                            {DIGILOCKER_SUPPORTED.includes(type) && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    docType === type
                                        ? 'bg-white/20 text-white'
                                        : 'bg-green-100 text-green-700'
                                }`}>DigiLocker</span>
                            )}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Method Selector — DigiLocker first */}
            {isDigiLockerSupported && (
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setMethod('digilocker')}
                        className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            method === 'digilocker'
                                ? 'border-[#0A4D68] bg-[#0A4D68]/5 ring-2 ring-[#0A4D68]/20'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <BadgeCheck className={`w-6 h-6 shrink-0 ${method === 'digilocker' ? 'text-[#0A4D68]' : 'text-gray-400'}`} />
                        <div className="text-left">
                            <p className={`text-sm font-bold ${method === 'digilocker' ? 'text-[#0A4D68]' : 'text-gray-600'}`}>
                                DigiLocker (Recommended)
                            </p>
                            <p className="text-xs text-gray-500">Government verified · Instant · Most trusted</p>
                        </div>
                        {method === 'digilocker' && (
                            <span className="ml-auto text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">PREFERRED</span>
                        )}
                    </button>
                    <button
                        onClick={() => setMethod('upload')}
                        className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            method === 'upload'
                                ? 'border-[#F7931E] bg-orange-50/50 ring-2 ring-[#F7931E]/20'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <Upload className={`w-6 h-6 shrink-0 ${method === 'upload' ? 'text-[#F7931E]' : 'text-gray-400'}`} />
                        <div className="text-left">
                            <p className={`text-sm font-bold ${method === 'upload' ? 'text-[#F7931E]' : 'text-gray-600'}`}>
                                Manual Upload
                            </p>
                            <p className="text-xs text-gray-500">AI verification · Upload document photo</p>
                        </div>
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Verification Input */}
                <div className="space-y-4">
                    {/* ──── DigiLocker Primary ──── */}
                    {method === 'digilocker' && isDigiLockerSupported ? (
                        <Card className="p-6 border-2 border-[#0A4D68] bg-gradient-to-br from-white to-blue-50/30 shadow-md">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-[#0A4D68] rounded-xl flex items-center justify-center shrink-0">
                                    <BadgeCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0A1F44] text-lg">Verify via DigiLocker</h3>
                                    <p className="text-xs text-gray-500">India's official digital document wallet by MeitY</p>
                                </div>
                            </div>

                            <div className="bg-white/80 border border-[#0A4D68]/10 rounded-xl p-5 mb-5 space-y-3">
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                    <p className="text-sm text-gray-700">You authenticate directly on <strong>digitallocker.gov.in</strong> — we never see your password</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                    <p className="text-sm text-gray-700">Document verified from government records — <strong>99% confidence</strong></p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                    <p className="text-sm text-gray-700">No document image is uploaded or stored on ArthikSetu</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Shield className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                                    <p className="text-sm text-gray-700">You can revoke access from your DigiLocker account at any time</p>
                                </div>
                            </div>

                            <Button
                                onClick={handleDigiLockerVerify}
                                disabled={digiLoading}
                                className="w-full bg-[#0A4D68] hover:bg-[#083a50] text-white font-bold py-3 text-base"
                            >
                                {digiLoading
                                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Connecting to DigiLocker...</>
                                    : <><BadgeCheck className="w-4 h-4 mr-2" />Verify {docType} with DigiLocker</>}
                            </Button>

                            <p className="text-center text-xs text-gray-400 mt-3">
                                Powered by DigiLocker, Government of India (MeitY)
                            </p>
                        </Card>
                    ) : (
                        /* ──── Upload Fallback ──── */
                        <Card className="p-6 border-2 border-[#F7931E] bg-orange-50/20 shadow-md">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-[#F7931E] rounded-xl flex items-center justify-center shrink-0">
                                    <Upload className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0A1F44] text-lg">Upload {docType}</h3>
                                    <p className="text-xs text-gray-500">AI-powered verification with Gemini Vision</p>
                                </div>
                            </div>

                            {isDigiLockerSupported && (
                                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                                    <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                    <p className="text-xs text-amber-800">
                                        For higher trust, use <button onClick={() => setMethod('digilocker')} className="underline font-bold text-[#0A4D68]">DigiLocker verification</button> instead.
                                        Manual upload requires AI analysis and may have lower confidence.
                                    </p>
                                </div>
                            )}

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#F7931E] transition-colors mb-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer block">
                                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-700">
                                        {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB · Clear, well-lit photo</p>
                                </label>
                            </div>

                            {preview && (
                                <img
                                    src={preview}
                                    alt="Document preview"
                                    className="w-full h-44 object-contain bg-gray-100 rounded-xl border mb-4"
                                />
                            )}

                            <Button
                                onClick={handleUploadVerify}
                                disabled={!selectedFile || uploadLoading}
                                className="w-full bg-[#F7931E] hover:bg-[#E8850D] text-white font-bold py-3 text-base"
                            >
                                {uploadLoading
                                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying with AI...</>
                                    : <><CheckCircle className="w-4 h-4 mr-2" />Verify {docType}</>}
                            </Button>
                        </Card>
                    )}

                    {/* Tips — only for upload */}
                    {method === 'upload' && (
                        <Card className="p-4 bg-blue-50 border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips for accurate verification</h4>
                            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                                <li>Use the original document, not a photocopy or screenshot</li>
                                <li>Ensure all text is clearly readable — no blur or shadows</li>
                                <li>Include the full document within the photo frame</li>
                                <li>Government-issued documents get higher confidence scores</li>
                                <li>For best results, download from DigiLocker then upload here</li>
                            </ul>
                        </Card>
                    )}
                </div>

                {/* Right: Result */}
                <div>
                    <Card className="p-6 h-full min-h-72">
                        <h3 className="text-lg font-bold text-[#0A1F44] mb-4">Verification Result</h3>
                        {!uploadResult ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                                <FileText className="w-14 h-14 mb-3 opacity-30" />
                                <p className="text-sm font-medium">Choose a verification method to get started</p>
                                <p className="text-xs mt-1 opacity-70">Results appear here instantly</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className={`p-4 rounded-xl flex items-start gap-3 ${
                                    uploadResult.status === 'verified'
                                        ? 'bg-green-50 border-2 border-green-200'
                                        : 'bg-red-50 border-2 border-red-200'
                                }`}>
                                    {uploadResult.status === 'verified'
                                        ? <CheckCircle className="w-8 h-8 text-green-600 shrink-0" />
                                        : <XCircle className="w-8 h-8 text-red-600 shrink-0" />}
                                    <div>
                                        <h4 className="font-bold text-lg leading-tight">
                                            {uploadResult.status === 'verified' ? 'Verification Successful' : 'Verification Failed'}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-0.5">{uploadResult.message}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                                    {uploadResult.doc_type && (
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-600">Document</span>
                                            <span className="font-bold text-gray-900">{uploadResult.doc_type}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Verified Via</span>
                                        <span className={`font-bold ${uploadResult.source === 'DigiLocker' ? 'text-[#0A4D68]' : 'text-[#F7931E]'}`}>
                                            {uploadResult.source === 'DigiLocker' ? 'DigiLocker (Govt. of India)' : 'ArthikSetu AI (Gemini)'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Trust Level</span>
                                        <span className={`font-bold ${uploadResult.source === 'DigiLocker' ? 'text-green-700' : 'text-amber-600'}`}>
                                            {uploadResult.source === 'DigiLocker' ? 'Highest — Government Verified' : 'Standard — AI Verified'}
                                        </span>
                                    </div>
                                    {uploadResult.extracted_id && (
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-600">Extracted ID</span>
                                            <span className="font-mono text-gray-900">{uploadResult.extracted_id}</span>
                                        </div>
                                    )}
                                    {uploadResult.confidence_score !== undefined && (
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-600">Confidence</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            uploadResult.confidence_score >= 0.9 ? 'bg-green-500' :
                                                            uploadResult.confidence_score >= 0.7 ? 'bg-amber-500' : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${Math.round(uploadResult.confidence_score * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="font-bold text-gray-900">
                                                    {(uploadResult.confidence_score * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {uploadResult.reason && (
                                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                        <p className="text-xs font-semibold text-blue-800 mb-1">
                                            {uploadResult.source === 'DigiLocker' ? 'DigiLocker Verification Note' : 'AI Analysis'}
                                        </p>
                                        <p className="text-sm text-blue-700">{uploadResult.reason}</p>
                                    </div>
                                )}

                                {/* Low confidence warning with DigiLocker suggestion */}
                                {uploadResult.source !== 'DigiLocker' && uploadResult.status === 'verified' && uploadResult.confidence_score < 0.85 && isDigiLockerSupported && (
                                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-amber-800 mb-1">Low confidence — try DigiLocker</p>
                                            <p className="text-xs text-amber-700">
                                                AI verification returned a lower confidence score. For a guaranteed result,
                                                use <button onClick={() => { setMethod('digilocker'); setUploadResult(null); }} className="underline font-bold text-[#0A4D68]">DigiLocker verification</button> which
                                                verifies directly from government records.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {uploadResult.status === 'verified' && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                                        <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
                                        <p className="text-xs text-green-800 font-medium">
                                            {uploadResult.source === 'DigiLocker'
                                                ? 'Verified via government records. No document image was uploaded or stored.'
                                                : 'Document image has been discarded. No data stored on our servers.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Security & Trust Assurance */}
            <Card className="p-5 mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <div className="w-full">
                        <h4 className="font-semibold text-green-900 mb-3">Your Privacy & Security</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { label: 'DigiLocker First', desc: 'Government-verified, no upload needed' },
                                { label: 'Zero Storage', desc: 'Documents deleted immediately after check' },
                                { label: 'OAuth2 Secure', desc: 'Passwords never shared with ArthikSetu' },
                                { label: 'DPDP Act 2023', desc: 'Indian data protection compliant' },
                            ].map(item => (
                                <div key={item.label} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-green-800">{item.label}</p>
                                        <p className="text-xs text-green-700">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
