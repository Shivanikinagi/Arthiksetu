import { useState, useEffect, ChangeEvent } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
    Upload, CheckCircle, XCircle, Loader2, FileText,
    Shield, Lock, ExternalLink, BadgeCheck,
    ShieldCheck, Smartphone
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const ALL_DOC_TYPES = ['Aadhaar', 'PAN', 'Driving License', 'Voter ID', 'Passport', 'Income Proof'];


export function DocumentVerification() {
    const [docType, setDocType] = useState('Aadhaar');

    // Upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);

    // Reset on doc type change
    useEffect(() => {
        setUploadResult(null);
        setSelectedFile(null);
        setPreview('');
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

    const handleUploadVerify = async () => {
        if (!selectedFile) return;
        setUploadLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('doc_type', docType);
        try {
            const response = await fetch(`${API_BASE_URL}/api/verify_document`, { method: 'POST', body: formData });
            const data = await response.json();
            setUploadResult(data);
        } catch {
            setUploadResult({ status: 'error', message: 'Failed to verify. Make sure backend is running.' });
        } finally {
            setUploadLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#0A1F44]">Document Verification</h1>
                <p className="text-gray-500 mt-2">
                    Upload a photo of your document — our AI verifies it instantly and securely.
                </p>
            </div>

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
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                docType === type
                                    ? 'bg-white/20 text-white'
                                    : 'bg-green-100 text-green-700'
                            }`}>DigiLocker</span>
                        </button>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Upload */}
                <div className="space-y-4">
                    <Card className="p-6 border-2 border-[#F7931E] bg-orange-50/20 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#F7931E] rounded-xl flex items-center justify-center shrink-0">
                                <Upload className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0A1F44] text-lg">Upload {docType}</h3>
                                <p className="text-xs text-gray-500">AI-powered instant verification</p>
                            </div>
                        </div>

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

                    {/* Tips */}
                    <Card className="p-4 bg-blue-50 border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips for best results</h4>
                        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                            <li>Ensure the document is clear and well-lit</li>
                            <li>All text must be readable — no blurring or shadows</li>
                            <li>Upload the original document, not a photocopy</li>
                            <li>Capture the full document within the frame</li>
                        </ul>
                    </Card>

                    {/* DigiLocker external link */}
                    <Card className="p-4 bg-gradient-to-r from-[#0A4D68]/5 to-blue-50 border-[#0A4D68]/20">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#0A4D68] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                    <BadgeCheck className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-[#0A1F44] mb-1">Have your document on DigiLocker?</p>
                                    <p className="text-xs text-gray-600 mb-3">
                                        Download your {docType} from the official DigiLocker portal, then upload it here.
                                        DigiLocker is India's government digital document wallet used by 300M+ citizens.
                                    </p>
                                    <a
                                        href="https://www.digilocker.gov.in"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A4D68] text-white text-xs font-bold rounded-lg hover:bg-[#083a50] transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Open DigiLocker (Official Site)
                                    </a>
                                </div>
                            </div>
                        </Card>
                </div>

                {/* Right: Result */}
                <div>
                    <Card className="p-6 h-full min-h-72">
                        <h3 className="text-lg font-bold text-[#0A1F44] mb-4">Verification Result</h3>
                        {!uploadResult ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                                <FileText className="w-14 h-14 mb-3 opacity-30" />
                                <p className="text-sm font-medium">Upload your document and click Verify</p>
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
                                        <span className="font-bold text-[#0A1F44]">ArthikSetu AI (Gemini)</span>
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
                                                        className="h-full bg-green-500 rounded-full"
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
                                            Document image has been discarded. No data stored on our servers.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Security Assurance */}
            <Card className="p-5 mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <div className="w-full">
                        <h4 className="font-semibold text-green-900 mb-3">Privacy & Security</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { label: 'AES-256 Encrypted', desc: 'Document transmitted securely' },
                                { label: 'Zero Storage', desc: 'Deleted immediately after AI check' },
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
