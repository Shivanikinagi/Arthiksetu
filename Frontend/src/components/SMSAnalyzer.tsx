import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MessageSquare, Loader2, CheckCircle, DollarSign, Calendar, Building2, Sparkles, AlertTriangle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface ParsedSMS {
    raw: string;
    amount: number;
    merchant: string;
    type: string;
    date: string | null;
    description: string;
    error?: string;
}

export function SMSAnalyzer() {
    const [messages, setMessages] = useState('');
    const [parsedResults, setParsedResults] = useState<ParsedSMS[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!messages.trim()) return;

        setLoading(true);
        try {
            const messageList = messages.split('\n').filter(m => m.trim());
            const response = await fetch('http://localhost:8000/api/parse_sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messageList })
            });

            const data = await response.json();
            setParsedResults(data.transactions || []);
        } catch (error) {
            console.error('SMS parsing error:', error);
            alert('Failed to parse SMS. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const exampleSMS = [
        'Your UPI transaction to Swiggy for Rs.450 is successful',
        'Zomato: You earned Rs.850 today. Total earnings: Rs.12,500',
        'Uber: Trip completed. You earned Rs.320. Paid by cash',
        'HDFC Bank: Rs.5000 credited to a/c XX1234 from Ola Cabs',
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/20 pb-12">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                {/* Header */}
                <div className="animate-fade-in-up flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-50 -mr-16 -mt-16"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-3 border border-blue-100">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-700">AI-Powered Analysis</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2 heading-display">Smart SMS Analyzer</h1>
                        <p className="text-gray-600 text-lg max-w-2xl">
                            Paste your transaction SMS below, and let our AI automatically extract earnings, categorize platforms, and generate reports.
                        </p>
                    </div>
                    <div className="relative z-10 shrink-0">
                        <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl hover:scale-105 transition-transform">
                            <MessageSquare className="w-10 h-10 text-white" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {/* Input Section */}
                    <div className="space-y-6">
                        <Card className="p-8 bg-white rounded-3xl shadow-lg border border-gray-100 h-full flex flex-col relative overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 heading-primary flex items-center gap-2">
                                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                                    Input Messages
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-blue-600"
                                    onClick={() => setMessages('')}
                                >
                                    <RefreshCw className="w-4 h-4 mr-1" /> Clear
                                </Button>
                            </div>

                            <div className="flex-1 relative">
                                <Textarea
                                    placeholder="Paste SMS messages here (one per line)...&#10;&#10;Examples can be found below."
                                    value={messages}
                                    onChange={(e) => setMessages(e.target.value)}
                                    className="w-full h-full min-h-[300px] p-6 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base leading-relaxed resize-none transition-all hover:bg-white"
                                />
                                <div className="absolute bottom-4 right-4 text-xs font-semibold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                    {messages.length} chars
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex flex-col gap-3">
                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={loading || !messages.trim()}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                                                Processing with AI...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-5 h-5 mr-2 group-hover:text-yellow-300 transition-colors" />
                                                Analyze Messages
                                            </>
                                        )}
                                    </Button>

                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {exampleSMS.map((sms, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setMessages(prev => prev ? prev + '\n' + sms : sms)}
                                                className="text-left text-xs p-3 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-200 text-gray-600 hover:text-blue-700 transition-all truncate"
                                                title={sms}
                                            >
                                                + {sms}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-center text-xs text-gray-400 mt-1">Click to append example messages</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        <Card className="p-8 bg-white rounded-3xl shadow-lg border border-gray-100 min-h-[600px] flex flex-col relative overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 heading-primary flex items-center gap-2">
                                    <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                    Analysis Results
                                </h2>
                                {parsedResults.length > 0 && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                                        {parsedResults.length} Transactions Found
                                    </span>
                                )}
                            </div>

                            {parsedResults.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                        <Sparkles className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <p className="text-lg font-semibold text-gray-500">Waiting for input...</p>
                                    <p className="text-sm">Paste SMS and click "Analyze Messages" to see the magic.</p>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col">
                                    {/* Summary Banner */}
                                    {parsedResults.length > 0 && (
                                        <div className="mb-6 p-6 bg-gradient-to-br from-[#0A1F44] to-[#1e3a5f] rounded-2xl shadow-md text-white border-0 flex items-center justify-between relative overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 grayscale"></div>
                                            <div className="relative z-10 flex items-center gap-4">
                                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                                    <DollarSign className="w-6 h-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-blue-200 font-medium uppercase tracking-wide">Total Earnings Detected</p>
                                                    <p className="text-3xl font-black heading-display">
                                                        ₹{parsedResults.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
                                        {parsedResults.map((result, idx) => (
                                            <div key={idx} className="stagger-item group p-5 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all relative overflow-hidden">
                                                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${result.type === 'credit' ? 'bg-green-500' :
                                                        result.type === 'debit' ? 'bg-red-500' : 'bg-gray-400'
                                                    }`}></div>

                                                <div className="flex flex-col gap-3 pl-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.merchant ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                                                                }`}>
                                                                <Building2 className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">
                                                                    {result.merchant || 'Unknown Merchant'}
                                                                </h4>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {result.date || 'Date not found'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`text-xl font-bold ${result.amount > 0 ? 'text-green-600' : 'text-gray-900'
                                                                }`}>
                                                                ₹{result.amount?.toLocaleString('en-IN') || 0}
                                                            </p>
                                                            <span className="text-xs font-semibold text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded-full">
                                                                {result.type || 'Unknown'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3 text-purple-500" /> AI Analysis
                                                        </p>
                                                        <p className="text-sm text-gray-700 leading-snug">
                                                            {result.description || "No description available."}
                                                        </p>
                                                    </div>

                                                    {result.error && (
                                                        <div className="mt-2 flex items-start gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                                                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                                            {result.error}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>

                {/* Features Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Smart Detection</h3>
                            <p className="text-sm text-gray-600">Powered by Google Gemini AI to understand complex transaction messages contextually.</p>
                        </div>
                    </Card>
                    <Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                            <Building2 className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Multi-Platform Support</h3>
                            <p className="text-sm text-gray-600">Seamlessly identifies messages from Swiggy, Zomato, Uber, Ola, UrbanCompany & banks.</p>
                        </div>
                    </Card>
                    <Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Auto-Categorization</h3>
                            <p className="text-sm text-gray-600">Automatically tags income, refunds, and expenses with high accuracy.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
