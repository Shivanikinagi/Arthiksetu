import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Upload, CheckCircle, XCircle, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../config';

export function DocumentVerification() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [docType, setDocType] = useState('Aadhaar');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setResult(null);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVerify = async () => {
        if (!selectedFile) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('doc_type', docType);

        try {
            const response = await fetch(`${API_BASE_URL}/api/verify_document`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Verification error:', error);
            setResult({
                status: 'error',
                message: 'Failed to verify. Make sure backend is running.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#0A1F44]">Document Verification</h1>
                <p className="text-gray-500 mt-2">
                    Upload your Aadhaar, PAN, or other documents for AI-powered verification
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <Card className="p-6">
                    <h3 className="text-xl font-semibold text-[#0A1F44] mb-4">Upload Document</h3>

                    {/* Document Type Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Document Type
                        </label>
                        <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7931E] focus:border-transparent"
                        >
                            <option value="Aadhaar">Aadhaar Card</option>
                            <option value="PAN">PAN Card</option>
                            <option value="Driving License">Driving License</option>
                            <option value="Voter ID">Voter ID</option>
                            <option value="Passport">Passport</option>
                        </select>
                    </div>

                    {/* File Upload */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F7931E] transition-colors cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG up to 10MB
                                </p>
                            </label>
                        </div>
                    </div>

                    {/* Preview */}
                    {preview && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                            <img
                                src={preview}
                                alt="Document preview"
                                className="w-full h-48 object-contain bg-gray-100 rounded-lg"
                            />
                        </div>
                    )}

                    <Button
                        onClick={handleVerify}
                        disabled={!selectedFile || loading}
                        className="w-full bg-[#F7931E] hover:bg-[#E8850D]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verify Document
                            </>
                        )}
                    </Button>
                </Card>

                {/* Result Section */}
                <Card className="p-6">
                    <h3 className="text-xl font-semibold text-[#0A1F44] mb-4">Verification Result</h3>

                    {!result ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <FileText className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-500">
                                Upload a document and click verify to see results
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Status Badge */}
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${result.status === 'verified'
                                    ? 'bg-green-50 border-2 border-green-200'
                                    : result.status === 'rejected'
                                        ? 'bg-red-50 border-2 border-red-200'
                                        : 'bg-yellow-50 border-2 border-yellow-200'
                                }`}>
                                {result.status === 'verified' ? (
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                ) : (
                                    <XCircle className="w-8 h-8 text-red-600" />
                                )}
                                <div>
                                    <h4 className="font-semibold text-lg">
                                        {result.status === 'verified' ? 'Verification Successful' : 'Verification Failed'}
                                    </h4>
                                    <p className="text-sm text-gray-600">{result.message}</p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-700">Document Type:</span>
                                    <span className="text-sm text-gray-900">{result.doc_type}</span>
                                </div>
                                {result.extracted_id && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-700">Extracted ID:</span>
                                        <span className="text-sm text-gray-900 font-mono">{result.extracted_id}</span>
                                    </div>
                                )}
                                {result.confidence_score && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-700">Confidence:</span>
                                        <span className="text-sm text-gray-900">
                                            {(result.confidence_score * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Reason */}
                            {result.reason && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-blue-900 mb-1">Details:</p>
                                    <p className="text-sm text-blue-700">{result.reason}</p>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>

            {/* Information Card */}
            <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                    <ImageIcon className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                        <h4 className="font-semibold text-[#0A1F44] mb-1">Verification Tips</h4>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                            <li>Ensure the document image is clear and well-lit</li>
                            <li>All text should be readable and not blurred</li>
                            <li>Upload the original document, not a photocopy</li>
                            <li>Make sure there are no shadows or reflections</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
}
