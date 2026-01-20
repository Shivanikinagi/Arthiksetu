import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Bot, Send, Loader2, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';

export function AIAssistant() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            // Split by double newlines (paragraphs) to separate distinct messages
            // Then join single newlines with spaces to handle wrapped text within a message
            const messages = input
                .split(/\n\s*\n/)
                .map((msg: string) => msg.replace(/\n/g, ' ').trim())
                .filter((msg: string) => msg.length > 0);

            const response = await fetch('http://localhost:8000/api/parse_sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            alert("Failed to connect to AI Backend. Make sure to run 'uvicorn main:app --reload' in the Backend folder.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-8 bg-white border border-blue-100 shadow-xl rounded-2xl hover-lift relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 opacity-50"></div>

            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <Bot className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md">
                            <Sparkles className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 heading-primary">AI Earnings Assistant</h3>
                        <p className="text-sm text-gray-500">Paste SMS texts to track earnings automatically</p>
                    </div>
                </div>

                {/* Supported Platforms Badge */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Supported Platforms
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {['Zomato', 'Swiggy', 'Zepto', 'Blinkit', 'Uber', 'Ola', 'UrbanCompany', 'Porter', 'Dunzo'].map((platform) => (
                            <span key={platform} className="px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-gray-700 shadow-sm border border-gray-200">
                                {platform}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                    <div className="relative">
                        <textarea
                            className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none min-h-[140px] transition-all resize-none"
                            placeholder="Paste your transaction SMS here...

Example:
Dear Customer, Rs.450 has been credited to your account for order #12345 on Zomato.

You can paste multiple messages separated by blank lines."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {input.length} characters
                        </div>
                    </div>

                    <Button
                        onClick={handleAnalyze}
                        disabled={loading || !input.trim()}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-0"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Analyzing Transactions...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Analyze Transactions
                                <Send className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>

                    {/* Results */}
                    {result && (
                        <div className="mt-6 space-y-4 bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl animate-fade-in-up border-2 border-green-200 shadow-lg">
                            {/* Summary Header */}
                            <div className="flex justify-between items-center pb-4 border-b-2 border-green-200">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-lg font-bold text-gray-900 heading-primary">Analysis Result</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Credit</p>
                                    <span className="text-green-600 font-black text-3xl heading-display">
                                        +₹{result.summary?.total_credit || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Transaction List */}
                            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                                {result.transactions?.map((tx: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                <TrendingUp className={`w-5 h-5 ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600 rotate-180'
                                                    }`} />
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-900">{tx.merchant}</span>
                                                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                                    {tx.type}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`text-lg font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
                                            }`}>
                                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Stats */}
                            {result.summary && (
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-green-200">
                                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Total Transactions</p>
                                        <p className="text-2xl font-black text-gray-900 heading-display">
                                            {result.transactions?.length || 0}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Credits Found</p>
                                        <p className="text-2xl font-black text-green-600 heading-display">
                                            {result.transactions?.filter((t: any) => t.type === 'credit').length || 0}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
