import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Bot, Send, Loader2 } from 'lucide-react';

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
        <Card className="p-6 bg-white border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-[#0A1F44] font-semibold">AI Earnings Assistant</h3>
                    <p className="text-sm text-gray-500">Paste SMS texts to track earnings automatically</p>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-xs text-gray-500 block mb-2">
                    <strong>Supported Platforms:</strong> Zomato, Swiggy, Zepto, Blinkit, Uber, Ola, UrbanCompany, Porter, Dunzo.
                </label>
                <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                    placeholder="Paste transaction SMS here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <Button
                    onClick={handleAnalyze}
                    disabled={loading || !input.trim()}
                    className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    Analyze Transactions
                </Button>

                {result && (
                    <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                            <span className="text-sm font-medium">Analysis Result</span>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Total Credit</p>
                                <span className="text-green-600 font-bold text-lg">
                                    +₹{result.summary?.total_credit || 0}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {result.transactions?.map((tx: any, i: number) => (
                                <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                                    <span className="text-gray-700">{tx.merchant} <span className="text-xs text-gray-400">({tx.type})</span></span>
                                    <span className={tx.type === 'credit' ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                                        ₹{tx.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
