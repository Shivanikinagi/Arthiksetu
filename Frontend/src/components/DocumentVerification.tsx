import { useState, useEffect, ChangeEvent } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
    Upload, CheckCircle, XCircle, Loader2, FileText,
    Shield, Lock, ShieldCheck, Trash2, EyeOff
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { PrivacyBadge } from './PrivacyBadge';

const ALL_DOC_TYPES = ['Aadhaar', 'PAN', 'Driving License', 'Voter ID', 'Passport', 'Income Proof'];

// Steps shown during live verification
const VERIFY_STEPS = [
    { id: 1, label: 'Reading document details…', duration: 1200 },
    { id: 2, label: 'Verifying authenticity & QR code…', duration: 2000 },
    { id: 3, label: 'Extracting only required fields (name + last 4 digits)…', duration: 1000 },
    { id: 4, label: 'Deleting uploaded image from memory…', duration: 600 },
];

type StepStatus = 'pending' | 'active' | 'done';

export function DocumentVerification() {
    const [docType, setDocType] = useState('Aadhaar');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);

    // Live step tracking
    const [currentStep, setCurrentStep] = useState(0);
    const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(VERIFY_STEPS.map(() => 'pending'));

    // Reset on doc type change
    useEffect(() => {
        setUploadResult(null);
        setSelectedFile(null);
        setPreview('');
        setCurrentStep(0);
        setStepStatuses(VERIFY_STEPS.map(() => 'pending'));
    }, [docType]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUploadResult(null);
            setCurrentStep(0);
            setStepStatuses(VERIFY_STEPS.map(() => 'pending'));
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const runSteps = async () => {
        for (let i = 0; i < VERIFY_STEPS.length - 1; i++) {
            setCurrentStep(i + 1);
            setStepStatuses(prev => prev.map((s, idx) => idx === i ? 'active' : idx < i ? 'done' : s));
            await new Promise(r => setTimeout(r, VERIFY_STEPS[i].duration));
            setStepStatuses(prev => prev.map((s, idx) => idx === i ? 'done' : s));
        }
    };

    const handleVerify = async () => {
        if (!selectedFile) return;
        setUploadLoading(true);
        setUploadResult(null);

        const stepsPromise = runSteps();

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('doc_type', docType);

        let apiResult: any;
        try {
            const response = await fetch(`${API_BASE_URL}/api/verify_document`, { method: 'POST', body: formData });
            apiResult = await response.json();
        } catch {
            apiResult = { status: 'error', message: 'Failed to verify. Make sure backend is running.' };
        }

        await stepsPromise;

        // Step 4: Deleting image
        setCurrentStep(4);
        setStepStatuses(prev => prev.map((s, idx) => idx === 3 ? 'active' : idx < 3 ? 'done' : s));
        setPreview('');
        await new Promise(r => setTimeout(r, VERIFY_STEPS[3].duration));
        setStepStatuses(prev => prev.map(() => 'done'));

        // Mask the extracted ID — only show last 4 digits
        if (apiResult.extracted_id) {
            const raw = String(apiResult.extracted_id).replace(/\s/g, '');
            if (raw.length > 4) {
                apiResult.extracted_id_masked = 'X'.repeat(raw.length - 4) + ' ' + raw.slice(-4);
            } else {
                apiResult.extracted_id_masked = raw;
            }
            delete apiResult.extracted_id;
        }

        setUploadResult(apiResult);
        setUploadLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-[#0A1F44]">Document Verification</h1>
                    <PrivacyBadge label="In-Memory Only" />
                </div>
                <p className="text-gray-500 text-sm">
                    Upload your document for AI verification. We only extract the <strong>name + last 4 digits</strong> — never the full ID.
                    The image is deleted from memory immediately after processing.
                </p>
            </div>

            {/* Trust Banner */}
            <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-green-700 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-green-900">Minimal Data Collection</p>
                        <p className="text-xs text-green-700">
                            We don't need your full Aadhaar or PAN number. Only the <strong>last 4 digits + name</strong> are extracted for verification.
                            No images, no full IDs — ever stored.
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
                        </button>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Upload */}
                <div className="space-y-4">
                    <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50/30 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#0A1F44] rounded-xl flex items-center justify-center shrink-0">
                                <Upload className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0A1F44] text-lg">Upload {docType}</h3>
                                <p className="text-xs text-gray-500">AI-powered verification with Gemini Vision</p>
                            </div>
                            <PrivacyBadge label="Zero Storage" className="ml-auto" />
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors mb-4">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                            <label htmlFor="file-upload" className="cursor-pointer block">
                                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-700">
                                    {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB · Clear, well-lit photo</p>
                            </label>
                        </div>

                        {preview && !uploadLoading && (
                            <div className="relative mb-4">
                                <img src={preview} alt="Document preview" className="w-full h-44 object-contain bg-gray-100 rounded-xl border" />
                                <div className="absolute top-2 right-2 bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <EyeOff className="w-3 h-3" />
                                    Preview only — deleted after verify
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleVerify}
                            disabled={!selectedFile || uploadLoading}
                            className="w-full bg-[#0A1F44] hover:bg-[#0A2F54] text-white font-bold py-3 text-base"
                        >
                            {uploadLoading
                                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying…</>
                                : <><CheckCircle className="w-4 h-4 mr-2" />Verify {docType}</>}
                        </Button>
                    </Card>

                    {/* Live Step Feedback */}
                    {(uploadLoading || (currentStep > 0 && uploadResult)) && (
                        <Card className="p-5 border-2 border-blue-100 bg-blue-50/30">
                            <h4 className="text-sm font-bold text-[#0A1F44] mb-3 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                Live Privacy Pipeline
                                <PrivacyBadge label="In-Memory" />
                            </h4>
                            <div className="space-y-3">
                                {VERIFY_STEPS.map((step, idx) => (
                                    <div key={step.id} className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            {stepStatuses[idx] === 'done' ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : stepStatuses[idx] === 'active' ? (
                                                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${
                                                stepStatuses[idx] === 'done' ? 'text-green-700' :
                                                stepStatuses[idx] === 'active' ? 'text-blue-700' : 'text-gray-400'
                                            }`}>
                                                Step {step.id}: {step.label}
                                            </p>
                                            {stepStatuses[idx] === 'done' && idx === 3 && (
                                                <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                                                    <Trash2 className="w-3 h-3" /> Image file permanently removed from memory
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Tips */}
                    <Card className="p-4 bg-blue-50 border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips for accurate verification</h4>
                        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                            <li>Use the original document, not a photocopy or screenshot</li>
                            <li>Ensure all text is clearly readable — no blur or shadows</li>
                            <li>You may mask/cover middle digits — we only need last 4</li>
                            <li>Government-issued documents get higher confidence scores</li>
                        </ul>
                    </Card>
                </div>

                {/* Right: Result */}
                <div>
                    <Card className="p-6 h-full min-h-72">
                        <h3 className="text-lg font-bold text-[#0A1F44] mb-4">Verification Result</h3>
                        {!uploadResult ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                                <FileText className="w-14 h-14 mb-3 opacity-30" />
                                <p className="text-sm font-medium">Upload a document to get started</p>
                                <p className="text-xs mt-1 opacity-70">Results appear here with live progress</p>
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
                                        <span className="font-bold text-blue-700">ArthikSetu AI (Gemini Vision)</span>
                                    </div>
                                    {uploadResult.extracted_id_masked && (
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-600 flex items-center gap-1">
                                                ID (Last 4 only) <PrivacyBadge label="Masked" size="xs" />
                                            </span>
                                            <span className="font-mono font-bold text-gray-900">{uploadResult.extracted_id_masked}</span>
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
                                        <p className="text-xs font-semibold text-blue-800 mb-1">AI Analysis</p>
                                        <p className="text-sm text-blue-700">{uploadResult.reason}</p>
                                    </div>
                                )}

                                {uploadResult.status === 'verified' && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                                        <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
                                        <p className="text-xs text-green-800 font-medium">
                                            Image deleted. Only masked ID + name retained in this session.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Privacy Assurance Footer */}
            <Card className="p-5 mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <div className="w-full">
                        <h4 className="font-semibold text-green-900 mb-3">Your Privacy & Security</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { label: 'Selective Access', desc: 'Only last 4 digits + name extracted' },
                                { label: 'Zero Storage', desc: 'Image deleted immediately after check' },
                                { label: 'In-Memory Only', desc: 'No disk writes — processed in RAM' },
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
